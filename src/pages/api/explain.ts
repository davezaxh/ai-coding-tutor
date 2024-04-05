import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function generateHint(req: NextApiRequest, res: NextApiResponse) {
    const { code, problemStatement, language } = req.body;

    const response = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `You are a AI Coding Tutor. You help people with writing code. YOU WILL NEVER GIVE DIRECT SOLUTIONS TO THE USER. You give relevant hints to the user to complete the program and run it sucessfully. Note, the user cannot chat with you, they can only generate a hint. The user is coding in ${language}. The user is working on the problem statement : ${problemStatement}.`},
            { role: "user", content: `Give the user a brief explanation about how to solve the problem, the code logic, relevant syntax according to the current stage they are in programming. Be brief in explanation.` },
            { role: "assistant", content: `Code : ${code}` }
        ],
        model: "gpt-3.5-turbo",
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');

    res.send(response['choices'][0]['message']['content']);
}