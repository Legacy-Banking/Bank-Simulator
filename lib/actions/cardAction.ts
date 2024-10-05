
import { createClient } from "../supabase/client";
import { card_detailGenerator } from "../utils/accbsbGenerator";
import { accountAction } from "./accountAction";

enum AccountType {
    CREDIT = 'credit',
    DEBIT = 'debit',
}

type CardDetails = {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };

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
        const owner_username = await accountAction.fetchUsernamebyUserId(user_id);
        const userAccount = await accountAction.fetchAccountsbyUserId(user_id);
        const cards: Partial<Card>[] = [
            {
                card_type: AccountType.DEBIT,
                credit: 0, // Debit cards have no credit
                owner: user_id, // The owner of the card is the user who signed up
                card_number: debit_card_num,
                expiry_date: debit_expiry,
                cvv: debit_cvv,
                owner_username: owner_username,
                linked_to: userAccount[0].id,
            },
            {
                card_type: AccountType.CREDIT,
                credit: userAccount[2].balance, // Assign some default credit limit for the credit card
                owner: user_id,
                card_number: credit_card_num,
                expiry_date: credit_expiry,
                cvv: credit_cvv,
                owner_username: owner_username,
                linked_to: userAccount[2].id,
            }
        ];
        for (const card of cards) {
            await cardAction.createCard(card as Card);
        }
    },
    // fetchCardById: async (ownerId: string): Promise<Card[]> => {
    //     const supabase = createClient();

    //     const { data, error } = await supabase
    //         .from('cards')
    //         .select('*')
    //         .eq('owner', ownerId);

    //     if (error) {
    //         console.error('Error fetching Cards:', error);
    //         throw error;
    //     }
    //     return data as Card[];
    // }
    fetchCardById : async (ownerId: string): Promise<Card[]> => {
        const supabase = createClient();
    
        // Step 1: Fetch the card data by owner ID
        const { data: cards, error: cardError } = await supabase
            .from('cards')
            .select('*')
            .eq('owner', ownerId);
    
        if (cardError) {
            console.error('Error fetching Cards:', cardError);
            throw cardError;
        }
    
        if (!cards || cards.length === 0) {
            return [];  // Return an empty array if no cards are found
        }
    
    
        const ownerUsername = await accountAction.fetchUsernamebyUserId(ownerId);

        // Step 3: Combine the card data with the owner username
        const enrichedCards = cards.map((card) => ({
            ...card,
            owner_username: ownerUsername // Attach the owner_username to each card object
        }));
    
        return enrichedCards;
    },

    fetchCardAccountId: async ({cardNumber, expiryDate, cvv}: CardDetails) => {
        try {
          const supabase = createClient();

          const [month, year] = expiryDate.split('/');
          const expiryYear = parseInt('20' + year); 
          const expiryMonth = parseInt(month);

         const expiry = new Date(expiryYear, expiryMonth, 1); 
         const formattedExpiryDate = expiry.toISOString().split('T')[0];
    
          // Query the database for the account linked to the provided card details
          const { data, error } = await supabase
            .from('cards')
            .select('linked_to')
            .eq('card_number', cardNumber)
            .eq('expiry_date', formattedExpiryDate)
            .eq('cvv', cvv)
            .single();
    
          if (error || !data) {
            throw new Error("Card details not found or not linked to any account.");
          }

          console.log(data.linked_to)
    
          // Fetch the account using the account ID linked to the card
          const { data: accountData, error: accountError } = await supabase
            .from('account')
            .select('*')
            .eq('id', data.linked_to)
            .single();
    
          if (accountError || !accountData) {
            throw new Error("Account not found for the given card.");
          }
    
          return accountData;
        } catch (error) {
          console.error("Error fetching account for card:", error);
          throw error;
        }
      },
    
    

}