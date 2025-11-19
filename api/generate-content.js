export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { day, theme, contentType } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY; // Note: no VITE_ prefix for backend

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
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
}`; // Your full prompt

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return res.status(200).json(JSON.parse(jsonMatch[0]));
    } else {
      return res.status(200).json({
        hook: text.substring(0, 100),
        caption: text,
        visual: `${contentType.type} showcasing FocusFlow Planner`,
        hashtags: '#FocusFlow #StudyTok #ProductivityPlanner'
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}