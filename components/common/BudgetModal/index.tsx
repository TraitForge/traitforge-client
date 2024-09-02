'use client'

import React, { useState } from 'react';
import styles from './styles.module.scss';

type BudgetModalTypes = {
  budgetAmount: string;
  setBudgetAmount: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  bg?: string;
  borderColor?: string;
  handleMintEntity: () => void;
  handleMintWithBudget: () => void;
};

const BudgetModal = ({
  budgetAmount,
  setBudgetAmount,
  onSubmit,
  onClose,
  bg,
  borderColor,
  handleMintEntity,
  handleMintWithBudget,
}: BudgetModalTypes) => {
  const [step, setStep] = useState<number>(1); 

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setBudgetAmount(event.target.value);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.container}>
            <h3 className="text-[24px]">Mint Options</h3>
            <button
              className={styles.submitbutton}
              onClick={handleMintEntity}
            >
              Mint 1 Entity
            </button>
            <button
              className={styles.submitbutton}
              onClick={() => setStep(2)}
            >
              Mint with Budget
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.75 5.25l-13.5 13.5M18.75 18.75L5.25 5.25"
                />
              </svg>
            </button>
          </div>
        );
      case 2:
        return (
          <div className={styles.container}>
            <h3 className="text-[24px]">Enter ETH Amount</h3>
            <input
              type="text"
              className="w-[70%] md:w-[30%] text-base rounded-md mb-2 border-2 border-primary py-1 px-4 text-[#023340] focus:border-[#007ea1] outline-none"
              value={budgetAmount}
              onChange={handleInputChange}
              placeholder="ETH Amount"
            />
            <button
              className={styles.submitbutton}
              onClick={handleMintWithBudget}
            >
              Mint with Budget
            </button>
            <button
              className={styles.submitbutton}
              onClick={() => setStep(1)} // Go back to the first step
            >
              Back
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.75 5.25l-13.5 13.5M18.75 18.75L5.25 5.25"
                />
              </svg>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className="flex justify-center items-center relative md:h-full max-md:border-[3px] rounded-xl w-[70%] h-[30vh] md:w-[95%] lg:w-[70%] xl:w-[50%]">
        
        <div className={styles.container}>
        {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
