import classNames from 'classnames';
import { Button } from '~/components';
import { icons } from '~/components/icons';

type TraidingHeaderTypes = {
  handleStep: (value: string) => void;
  step: string;
};

export const TraidingHeader = ({ handleStep, step }: TraidingHeaderTypes) => {
  return (
    <div className="relative max-md:flex max-md:flex-col max-md:items-center py-5 container">
      {step !== 'one' && (
        <button
          className="absolute left-4  top-1/2 -translate-y-1/2 max-md:h-auto bg-[#081E0E] bg-opacity-80 p-5 px-6 rounded-md "
          onClick={() => handleStep(step === 'three' ? 'two' : 'one')}
        >
          {icons.arrow({ className: 'text-neon-green' })}
        </button>
      )}
      <h1 className="text-[36px] md:text-[40px] lg:text-extra-large">
        {step === 'one'
          ? 'Marketplace'
          : step === 'four'
            ? 'Buy Entity'
            : 'Sell Your Entity'}
      </h1>
      {step === 'one' && (
        <div className="md:absolute right-0 top-1/2 md:translate-y-[-50%] w-[265px]">
          <Button
            textClass="!text-[24px]"
            text="Sell Your Entity"
            variant="green"
            onClick={() => handleStep('two')}
          />
        </div>
      )}
    </div>
  );
};
