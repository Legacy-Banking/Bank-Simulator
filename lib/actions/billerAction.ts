import { createClient } from "../supabase/client"
import { billerCodeGenerator, referenceNumberGenerator } from "../utils/accbsbGenerator"
export const billerAction={
    createBiller:async (name:string):Promise<void>=>{
        const supabase = createClient();
        const newBiller = {
            name: name,
            biller_code: billerCodeGenerator()
        };
        supabase.from('billers').insert(newBiller);
    },

    
    //This should be admin only
    fetchAllBillers:async ():Promise<Biller[]>=>{
        const supabase = createClient();
        const { data, error } = await supabase
            .from('billers')
            .select('*');
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    },

    fetchBillerByName:async (name:string):Promise<Biller[]>=>{
        const supabase = createClient();
        const { data, error } = await supabase
            .from('billers')
            .select('*')
            .eq('name', name);
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    },

    fetchBillerById: async (billerId: string): Promise<{ name: string, biller_code: string }> => {
        const supabase = createClient();
    
        const { data: biller, error: billerError } = await supabase
          .from('billers')
          .select('name, biller_code')
          .eq('id', billerId)
          .single(); 
    
        if (billerError || !biller) {
          console.error('Failed to fetch biller details:', billerError);
          throw new Error('Biller not found');
        }
    
        return biller;
      },

      fetchPresetSavedBillers: async (): Promise<any[]> => {
        const supabase = createClient();
    
        // Fetch all billers where save_biller_status is true
        const { data: billers, error } = await supabase
            .from('billers')
            .select('*')
            .eq('save_biller_status', true);
    
        if (error) {
            console.error(`Error fetching billers: ${error.message}`);
            throw new Error(`Error fetching billers: ${error.message}`);
        }
    
        return billers || [];
    },

    //Create Default Saved Billers
    // Example of a saved biller: "biller_name|biller_code|ref_num" , "biller_name2|biller_code2|ref_num"
      createDefaultSavedBillers: async (user_id: string, billers: any[]): Promise<void> => {
      const supabase = createClient();

        if (!billers || billers.length === 0) {
          throw new Error("No billers found to insert.");
        }
    
      // Prepare the savedBillers array with a single unique reference number per biller
      const savedBillersArray = billers.map((biller) => {
        const referenceNumber = referenceNumberGenerator(); // Generate a unique reference number for each biller

        // For saved_billers: "biller_name|biller_code|reference_num"
        return `${biller.name}|${biller.biller_code}|${referenceNumber}`;
      });

      // Join the saved billers into a single string
      const savedBillers = savedBillersArray.join(', ');

      // Extract the reference number from the savedBillersArray to use in biller_reference
      const billerReferencesArray = savedBillersArray.map((savedBiller) => {
        const [billerName, , referenceNum] = savedBiller.split('|'); // Split '|' and get the reference number
        return `${billerName}|${referenceNum}`; 
      });

      // Join the biller references into a single string
      const billerReferences = billerReferencesArray.join(', ');

      // Prepare the single user biller entry
      const userBiller: Partial<SavedBiller> = {
        owner: user_id, 
        saved_billers: savedBillers, 
        biller_reference: billerReferences, 
      };
        
        // Insert a single row into the 'user_billers' table
        const { error: insertError } = await supabase
          .from('user_billers')
          .insert([userBiller]);
    
        if (insertError) {
          throw new Error(`Error inserting user billers: ${insertError.message}`);
        }
      },
    
    // Function to fetch the saved billers from 'user_billers' table for a user
    fetchSavedBillers: async (user_id: string): Promise<string[]> => {
    const supabase = createClient();

    // Fetch the user's saved billers from the 'user_billers' table
    const { data: userBillers, error: fetchError } = await supabase
      .from('user_billers')
      .select('saved_billers')
      .eq('owner', user_id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching user billers: ${fetchError.message}`);
    }

    if (!userBillers || !userBillers.saved_billers) {
      throw new Error("No saved billers found for the user.");
    }

    // Return the saved billers as an array of strings
    return userBillers.saved_billers.split(', ');
    },


    // Function to fetch corresponding billers from saved_billers
    fetchBillersFromSavedBillers: async (user_id: string): Promise<Biller[]> => {
    const supabase = createClient();

    const savedBillersArray = await billerAction.fetchSavedBillers(user_id);

    // Extract the biller codes from saved billers
    const billerCodes = savedBillersArray.map((entry: string) => {
        const [, billerCode] = entry.split('|'); // Split '|' and get the second element (biller code)
        return billerCode;
      });

    // Fetch the corresponding billers from the 'billers' table using the extracted biller codes
    const { data: billers, error: billersFetchError } = await supabase
      .from('billers')
      .select('*')
      .in('biller_code', billerCodes); // Query based on the biller codes

    if (billersFetchError) {
      throw new Error(`Error fetching billers: ${billersFetchError.message}`);
    }

    return billers || [];
  },

  // Add a new biller to the user's saved billers if it doesn't already exist
  addNewBiller: async (
    biller_name: string,
    biller_code: string,
    reference_number: string,
    owner: string
  ): Promise<void> => {
    const supabase = createClient();

    // Fetch the current saved billers
    const savedBillersArray = await billerAction.fetchSavedBillers(owner);

    // Format the new biller string
    const newBiller = `${biller_name}|${biller_code}|${reference_number}`;

    // Check if the new biller already exists in the saved billers array
    const billerExists = savedBillersArray.some(
      (biller: string) => biller === newBiller
    );

    if (!billerExists) {
      // Add the new biller to the array if it doesn't already exist
      savedBillersArray.push(newBiller);

      // Update the user's saved billers in the database
      const { error: updateError } = await supabase
        .from("user_billers")
        .update({ saved_billers: savedBillersArray.join(", ") })
        .eq("owner", owner);

      if (updateError) {
        throw new Error(`Error updating saved billers: ${updateError.message}`);
      }
    } 
  },

    // Function to fetch reference number by biller name
    fetchReferenceNumberByBillerName: async (user_id: string, billerName: string): Promise<string | null> => {
        const supabase = createClient();
    
        // Fetch the 'biller_reference' from the 'user_billers' table for the given user_id
        const { data: userBillers, error: fetchError } = await supabase
          .from('user_billers')
          .select('biller_reference')
          .eq('owner', user_id)
          .single(); // Assuming there's only one row per user
    
        if (fetchError || !userBillers) {
          console.error('Error fetching user billers:', fetchError);
          return null;
        }
    
        const billerReference = userBillers.biller_reference;
    
        if (!billerReference) {
          console.error('No biller reference found for the user.');
          return null;
        }
    
        // billerReference is a string like "biller_name|reference_num, biller_name2|reference_num2"
        const billerArray = billerReference.split(', ').map((entry: string) => entry.split('|'));
    
        // Find the biller entry that matches the billerName
        const foundBiller = billerArray.find(([name]: [string, string]) => name === billerName);
    
        if (!foundBiller) {
          console.error(`No reference number found for biller: ${billerName}`);
          return null;
        }
    
        // The second element of the foundBiller array is the reference number
        const referenceNumber = foundBiller[1];
        return referenceNumber || null;
    },

    addReferenceNumber: async (user_id: string, billerName: string, referenceNumber: string): Promise<void> => {
      const supabase = createClient();
    
      // Fetch the existing biller_reference for the user
      const { data: userBillers, error: fetchError } = await supabase
        .from('user_billers')
        .select('biller_reference')
        .eq('owner', user_id)
        .single();
    
      if (fetchError || !userBillers) {
        console.error(`Failed to fetch user billers: ${fetchError?.message || 'Unknown error'}`);
        throw new Error(`Failed to fetch user billers: ${fetchError?.message || 'Unknown error'}`);
      }
      
      // Append the new reference to the existing biller_reference
      const billerReference = userBillers.biller_reference;    
      const updatedBillerReference = billerReference
        ? `${billerReference}, ${billerName}|${referenceNumber}`
        : `${billerName}|${referenceNumber}`;
        
      // Update the user's biller_reference column
      const { error: updateError } = await supabase
        .from('user_billers')
        .update({ biller_reference: updatedBillerReference })
        .eq('owner', user_id);
    
      if (updateError) {
        console.error(`Failed to update biller reference: ${updateError.message}`);
        throw new Error(`Failed to update biller reference: ${updateError.message}`);
      }
    },
  

}