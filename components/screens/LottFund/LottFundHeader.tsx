import classNames from 'classnames';
import { icons } from '~/components/icons';
import { Button } from '~/components/common/buttons/Button';
import { useLottFundBidAmount, useLottFundMaxBidAmount } from '~/hooks';

type LottFundHeaderTypes = {
  setSelectedForBidding: (value: number[]) => void;
  step: string;
  handleStep: (value: string) => void;
  bidEntity: () => void;
  selectedForBidding?: number[];
};

export const LottFundHeader = ({setSelectedForBidding, step, handleStep, bidEntity, selectedForBidding }: LottFundHeaderTypes) => {
  const { data: bidAmount } = useLottFundBidAmount();
  const { data: maxBidAmount } = useLottFundMaxBidAmount();
  const getPreviousStep = () => {
    setSelectedForBidding([]);
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
        {step === 'two' && (
        <Button
            bg="rgba(12, 0, 31,0.8)"
            variant="purple"
            text={selectedForBidding?.length == 0 ? "Select Entities" : "Bid"}
            onClick={bidEntity}
            textClass="font-bebas !text-[32px] !px-20 capitalize"
          />
          )}
      </div>
    </div>
  );
};
