// components/CardSidebar.tsx

import React, { useEffect, useState } from 'react';
import DebitCard from '@/components/DebitCard';
import CreditCardModel from '@/components/CreditCardModel';
import { cardAction } from '@/lib/actions/cardAction';
import { accountAction } from '@/lib/actions/accountAction';

interface CardSidebarProps {
  owner: string; // The ownerId passed as a prop
}

const CardSidebar: React.FC<CardSidebarProps> = ({ owner }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardsAndAccounts = async () => {
      try {
        // Fetch cards based on the ownerId
        const fetchedCards = await cardAction.fetchCardById(owner);
        setCards(fetchedCards);

        // Fetch accounts based on the ownerId
        const fetchedAccounts = await accountAction.fetchAccountsbyUserId(owner);
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error('Error fetching cards or accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (owner) {
      fetchCardsAndAccounts();
    }
  }, [owner]);

  return (
    <div className="flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Your Cards</h2>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Render Debit or Credit card */}
          {cards.map((card) => {
            const linkedAccount = accounts.find(account => account.id === card.linked_to);

            if (!linkedAccount) return null; // Skip rendering if no linked account is found

            return card.card_type === 'debit' ? (
              <DebitCard
                key={card.id}
                type={card.card_type}
                name={card.owner_username}
                cardNumber={card.card_number}
                expirationDate={new Date(card.expiry_date)}
                maxSpending={linkedAccount.balance}
                cvc={parseInt(card.cvv)}
                linkedAccount={linkedAccount}
              />
            ) : (
              <CreditCardModel
                key={card.id}
                type={card.card_type}
                name={card.owner_username}
                cardNumber={card.card_number}
                expirationDate={new Date(card.expiry_date)}
                maxSpending={card.credit}
                cvc={parseInt(card.cvv)}
                linkedAccount={linkedAccount}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CardSidebar;
