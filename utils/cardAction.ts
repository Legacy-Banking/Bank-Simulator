
import { createClient } from "./supabase/client";
import { card_detailGenerator } from "./accbsbGenerator";

enum AccountType {
    CREDIT = 'credit',
    DEBIT = 'debit',
}

export const cardAction = {

    createCard: async (card: Card): Promise<void> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('cards')
            .insert(card);

        if (error) {
            throw new Error(error.message);
        }
    },

    cardSignUpInitialization: async (user_id: string): Promise<void> => {
        // Generate card details for Debit and Credit cards
        const { card_num: debit_card_num, expiry: debit_expiry, cvv: debit_cvv } = card_detailGenerator();
        const { card_num: credit_card_num, expiry: credit_expiry, cvv: credit_cvv } = card_detailGenerator();

        const cards: Partial<Card>[] = [
            {
                card_type: AccountType.DEBIT,
                credit: 0, // Debit cards have no credit
                owner: user_id, // The owner of the card is the user who signed up
                card_number: debit_card_num,
                expiry_date: debit_expiry,
                cvv: debit_cvv,
            },
            {
                card_type: AccountType.CREDIT,
                credit: 5000, // Assign some default credit limit for the credit card
                owner: user_id,
                card_number: credit_card_num,
                expiry_date: credit_expiry,
                cvv: credit_cvv,
            }
        ];
        cards.forEach(async (card) => {
            await cardAction.createCard(card as Card);
        });
    },


}