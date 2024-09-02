import { icons } from '~/components/icons';

type MintingHeaderTypes = {
  handleStep: (value: string) => void;
  step: string;
};

export const MintingHeader = ({
    handleStep,
    step
    }: MintingHeaderTypes) => {
  return (
    <div className="relative max-md:flex max-md:flex-col max-md:items-center py-5 container">
      {step !== 'one' && (
        <button
          className="absolute left-4  top-1/2 -translate-y-1/2 max-md:h-auto bg-[#003f3fa3] bg-opacity-80 p-5 px-6 rounded-md "
          onClick={() => handleStep(step === 'three' ? 'two' : 'one')}
        >
          {icons.arrow({ className: 'text-neon-blue' })}
        </button>
      )}
    </div>
  );
};
