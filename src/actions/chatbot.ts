'use server';

export async function getChatCompletion(
    messages: { role: 'user' | 'assistant' | 'system', content: string }[],
    language: 'English' | 'Hindi' | 'Assamese' = 'English'
) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return {
            success: false,
            error: 'GROQ_API_KEY is not configured. Please add it to your .env.local file.'
        };
    }

    const systemPrompts = {
        'English': 'You are PyroBot, a human-like disaster response assistant. SPEAK LIKE A HUMAN: use short, concise sentences, natural pauses (marked by commas or dots), and a conversational tone. NEVER give long lists or blocks of text. Keep replies to 1-3 short sentences max. If you need to give a break, use "..." or a full stop. Focus on immediate, actionable advice.',
        'Hindi': 'आप पायरोबोट (PyroBot) हैं, एक मानवीय आपदा प्रतिक्रिया सहायक। एक इंसान की तरह बोलें: छोटे, संक्षिप्त वाक्यों, प्राकृतिक ठहराव (कोमा या डॉट्स द्वारा चिह्नित), और संवादात्मक लहजे का उपयोग करें। कभी भी लंबी सूची या टेक्स्ट ब्लॉक न दें। उत्तरों को अधिकतम 1-3 छोटे वाक्यों तक सीमित रखें। यदि आपको ब्रेक देने की आवश्यकता है, तो "..." या पूर्ण विराम का उपयोग करें। तत्काल, व्यावहारिक सलाह पर ध्यान केंद्रित करें।',
        'Assamese': 'আপুনি এজন মানুহৰ দৰে দুৰ্যোগ সঁহাৰি সহায়ক PyroBot। এজন মানুহৰ দৰে কথা কওক: চুটি, চমু বাক্য, প্ৰাকৃতিক বিৰতি (কমা বা ডটৰ দ্বাৰা চিহ্নিত), আৰু কথোপকথনমূলক সুৰ ব্যৱহাৰ কৰক। কেতিয়াও দীঘলীয়া তালিকা বা পাঠৰ গোট নিদিব। উত্তৰবোৰ সৰ্বাধিক ১-৩ টা চুটি বাক্যৰ ভিতৰত ৰাখক। যদি আপোনাক জিৰণি দিয়াৰ প্ৰয়োজন হয়, তেন্তে "..." বা পূৰ্ণচ্ছেদ ব্যৱহাৰ কৰক। তৎক্ষণাৎ কাৰ্যকৰী পৰামৰ্শৰ ওপৰত গুৰুত্ব দিয়ক।'
    };

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompts[language] || systemPrompts['English']
                    },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch AI response');
        }

        return {
            success: true,
            data: data.choices[0].message.content
        };
    } catch (error: any) {
        console.error('Chat Completion Error:', error);
        return {
            success: false,
            error: error.message || 'An unexpected error occurred.'
        };
    }
}
