import express from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { readFileSync } from 'fs';

const app = express();
const port = 3000;

app.get('/', async(req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://sketchtoy.com/71247016');
        const element = await page.$('.sketch-canvas');
        if (element) {
            const screenshotPath = 'screenshot.png';
            await element.screenshot({ path: screenshotPath });

            const imageData = readFileSync(screenshotPath); 
            // console.log(imageData.toString('base64')); 

            const response = await axios.post('https://script.google.com/macros/s/AKfycbzMXT_PUiDShIBanhOKxpP-az0pBDHvghZv6LSIGcKF_kDusIdKDyVl2se673kWrMKPhw/exec', {
              imageData: imageData.toString('base64')
            });
            console.log(response.data); 
            res.send('Screenshot taken and saved to Google Drive');
        } else {
            res.status(404).send('Element not found');
        }
          
        await browser.close();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
