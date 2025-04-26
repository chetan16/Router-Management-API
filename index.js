const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

// Router credentials and URL
const ROUTER_URL = 'http://192.168.1.1/'; 
const USERNAME = 'admin'; 
const PASSWORD = 'admin'; 

// Middleware for JSON
app.use(express.json());

// Fetch Router Status
app.get('/router/status', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    
    await page.goto(ROUTER_URL);

   
    await page.type('#username', USERNAME);
    await page.type('#password', PASSWORD);
    await page.click('#loginBtn');

  
    await page.waitForTimeout(3000);

 
    const routerData = await page.evaluate(() => {
      return {
        model: document.querySelector('#model-info').innerText,
        firmwareVersion: document.querySelector('#firmware-version').innerText,
        macAddress: document.querySelector('#mac-address').innerText,
        serialNumber: document.querySelector('#serial-number').innerText,
        uptime: document.querySelector('#uptime').innerText,
      };
    });

    await browser.close();
    res.json(routerData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch router status' });
  }
});


// Enable WiFi
app.post('/router/settings/wifi/enable', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto(ROUTER_URL);

   
    await page.type('#username', USERNAME);
    await page.type('#password', PASSWORD);
    await page.click('#loginBtn');


    await page.waitForTimeout(3000);

   
    await page.click('#wifi-enable-btn');
    await page.waitForTimeout(2000); 

    await browser.close();
    res.json({ success: true, message: "WiFi has been enabled." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to enable WiFi" });
  }
});

// Disable WiFi
app.post('/router/settings/wifi/disable', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto(ROUTER_URL);

  
    await page.type('#username', USERNAME);
    await page.type('#password', PASSWORD);
    await page.click('#loginBtn'); 

    
    await page.waitForTimeout(3000);

  
    await page.click('#wifi-disable-btn'); 
    await page.waitForTimeout(2000);

    await browser.close();
    res.json({ success: true, message: "WiFi has been disabled." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to disable WiFi" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
