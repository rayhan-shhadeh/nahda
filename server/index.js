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
  console.error('ANTHROPIC_API_KEY not found in process.env');
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

IMPORTANT: Return ONLY valid JSON with no markdown formatting or extra text. Format:
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
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw Claude response:', JSON.stringify(data, null, 2));
  
    // Extract the text from Claude's response
    const text = data.content[0].text;
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        // Clean up the JSON string
        let jsonString = jsonMatch[0];
        
        // Remove trailing commas
        jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
        
        // Parse the cleaned JSON
        const parsed = JSON.parse(jsonString);
        
        // Ensure all required fields exist
        const result = {
          hook: parsed.hook || `${theme} with FocusFlow ✨`,
          caption: parsed.caption || "Get FocusFlow Planner today!",
          visual: parsed.visual || `${contentType.type} showcasing FocusFlow Planner`,
          hashtags: parsed.hashtags || "#FocusFlow #StudyTok #ProductivityPlanner"
        };
        
        console.log('Parsed result:', result);
        return res.json(result);
        
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Failed JSON:', jsonMatch[0]);
        
        // Return fallback content
        return res.json({
          hook: `${theme} with FocusFlow ✨`,
          caption: text.substring(0, 500),
          visual: `${contentType.type} showcasing FocusFlow Planner`,
          hashtags: "#FocusFlow #StudyTok #ProductivityPlanner"
        });
      }
    }
    
    // If no JSON found, return fallback
    return res.json({
      hook: `${theme} with FocusFlow ✨`,
      caption: text,
      visual: `${contentType.type} showcasing FocusFlow Planner`,
      hashtags: "#FocusFlow #StudyTok #ProductivityPlanner"
    });
    
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ 
      error: err.message,
      hook: `${theme} with FocusFlow ✨`,
      caption: "Get FocusFlow Planner today!",
      visual: `${contentType.type} showcasing FocusFlow Planner`,
      hashtags: "#FocusFlow #StudyTok #ProductivityPlanner"
    });
  }
});
app.listen(3001, () => console.log("Server running on http://localhost:3001"));
