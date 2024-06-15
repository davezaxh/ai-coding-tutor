import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'

const baseurl = process.env.JUDGE0_URL;
const apiKey = process.env.JUDGE0_API_KEY;


export default async function compileCode(req: NextApiRequest, res: NextApiResponse) {
    const { code, language, input } = req.body;
    const languageMap: { [key: string]: number } = {
        "py": 71,
        "cpp": 76,
        "js": 63
    };
    
    let lid = languageMap[language];
    const response = await fetch(`${baseurl}/submissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-key': `${apiKey}`,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({source_code : code, language_id : lid, stdin: input}),
    });
    
    const data = await response.json();
    console.log(data);
    
    let output;
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 1 second
    const request = await fetch(`${baseurl}/submissions/${data.token}`, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': `${apiKey}`,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        },
    });

    output = await request.json();

    if(language !== "cpp"){
        if(output.stdout === null){
            res.status(200).json({output: output.stderr, token: data.token});
        }
        else if(output.stderr === null){
            res.status(200).json({output: output.stdout, token: data.token});   
        }
    }

    else{
        if(output.stdout === null){
            res.status(200).json({output: output.compile_output, token: data.token});
        }
        else if(output.compile_output === null){
            res.status(200).json({output: output.stdout, token: data.token});
        }
    }


    }
