import React from 'react';

import { icons } from '~/components/icons';

type ListingHeaderTypes = {
  handleStep: (value: string) => void;
  step: string;
};

export const ListingHeader = ({ handleStep, step }: ListingHeaderTypes) => {
  const handleButtonClick = () => {
    if (step === 'two') {
      handleStep('one');
    } else if (step === 'three') {
      handleStep('two');
    }
  };

  return (
    <div className="relative max-md:flex max-md:flex-col max-md:items-center mb-8">
      {(step === 'two' || step === 'three') && (
        <button
          className="absolute left-0  top-1/2 -translate-y-1/2 max-md:h-auto bg-[#23160A] bg-opacity-80 p-5 px-6 flex justify-center items-center rounded-md "
          onClick={() => handleButtonClick()}
        >
          {icons.arrow({ className: 'text-neon-orange' })}
        </button>
      )}
      <h1 className="text-[36px] text-center md:text-extra-large">
        {step === 'one' ? 'List A Forger' : 'List Your Forger'}
      </h1>
    </div>
  );
};
