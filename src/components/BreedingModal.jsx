import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import '../styles/TBGmodal.css';
import BreedContractAbi from '../artifacts/contracts/BreedableToken.sol/BreedableToken.json';
import MintContractAbi from '../artifacts/contracts/Mint.sol/Mint.json';


const BreedContractAddress = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';
const MintContractAddress = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';


    const Modal = ({ open, onClose, onSave, listedIds }) => {
        const [price, setPrice] = useState('');
        const [selectedEntity, setSelectedEntity] = useState(null);
        const [entities, setEntities] = useState([]);
        const { address, isConnected } = useWeb3ModalAccount();
        const { provider } = useWeb3ModalProvider();
    
        useEffect(() => {
            if (!isConnected || !address) {
              console.log("Wallet not connected or address not found");
              return;
            }
          
            const fetchEntitiesFromBlockchain = async () => {
              try {
                const ethersProvider = new ethers.providers.Web3Provider(provider);
                const signer = ethersProvider.getSigner();
                const BreedContract = new ethers.Contract(BreedContractAddress, BreedContractAbi.abi, signer);
                const mintContract = new ethers.Contract(MintContractAddress, MintContractAbi.abi, signer);
                const balance = await mintContract.balanceOf(address);
                const tokenIds = await Promise.all([...Array(balance.toNumber()).keys()].map(async (index) => {
                  return mintContract.tokenOfOwnerByIndex(address, index);
                }));
          
                const entitiesDetails = await Promise.all(tokenIds.map(async (tokenId) => {
                  const details = await BreedContract.getTokenDetails(tokenId);
                  const { claimShare, breedPotential, generation, age } = details;
          
                  return {
                    id: tokenId.toString(),
                    claimshare: claimShare.toString(),
                    breedpotential: breedPotential.toString(),
                    generation: generation.toString(),
                    age: age.toString(),
                  };
                }));
          
                setEntities(entitiesDetails);
              } catch (error) {
                console.error('Could not retrieve entities:', error);
              }
            };
          
            fetchEntitiesFromBlockchain();
          }, [isConnected, address, provider ]);
          

    

    const EntityCard = ({ entity, onSelect, isSelected }) => (
        <div className={`entity-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(entity)}>
            <img src={entity.image} alt={entity.title} />
            <h3>{entity.title}</h3>
            <p>{entity.gender}</p>
            <p>Claimshare: {entity.claimshare}</p>
        </div>
    );

    const handleEntitySelection = (entity) => {
        setSelectedEntity(entity);
    };

    const handleSave = async () => {
        if (!selectedEntity) {
            alert('Please select an Entity.');
            return;
        }

        if (!price) {
            alert('Please set a price.');
            return;
        }

        if (selectedEntity.gender !== 'Sire') {
            alert('Only Sires can be listed for breeding. Breeders are not allowed.');
            return;
        }

        try {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(BreedContractAddress, BreedContractAbi, signer);
            const transaction = await contract.listEntityForBreeding(selectedEntity.id, ethers.utils.parseEther(price));
            await transaction.wait();

            onSave({
                ...selectedEntity,
                price: parseFloat(price),
            });

            setPrice('');
            setSelectedEntity(null);
            onClose();
        } catch (error) {
            console.error('Error listing entity for breeding:', error);
            alert('Failed to list entity for breeding. Please try again.');
        }
    };

    if (!open) return null;

    return (
        <div className='breeding-overlay'>
            <button onClick={onClose} className="breeding-close-btn">x</button>
            <div className='breeding-modalContainer'>
                <div className='breeding-modalHeader'>
                    <h5>List Your Entity for Breeding</h5>
                </div>
                <div className='breeding-modalBody'>
                    <div className="entity-cards-container">
                        {entities.filter(entity => !listedIds.includes(entity.id) && entity.gender === 'Sire').map(entity => (
                            <EntityCard 
                                key={entity.id} 
                                entity={entity} 
                                onSelect={handleEntitySelection} 
                                isSelected={selectedEntity && entity.id === selectedEntity.id}
                            />
                        ))}
                    </div>
                    <input className='price-tab' type="number" placeholder="Price in ETH" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className='breeding-modalFooter'>
                    <button onClick={handleSave}>List for Breeding</button>
                </div>
            </div>
        </div>
    );
};
export default Modal;


