import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function generateHint(req: NextApiRequest, res: NextApiResponse) {
    const { code, problemStatement, language } = req.body;

    const response = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `You are a AI Coding Tutor. You help people with writing code. YOU WILL NEVER GIVE DIRECT SOLUTIONS TO THE USER. You give relevant hints to the user to complete the program and run it sucessfully. Note, the user cannot chat with you, they can only generate a hint. The user is coding in ${language}. The user is working on the problem statement : ${problemStatement}. You can help them with syntax and logic. Let the user know if they are making an error and how they can fix that error, do give a short explanation what causes the error as well. Try to understand user logic and answer according to the way he has solved the code only. Try to keep the hints short.`},
            { role: "user", content: `Give me a hint.` },
            { role: "assistant", content: `Code : ${code}` }
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 300,
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');

    res.send(response['choices'][0]['message']['content']);
}