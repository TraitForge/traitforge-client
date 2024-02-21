const express = require('express');
const sharp = require('sharp');
const Web3 = require('web3'); 

const web3Methods = new Web3('http://localhost:8545');

const app = express();
const port = 3001;

async function getEntityAgeFromBlockchain(entityId) {
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    const contractABI = ''; 

    const contract = new web3Methods.eth.Contract(contractABI, contractAddress);
    try {
        const age = await contract.methods.getEntityAge(entityId).call();
        return age;
    } catch (error) {
        console.error("Could not fetch entity's age from blockchain:", error);
        throw new Error("Blockchain interaction failed");
    }
}


app.get('/entity-image/:entityId', async (req, res) => {
    try {
        const entityId = req.params.entityId;
        const age = await getEntityAgeFromBlockchain(entityId);
        const imagePath = '../utils/traitforgertransparent.png'; 
        const saturationLevel = Math.min(age / 100, 1); 

        const processedImage = await sharp(imagePath)
            .modulate({
                saturation: 1 + saturationLevel, 
            })
            .toBuffer();

        res.type('image/jpeg').send(processedImage);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});