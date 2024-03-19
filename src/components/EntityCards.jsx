import React from 'react';
import { ethers } from 'ethers';
import Traitforger from '../utils/traitforgertransparent.png'; 
import ERC721ContractAbi from '../artifacts/contracts/CustomERC721.sol';

const ERC721ContractAddress = '';

function calculateEntityAttributes(entropy, entity) {
    const initializeEthersProvider = () => window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;
    const ethersProvider = initializeEthersProvider();
    const contract = new ethers.Contract(ERC721ContractAddress, ERC721ContractAbi.abi, ethersProvider);

    const getFinalNukeFactor = contract.calculateFinalNukeFactor(entity);

    const performanceFactor = entropy % 10;
    const lastTwoDigits = entropy % 100;
    const forgePotential = Math.floor(lastTwoDigits / 10);
    const nukeFactor = Number((entropy / 40000).toFixed(1));
    const finalNukeFactor = getFinalNukeFactor;
    let role; 
    const result = entropy % 3;
    if (result === 0) {
        role = "sire"; 
    } else {
        role = "breeder"; 
    }
    
    return { role, forgePotential, nukeFactor, performanceFactor, finalNukeFactor };
}

const EntityCard = ({ entity, index }) => {
    const { role, forgePotential, nukeFactor, performanceFactor, finalNukeFactor } = calculateEntityAttributes(entity.entropy);
    const entityPrice = calculateEntityPrice(index);

    return (
        <div className='card-container'>
            <img loading="lazy" src={Traitforger} alt="Entity" className='card-image' />
            <div className='card-info'>
                <div className='card-info-always-visible'>
                    <h2 className="card-number">{entity.id}/10,000</h2>
                    <h1 className="card-price">Price: {entityPrice} ETH</h1>
                </div>
                <div className='card-info-on-hover'>
                    <div className='footer-top-level'>
                        <h3 className='card-type'>Role: {role}</h3>
                        <h3 className="card-name">Forge Potential: {forgePotential}</h3>
                        <h2 className="card-parameters-h2">Nuke Factor: {nukeFactor} %</h2>
                        <h2 className="card-parameters-h2">Nuke Factor: {finalNukeFactor} %</h2>
                        <h2 className="card-parameters-h2">Performance Factor: {performanceFactor}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntityCard;
