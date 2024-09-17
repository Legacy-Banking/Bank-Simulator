"use client";

import React, { useState, useEffect } from 'react';
import HeaderBox from '@/components/HeaderBox';
import DebitCard from '@/components/DebitCard';
import CreditCardModel from '@/components/CreditCardModel';
import { useSearchParams } from 'next/navigation';
import { cardAction } from '@/utils/cardAction';
import { useAppSelector } from '@/app/store/hooks';

const Cards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const ownerId = useAppSelector((state) => state.user.user_id); // Assuming user ID is stored in Redux
  useEffect(() => {
    if (ownerId) {
      cardAction.fetchCardById(ownerId)
        .then((data) => {
          setCards(data);
        })
        .catch((error) => {
          console.error('Error fetching cards:', error);
        });
    }
  }, [ownerId]);

  return (
    <section className="flex w-full flex-row font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72">
        <header className="home-header">
          <HeaderBox
            type="title"
            title="Your cards"
            subtext="Effortlessly Manage Your Available Cards and Activities"
          />
        </header>

        <div className="subheader mt-2 sm:mt-4 mb-4 sm:mb-6">
          <h2 className="text-20 lg:text-24 font-semibold text-blackText-50">Cards:</h2>
        </div>
        <div className="flex flex-col gap-10 flex-wrap">
          {cards.map((card) => (
            card.card_type === 'debit' ? (
              <DebitCard
                key={card.id}
                type={card.card_type}
                name={card.owner_username}
                cardNumber={parseInt(card.card_number)}
                expirationDate={new Date(card.expiry_date)}
                maxSpending={card.credit}
                spending={123} // assuming spending is fetched separately
                cvc={parseInt(card.cvv)}
              />
            ) : (
              <CreditCardModel
                key={card.id}
                type={card.card_type}
                name={card.owner_username}
                cardNumber={parseInt(card.card_number)}
                expirationDate={new Date(card.expiry_date)}
                maxSpending={card.credit}
                spending={0} // assuming spending is fetched separately
                cvc={parseInt(card.cvv)}
              />
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cards;
