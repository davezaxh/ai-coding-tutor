import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateHint(req: any, res: any) {

    const { code } = await req.json();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "" },
            { role: "user", content: "" },
            { role: "user", content: `Code : ${code}` }
        ],
        model: "gpt-3.5-turbo",
        stream: true,
    });

    (stream as any).on("data", (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    (stream as any).on("end", () => {
        res.end();
    });
}