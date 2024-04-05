import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function generateHint(req: NextApiRequest, res: NextApiResponse) {
    const { code, problemStatement, language } = req.body;

    const response = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `You are a helpful assistant that translates English to ${language} code. Give explanation too in depth 200 words.` },
            { role: "user", content: problemStatement },
            { role: "assistant", content: `Code : ${code}` }
        ],
        model: "gpt-3.5-turbo",
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');

    res.send(response['choices'][0]['message']['content']);
}