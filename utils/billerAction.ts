import { createClient } from "./supabase/client"
import { billerCodeGenerator } from "./accbsbGenerator"
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
    }
}