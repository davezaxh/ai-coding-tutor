import { NextApiRequest, NextApiResponse } from "next";

export default async function compileCode(req: NextApiRequest, res: NextApiResponse) {
    const { code, lid } = req.body;
    const baseurl = process.env.JUDGE0_URL;

    const response = await fetch(`${baseurl}/submissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({source_code : code, language_id : lid}),
    });
    
    const data = await response.json();
    console.log(data);
    
    let output;
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 1 second
    const request = await fetch(`${baseurl}/submissions/batch?tokens=${data.token}`);
    output = await request.json();

    if(output.submissions[0].stdout === null){
        res.status(200).json({stderr: output.submissions[0].stderr});
    }
    else if(output.submissions[0].stderr === null){
        res.status(200).json({stdout: output.submissions[0].stdout});   
    }

    console.log(output);

    }
