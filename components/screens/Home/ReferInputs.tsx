import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button, LoadingSpinner } from '~/components';

type ReferInputTypes = {
    handleReferModal:() => void;
    setTwitterHandle: (value: string) => void;
    twitterHandle: string;
    handleSubmitTwitter: () => void;
    smallLoading: boolean | null;
  };

export const ReferInputs = ({ 
    handleReferModal,
    setTwitterHandle,
    twitterHandle,
    handleSubmitTwitter,
    smallLoading
}: ReferInputTypes) => {

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setTwitterHandle(event.target.value);
    };

  return (
    <div className="w-screen h-[93vh] sm:h-screen bg-blue z-10 flex justify-center items-center">
    <div className="relative bg-blue p-2 md:p-10 rounded-[20px] items-center w-[300px] md:w-[500px] md:h-auto">
        <div className="max-md:order-3 md:px-10 mt-4 flex flex-col justify-center items-center">
        <div className="pb-[40px] flex flex-col justify-center items-center">
          <h1 className="pb-5 text-xl"> Who told you about TraitForge? 👀</h1>
          <div className="relative flex flex-row justify-center items-center  gap-3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white font-bold">@</span>
          <input
            type="text"
            className="border w-full pl-6 border-neon-blue bg-dark-81 p-3 text-white text-base focus:outline-none"
            placeholder="twitter/x"
            value={twitterHandle}
            onChange={handleInputChange}
          />
         {!smallLoading ? (
          <Button
            onClick={handleSubmitTwitter}
            bg="#023340"
            variant="blue"
            text={<FontAwesomeIcon icon={faCheck} />}
            style={{ fontSize: '25px', padding: '5px', width: '20%' }}
            textClass="font-electrolize"
          />
        ) : (
            <div>
           <LoadingSpinner color="#0ff"/>
           </div>
        )}
          </div>
        </div>
          <Button
            onClick={handleReferModal}
            bg="#023340"
            variant="blue"
            text={`I have no friends`}
            style={{ marginBottom: '15px', fontSize: '17px', padding: '5px', width: '60%' }}
            textClass="font-electrolize"
          />
        </div>
     </div>
     </div>
  );
  
};
