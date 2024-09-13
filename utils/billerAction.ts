import { createClient } from "./supabase/client"
import { billerCodeGenerator, referenceNumberGenerator } from "./accbsbGenerator"
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

    //Create Default Saved Billers
    // Example of a saved biller: "biller_name|biller_code|ref_num" , "biller_name2|biller_code2|ref_num"
    createDefaultSavedBillers: async (user_id: string): Promise<void> => {
    const supabase = createClient();

    // Fetch the first 4 billers from the 'billers' table
    const { data: billers, error: fetchError } = await supabase
      .from('billers')
      .select('*')
      .limit(4);

      if (fetchError) {
        throw new Error(`Error fetching billers: ${fetchError.message}`);
      }
  
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
      const [billerName, , referenceNum] = savedBiller.split('|'); // Split by '|' and get the reference number
      return `${billerName}|${referenceNum}`; // For biller_reference: "biller_name|reference_num"
    });

    // Join the biller references into a single string
    const billerReferences = billerReferencesArray.join(', ');

    // Prepare the single user biller entry
    const userBiller: Partial<SavedBiller> = {
      owner: user_id, // The user ID to associate with the billers
      saved_billers: savedBillers, // The string array of saved billers with reference numbers
      biller_reference: billerReferences, // The string array of biller references only
    };
  
      console.log('Inserting the following saved billers:', userBiller); // Log for debugging
  
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
      .single(); // Get a single row for the user

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
        const [, billerCode] = entry.split('|'); // Split by '|' and get the second element (biller code)
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


}