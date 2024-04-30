import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function Landing() {

    const [problemStatement, setProblemStatement] = useState("");
    const [input, setInput] = useState("");
    const [testOutput, setTestOutput] = useState("");
    const router = useRouter();

    function updateProblemStatement(e: any) {
        e.preventDefault();
        if (problemStatement.trim() !== "") {
            // Encode the values to ensure they are URL-safe
            const encodedProblemStatement = encodeURIComponent(problemStatement);
            const encodedInput = encodeURIComponent(input);
            const encodedTestOutput = encodeURIComponent(testOutput);

            // Construct the URL with all parameters
            router.push(`/ide?problemStatement=${encodedProblemStatement}&input=${encodedInput}&testOutput=${encodedTestOutput}`);
        } else {
            alert("Please enter a problem statement before submitting.");
        }
    }
    return (
        <div className='flex h-screen justify-center items-center'>
            <div className='text-center'>
                <Link href="/">
                    <h1 className='text-4xl font-bold mb-4'>
                        AI Coding Tutor
                    </h1>
                </Link>
                <div>
                    <h1 className='text-xl font-bold'>Enter problem statement you are trying to solve here :</h1>
                    <div className='flex flex-col gap-3'>
                        <textarea
                            placeholder='Enter problem statement here....'
                            className='border p-2 mt-2 rounded-xl'
                            rows={4} // Set the default number of lines to 4
                            value={problemStatement}
                            onChange={(e) => setProblemStatement(e.target.value)}
                            style={{ minWidth: '300px' }} // Set a minimum width for the textarea
                        />
                        <div className='flex flex-col'>
                            <h2 className='text-left font-semibold'>Test Input : </h2>
                            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2} cols={50} className='border p-2 mt-1 rounded-xl' />
                        </div>
                        <div className='flex flex-col'>
                            <h2 className='text-left font-semibold'>Test Output : </h2>
                            <textarea rows={2} cols={50} value={testOutput} onChange={(e) => setTestOutput(e.target.value)} className='border p-2 mt-1 rounded-xl' />
                        </div>
                        <button className='bg-yellow-400 py-3 rounded-lg font-bold' onClick={updateProblemStatement}>
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}