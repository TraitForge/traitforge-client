import classNames from 'classnames';
import { icons } from '~/components/icons';

type HoneyPotHeaderTypes = {
  step: string;
  handleStep: (value: string) => void;
};

export const HoneyPotHeader = ({ step, handleStep }: HoneyPotHeaderTypes) => {
  const getPreviousStep = () => {
    if (step === 'three') return 'two';
    if (step === 'two') return 'one';
    return 'one';
  };

  const classes = classNames('pt-[54px] pb-[24px]', {
    'bg-custom-radial': step === 'two',
  });

  return (
    <div className={classes}>
      <div className="relative container">
        {step !== 'one' && (
          <button
            className="absolute left-0  top-1/2 -translate-y-1/2 max-md:h-auto bg-[#0C001F] bg-opacity-80 p-5 px-6 rounded-md "
            onClick={() => handleStep(getPreviousStep())}
          >
            {icons.arrow({ className: 'text-neon-purple' })}
          </button>
        )}
        <h1 className="text-[36px] md:text-extra-large">
          {step === 'one' ? 'The Nukefund' : 'Nuke Entity'}
        </h1>
      </div>
    </div>
  );
};
