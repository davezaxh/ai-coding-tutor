import React, { useState } from 'react'
import { useRouter } from 'next/router'

export default function landing() {

    const [problemStatement, setProblemStatement] = useState("");
    const router = useRouter();

    function updateProblemStatement(e:any) {
        e.preventDefault();
        setProblemStatement(e.target.value);
        console.log(problemStatement)
    }

    return (
        <div className='flex h-screen justify-center items-center'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold mb-4'>AI Coding Tutor</h1>
                <div>
                    <h1 className='text-xl font-bold'>Enter problem statement you are trying to solve here :</h1>
                    <textarea
                        className='border p-2 mt-2 rounded-xl'
                        rows={4} // Set the default number of lines to 4
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        style={{ minWidth: '300px' }} // Set a minimum width for the textarea
                    />
                    <button onClick={updateProblemStatement}>
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    )
}