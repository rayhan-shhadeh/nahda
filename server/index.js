import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-content', async (req, res) => {
  const { day, theme, contentType } = req.body;
// ensure .env was loaded and provide helpful debug if key missing
let apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
    const result = dotenv.config();
    if (result.error) {
        console.error('Failed to load .env:', result.error);
    } else {
        console.error('.env loaded but ANTHROPIC_API_KEY not found. .env keys:', Object.keys(result.parsed || {}));
    }
    // show any process.env keys that might match for extra debugging
    const matches = Object.keys(process.env).filter(k => k.toUpperCase().includes('ANTHROPIC'));
    if (matches.length) console.error('Matching process.env keys:', matches);
    apiKey = process.env.ANTHROPIC_API_KEY; // re-read after attempting to load
}

  if (!apiKey) {
    return res.status(500).json({ error: "API key missing" });
  }

  const prompt = `You are a Gen Z social media marketing expert. Create promotional content for "FocusFlow Planner" - a digital planner for students.

Product Details:
- Digital notebook PDF for students and Gen Z
- Features: motivational quotes, 100-day challenges, daily reflections
- Helps with productivity and organization
- Sold on Gumroad

Content Type: ${contentType.type} for ${contentType.platform}
Theme: ${theme}
Day: ${day}

Generate:
1. An engaging hook (10-15 words max, very catchy)
2. A complete caption with emojis, line breaks, and a strong CTA
3. Visual concept description
4. 5 trending hashtags (include #FocusFlow #StudyTok)

Style: Motivational, aesthetic, minimalist, Gen Z-friendly, use lots of emojis ✨

Format your response as JSON:
{
  "hook": "...",
  "caption": "...",
  "visual": "...",
  "hashtags": "..."
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
