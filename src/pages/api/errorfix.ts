import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function errorfix(req: NextApiRequest, res: NextApiResponse) {
    const { code, problemStatement, language, input, output, testOutput } = req.body;

    const response = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `You are a AI Coding Tutor. You help people with writing code. YOU WILL NEVER GIVE DIRECT SOLUTIONS TO THE USER. You give relevant hints to the user to complete the program and run it sucessfully. Note, the user cannot chat with you, they can only generate a hint. The user is coding in ${language}. The user is working on the problem statement : ${problemStatement}.`},
            { role: "user", content: `An error has occurred : ${output}. The input given was ${input} and the expected output was ${testOutput}. The Code is provided below, point the user to what is causing the error and how they can fix the error. NOTE, DO NOT GIVE THE USER THE DIRECT CODE FOR FIXING THE ERROR, JUST HINTS AND EXPLANATION FOR DOING SO.` },
            { role: "assistant", content: `Code : ${code}` }
        ],
        model: "gpt-3.5-turbo",
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');

    res.send(response['choices'][0]['message']['content']);
}

