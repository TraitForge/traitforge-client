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
    <div className="md:bg-zinc-900 md:bg-opacity-85 max-md:px-5 w-full md:w-[70%] xl:w-[50%] 2xl:w-[35%] mx-auto pt-10 pb-[50px] md:px-[100px] flex flex-col rounded-[20px] items-center h-6/12">
      <h3 className="text-large font-electrolize mb-8 max-md:pt-5">Enter ETH Amount</h3>
      <input
        type="text"
        className="border w-full border-neon-blue bg-dark-81 p-3 text-neutral-100 text-base focus:outline-none"
        value={budgetAmount}
        onChange={handleInputChange}
        placeholder="ETH Amount"
      />
      <div className="max-md:order-3 max-md:px-10 mt-4">
        <Button
          onClick={handleMintWithBudget}
          bg="#023340"
          text={`Mint With a ${budgetAmount} ETH Budget`}
          textClass="font-electrolize"
          variant="secondary"
        >
          Mint with Budget
        </Button>
      </div>
    </div>
  );
};
