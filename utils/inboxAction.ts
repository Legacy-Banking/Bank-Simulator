import { createWatchCompilerHost } from "typescript";
import { createClient } from "./supabase/client";

export const inboxAction = {
    createMessage: async (fromName: string, user_id: string, description: string): Promise<void> => {
        const supabase = createClient();

        try {
            const newMessage: Partial<Message> = {
                description: description,
                date_received: new Date(),
                sender_name: fromName,
                to_user: user_id,
            };
            const { error: insertError } = await supabase
                .from('messages')
                .insert(newMessage);

            if (insertError) {
                    console.error('Failed to insert message:', insertError);
                }
        }
        catch (error) {
            console.error('Message error', error);
            throw error

        }

    
    },
    getMessageByUserId: async (userId: string): Promise<Message[]> =>{
        const supabase = createClient();
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`to_user.eq.${userId}`)
            .order('date_received', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }

        const messages = data as Message[];
        return messages;
    }
};

