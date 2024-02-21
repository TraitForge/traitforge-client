const fs = require('fs');
const sharp = require('sharp');
const express = require('express');
const path = require('path');
const app = express();
const port = 3001;
const cacheDirectory = path.join(__dirname, 'ImageCache');
const Web3 = require('web3');
const web3Methods = new Web3('http://localhost:8545');



async function getEntityAgeFromBlockchain(TokenId) {
    const contractAddress = '';
    const contractABI = ''; 

    const contract = new web3Methods.eth.Contract(contractABI, contractAddress);
    try {
        const age = await contract.methods.getTokenId(TokenId).call();
        return age;
    } catch (error) {
        console.error("Could not fetch entity's age from blockchain:", error);
        throw new Error("Blockchain interaction failed");
    }
}

if (!fs.existsSync(cacheDirectory)) {
    fs.mkdirSync(cacheDirectory);
}

app.get('/entity-image/:entityId', async (req, res) => {
    const TokenId = req.params.TokenId;
    const imagePath = 'src/utils/traitforgertransparent.png';
    const cachedImagePath = path.join(cacheDirectory, `${TokenId}.png`);

    if (fs.existsSync(cachedImagePath)) {
        console.log('Serving from cache');
        return res.sendFile(cachedImagePath);
    }

    try {
        let imageBuffer = fs.readFileSync(imagePath);
        imageBuffer = await sharp(imageBuffer).resize(200, 200).png().toBuffer();
        fs.writeFileSync(cachedImagePath, imageBuffer);

        console.log('Serving from file and caching');
        res.type('png');
        return res.send(imageBuffer);
    } catch (error) {
        console.error('Error serving image:', error);
        return res.status(500).send('Error serving image');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});