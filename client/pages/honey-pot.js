import React from 'react';
import NukeButton from '@/utils/nukebutton.png';
import '@/styles/honeypot.scss';
import { useContextState } from '@/utils/context';

function HoneyPot() {
  const {
    openModal,
    ethAmount,
    usdAmount
  } = useContextState();

  return (
    <div className="honey-pot-container">
      <h1>The HoneyPot</h1>

      <div className="frame-container">
        <div className="eth-amount">
          <h1>{ethAmount} ETH</h1>
          <p>≈ ${usdAmount} USD</p>
        </div>
      </div>

      <img src={NukeButton} className="nuke-button" onClick={() => openModal(<div>*honeypot modal*</div>)} />
    </div>
  );
}

export default HoneyPot;
