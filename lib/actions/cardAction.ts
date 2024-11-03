
import { createClient } from "../supabase/client";
import { card_detailGenerator } from "../utils/accbsbGenerator";
import { accountAction } from "./accountAction";

enum AccountType {
  SAVINGS = 'savings',
  PERSONAL = 'personal',
  CREDIT = 'credit',
  DEBIT = 'debit',
  OTHER = 'other'
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

    createCards: async (cards: Card[]): Promise<void> => {
      const supabase = createClient();
      const { error } = await supabase
          .from('cards')
          .insert(cards); // Insert multiple cards at once
  
      if (error) {
          throw new Error(error.message);
      }
  },

    cardSignUpInitialization: async (user_id: string): Promise<void> => {

        // Generate card details for Debit and Credit cards
        const { card_num: debit_card_num, expiry: debit_expiry, cvv: debit_cvv } = card_detailGenerator();
        const { card_num: credit_card_num, expiry: credit_expiry, cvv: credit_cvv } = card_detailGenerator();

        const userAccount = await accountAction.fetchAccountsbyUserId(user_id);

        // Find the debit and credit accounts
        const debitAccount = userAccount.find(account => account.type === AccountType.PERSONAL);
        const creditAccount = userAccount.find(account => account.type === AccountType.CREDIT);

        const cards: Partial<Card>[] = [
            {
                card_type: AccountType.DEBIT,
                credit: 0, // Debit cards have no credit
                owner: user_id, // The owner of the card is the user who signed up
                card_number: debit_card_num,
                expiry_date: debit_expiry,
                cvv: debit_cvv,
                owner_username: debitAccount!.owner_username,
                linked_to: debitAccount!.id,
            },
            {
                card_type: AccountType.CREDIT,
                credit: creditAccount!.balance, // Assign some default credit limit for the credit card
                owner: user_id,
                card_number: credit_card_num,
                expiry_date: credit_expiry,
                cvv: credit_cvv,
                owner_username: creditAccount!.owner_username,
                linked_to: creditAccount!.id,
            }
        ];
        await cardAction.createCards(cards as Card[]);
    },
    
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
          const expiryMonth = parseInt(month)-1;

         const expiry = new Date(Date.UTC(expiryYear, expiryMonth, 1)); 
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
    
      updateAllCardExpiryDates: async (): Promise<void> => {
        try {
          const supabase = createClient();
    
          // Step 1: Fetch all card records
          const { data: cards, error: fetchError } = await supabase
            .from('cards')
            .select('id, expiry_date');
    
          if (fetchError) {
            throw new Error(`Error fetching cards: ${fetchError.message}`);
          }
    
          if (!cards || cards.length === 0) {
            return;
          }
    
          // Step 2: Loop through each card and update the expiry date
          for (const card of cards) {
            const expiryDate = new Date(card.expiry_date);
    
            // Set the day to the 1st of the respective month
            const updatedExpiryDate = new Date(Date.UTC(expiryDate.getFullYear(), expiryDate.getMonth(), 1));
    
            // Convert the updated expiry date to a format that matches your database schema (e.g., YYYY-MM-DD)
            const formattedExpiryDate = updatedExpiryDate.toISOString().split('T')[0];
    
            // Step 3: Update the card expiry date in the database
            const { error: updateError } = await supabase
              .from('cards')
              .update({ expiry_date: formattedExpiryDate })
              .eq('id', card.id);
    
            if (updateError) {
              console.error(`Error updating expiry date for card ID ${card.id}: ${updateError.message}`);
            } 
          }
    
        } catch (error) {
          console.error("Error updating card expiry dates:", error);
          throw error;
        }
      },

}