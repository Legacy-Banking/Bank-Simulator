import { createClient } from "./supabase/client";

export const inboxAction = {
    createMessage: async (fromAccount: string, toAccount: Account, description: string): Promise<void> => {
        const supabase = createClient();

        try {
            const newMessage: Partial<Message> = {
                description: description,
                date_received: new Date(),
                from_account: fromAccount,
                to_account: toAccount.id,
            };
            const { error: insertError } = await supabase
                .from('message')
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
};