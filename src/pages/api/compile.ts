import { NextApiRequest, NextApiResponse } from "next";
const baseurl = process.env.JUDGE0_URL;

export default async function compileCode(req: NextApiRequest, res: NextApiResponse) {
    const { code, language } = req.body;
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
        },
        body: JSON.stringify({source_code : code, language_id : lid}),
    });
    // console.log(code+"\n"+language);
    
    const data = await response.json();
    console.log(data);
    // console.log(data);
    
    let output;
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 1 second
    const request = await fetch(`${baseurl}/submissions/batch?tokens=${data.token}`);
    output = await request.json();
    // console.log(output);

    if(language !== "cpp"){
        if(output.submissions[0].stdout === null){
            res.status(200).json({output: output.submissions[0].stderr});
        }
        else if(output.submissions[0].stderr === null){
            res.status(200).json({output: output.submissions[0].stdout});   
        }
    }

    else{
        if(output.submissions[0].stdout === null){
            res.status(200).json({output: output.submissions[0].compile_output});
        }
        else if(output.submissions[0].compile_output === null){
            res.status(200).json({output: output.submissions[0].stdout});
        }
    }


    }
