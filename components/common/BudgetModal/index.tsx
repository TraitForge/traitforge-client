import { ChangeEventHandler } from 'react';
import styles from './styles.module.scss';

type BudgetModalTypes = {
  budgetAmount: string;
  setBudgetAmount: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  bg?: string;
  borderColor?: string;
};

const BudgetModal = ({
  budgetAmount,
  setBudgetAmount,
  onSubmit,
  onClose,
  bg,
  borderColor,
}: BudgetModalTypes) => {
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    setBudgetAmount(event.target.value);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className="flex justify-center items-center relative md:h-full max-md:border-[3px] rounded-xl w-[70%] h-[30vh] md:w-[95%] lg:w-[70%] xl:w-[50%] max-md:border-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="408"
          height="92"
          fill="none"
          viewBox="0 0 408 92"
          className="absolute top-0 left-0 w-full h-full max-md:hidden"
        >
          <path
            fill={borderColor}
            d="M306.89 4.329l6.308 1.853c1.973.574 4.567.893 7.34.893h65.057l7.285 2.14v48.669l-15.744 4.62v23.747l-4.656 1.42H35.52l-4.674-1.42-.035-22.5c-.018-.814-1.084-1.581-3.039-2.15L15.12 57.884V9.215l7.285-2.14h62.587c2.79 0 5.385-.319 7.34-.898l6.326-1.848H306.89zM84.992 6.746H21.943L14 9.079v48.94l12.972 3.812c1.742.511 2.701 1.195 2.72 1.92l.052 22.63L35.058 88h337.884l5.314-1.618V62.64L394 58.02V9.08l-7.943-2.334h-65.519c-2.47 0-4.798-.282-6.54-.799L307.352 4H98.196L91.55 5.947c-1.76.517-4.07.799-6.558.799z"
          ></path>
          <path
            fill={borderColor}
            d="M308.535 2.674c.532 0 1.029.062 1.402.171l7.529 2.206c.799.234 1.864.359 2.982.359h66.725c.533 0 1.03.062 1.403.171l9.73 2.85c.372.11.568.256.568.406v49.509c0 .15-.213.302-.568.41l-15.146 4.438V86.6c0 .15-.195.291-.55.4l-7.085 2.143c-.355.115-.887.177-1.42.177H33.913c-.55 0-1.066-.062-1.438-.177l-7.067-2.143c-.355-.109-.55-.25-.55-.4l-.054-22.913c0-.333-.444-.64-1.225-.874L9.712 58.757c-.373-.11-.568-.26-.568-.411V8.906l.728-.521 9.57-2.804c.373-.109.87-.171 1.403-.171H85.1c1.137 0 2.202-.125 2.983-.36l7.546-2.205c.373-.109.853-.171 1.385-.171h211.52zM120.062 0l-10.263 2.018H97.015c-1.118 0-2.184.13-2.983.364l-7.528 2.206c-.373.109-.87.166-1.403.166H20.845c-1.137 0-2.184.13-2.983.364l-9.73 2.846-1.225.811v1.711L0 12.505V52.52l6.907 2.018v3.808c0 .328.444.645 1.225.874l7.315 2.138v18.788l7.156 2.101.017 4.354c0 .322.409.624 1.172.858l7.084 2.143c.782.24 1.883.375 3.037.375H77.59L84.48 92h60.599l6.889-2.023h96.11L254.967 92h60.599l6.889-2.023h51.65c1.136 0 2.255-.136 3.036-.375l7.067-2.143c.763-.234 1.189-.536 1.189-.858v-4.468l6.907-2.43.107-18.293 7.475-2.19c.781-.23 1.225-.546 1.225-.874V54.35L408 52.333V12.317l-6.889-2.018V8.837c0-.327-.444-.64-1.225-.868l-9.73-2.85c-.781-.23-1.864-.365-2.983-.365h-66.725c-.532 0-1.029-.057-1.402-.166l-7.529-2.206c-.798-.234-1.846-.364-2.982-.364h-16.353L282.097 0H120.062z"
          ></path>
          <path
            fill={bg}
            fillOpacity="0.8"
            d="M393 8.925v49.053l-15.754 4.656V86.57L372.587 88H35.413l-4.676-1.431-.036-22.677c-.018-.821-1.085-1.595-3.04-2.168L15 57.978V8.925l7.29-2.157h62.627c2.792 0 5.388-.321 7.344-.905L98.59 4h208.364l6.313 1.868c1.973.579 4.569.9 7.343.9h65.099L393 8.925z"
          ></path>
          <path
            fill={borderColor}
            d="M393 9.005v48.991l-15.75 4.644.018 23.84-4.996 1.52H34.728l-4.996-1.525-.053-22.65c0-.777-1.013-1.5-2.862-2.045L14 57.996V9.005l7.608-2.243H84.45c2.631 0 5.102-.304 6.95-.854L97.89 4h208.769l6.471 1.913c1.867.545 4.338.849 6.951.849h65.312L393 9.005zm-16.301 53.566l15.75-4.638V9.073l-7.289-2.149h-65.08c-2.773 0-5.369-.32-7.342-.896l-6.311-1.86H98.119l-6.328 1.855c-1.955.582-4.55.901-7.342.901H21.84l-7.288 2.15v48.86l12.657 3.73c1.956.572 3.022 1.343 3.04 2.16l.035 22.588 4.676 1.425H372.04l4.658-1.425v-23.84z"
          ></path>
        </svg>
        <div className={styles.container}>
          <h3 className="text-[24px]">Enter ETH Amount</h3>
          <input
            type="text"
            className="w-[70%] md:w-[30%] text-base rounded-md mb-2 border-2 border-primary py-1 px-4 text-[#023340] focus:border-[#007ea1] outline-none"
            value={budgetAmount}
            onChange={handleInputChange}
            placeholder="ETH Amount"
          />
          <button className={styles.submitbutton} onClick={onSubmit}>
            Mint
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
      </div>
    </div>
  );
};

export default BudgetModal;
