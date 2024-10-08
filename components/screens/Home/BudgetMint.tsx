import React from 'react';
import { Button } from '~/components'

type BudgetMintTypes = {
  budgetAmount: string;
  setStep: (value: string) => void;
  setBudgetAmount: (value: string) => void;
  onClose: () => void;
  bg?: string;
  borderColor?: string;
  handleMintWithBudget: () => void;
};

export const BudgetMint = ({
  budgetAmount,
  setBudgetAmount,
  setStep,
  onClose,
  bg,
  borderColor,
  handleMintWithBudget,
}: BudgetMintTypes) => {

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setBudgetAmount(event.target.value);
  };

  return (
    <div className="h-screen">
    <div className="md:bg-zinc-900 md:bg-opacity-85 max-md:px-5 w-full mt-[100px] py-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center h-6/12">
      <h3 className="text-large font-electrolize mb-8 max-md:pt-5">Enter ETH Amount</h3>
      <input
        type="text"
        className="border w-full border-neon-blue bg-dark-81 p-3 text-neutral-100 text-base focus:outline-none"
        value={budgetAmount}
        onChange={handleInputChange}
        placeholder="ETH Amount"
      />
      <div className="max-md:order-3 mt-4">
        <Button
          onClick={handleMintWithBudget}
          bg="#023340"
          style={{ border: '2px solid #0ff', fontSize: '20px'}}
          text={`Mint With a ${budgetAmount?.trim() || '??'} ETH Budget`}
          textClass="font-electrolize"
          variant="secondary"
        >
          Mint with Budget
        </Button>
      </div>
    </div>
    </div>
  );
};
