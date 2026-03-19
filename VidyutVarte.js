// .env ಫೈಲ್‌ನಿಂದ API Key ಓದಲು ಇದು ಅಗತ್ಯ
require('dotenv').config(); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { fetchEnergyNews } = require('./get-news');

// Gemini AI ಸೆಟಪ್
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function startVidyutVarte() {
    try {
        console.log("⚡ ವಿದ್ಯುತ್ ವಾರ್ತೆ: ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...");
        
        // 1. ಸುದ್ದಿಗಳನ್ನು ತರುವುದು (Scraping)
        const newsList = await fetchEnergyNews();

        if (newsList.length === 0) {
            console.log("ಯಾವುದೇ ಹೊಸ ಸುದ್ದಿ ಸಿಗಲಿಲ್ಲ.");
            return;
        }

        // 2. Gemini AI ಮಾಡೆಲ್ ಆಯ್ಕೆ (Flash ಮಾಡೆಲ್ ವೇಗವಾಗಿರುತ್ತದೆ)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log(`ಒಟ್ಟು ${newsList.length} ಸುದ್ದಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...\n`);

        for (let i = 0; i < newsList.length; i++) {
            const news = newsList[i];
            
            // AI ಗೆ ನೀಡುವ ಸೂಚನೆ (Prompt)
            const prompt = `
            ನೀನು ಒಬ್ಬ ವಿದ್ಯುತ್ ಇಲಾಖೆಯ ಸುದ್ದಿ ವಿಶ್ಲೇಷಕ. 
            ಈ ಸುದ್ದಿಯನ್ನು ಓದಿ, ಕನ್ನಡಿಗರಿಗೆ ಅರ್ಥವಾಗುವಂತೆ ಒಂದೇ ಸರಳ ವಾಕ್ಯದಲ್ಲಿ ಸಾರಾಂಶ ತಿಳಿಸು.
            ಸುದ್ದಿ: ${news.title}`;

            const result = await model.generateContent(prompt);
            const summary = result.response.text();

            // ಫಲಿತಾಂಶವನ್ನು ತೋರಿಸುವುದು
            console.log(`${i + 1}. 📌 ಮೂಲ ಸುದ್ದಿ: ${news.title}`);
            console.log(`   📝 AI ಸಾರಾಂಶ: ${summary}`);
            console.log(`   🔗 ಲಿಂಕ್: ${news.link}`);
            console.log("--------------------------------------------------\n");
        }

    } catch (error) {
        console.error("ಏನೋ ತಪ್ಪಾಗಿದೆ:", error);
    }
}

// ಆ್ಯಪ್ ರನ್ ಮಾಡಿ
startVidyutVarte();
