import TFLogo from './TFLogo.png';

const Entities = [
    {
        id: 1,
        title: 'Entity 1',
        gender: 'Sire', 
        claimshare: '25%',
        image: TFLogo,
    },
    {
        id: 2,
        title: 'Entity 2',
        gender: 'Breeder', 
        claimshare: '45%',
        image: TFLogo,
    },
];

export const filterEntitiesByGender = (gender) => {
    return Entities.filter(entity => entity.gender === gender);
};

export const filterEntitiesByClaimshare = (claimshare) => {
    const claimshareValue = claimshare.endsWith('%') ? claimshare : `${claimshare}%`;
    return Entities.filter(entity => entity.claimshare === claimshareValue);
};

export default Entities;
