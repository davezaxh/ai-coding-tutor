import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react'

export default function index() {
  const [code, setCode] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const [hint, setHint] = useState("");

  async function generateHint() {
    const response = await fetch('/api/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, problemStatement, language }),
    });

    if (!response.body) {
      throw Error("ReadableStream not yet supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    reader.read().then(function processText({ done, value }): Promise<void> {
      if (done) {
        console.log('Stream complete');
        return Promise.resolve();
      }

      // Decode the stream
      const chunk = decoder.decode(value);
      // Remove backticks from the chunk
      const cleanedChunk = chunk.replace(/`/g, '');
      // Update the hint state with the cleaned data
      setHint(cleanedChunk);

      // Read some more, and call this function again
      return reader.read().then(processText);
    });
  }

  //Temporarily set a random problem statement
  useEffect(() => {
    setProblemStatement("Write a JavaScript function to calculate the sum of two numbers. ");
  }, [])

  return (
    <div className='p-3'>
      <div>
        <h1 className='text-4xl font-bold'>AI Coding Tutor</h1>
      </div>
      <div className='flex flex-col gap-2'>
        <div>
          <h1 className='text-xl font-semibold'>Problem Statement : </h1>
          <p>{problemStatement}</p>
        </div>
        <div className='h-[60vh] grid grid-cols-12 gap-2'>
          <div className='col-span-8 bg-gray-200 p-4 rounded-xl'>
            <div className='pb-3 flex flex-row gap-2'>
              <h1 className='p-2'>Select Language : </h1>
              <select className='p-2 bg-gray-100 rounded-lg' onChange={(e) => setLanguage(e.target.value)}>
                <option value="js">Javascript</option>
                <option value="py">Python</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <ReactCodeMirror
              theme="light"
              value={code}
              height='47vh'
              onChange={(value) => setCode(value)}
            />
          </div>
          <div className='col-span-4 bg-gray-200 p-4 rounded-xl'>
            <div className='flex flex-row justify-between'>
              <h1 className='text-lg'>Hints & Solutions</h1>
              <button onClick={generateHint} className='p-2 flex flex-row gap-2 text-white rounded-lg bg-purple-600 hover:bg-purple-700'>
                <p>Hint</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 my-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
            {hint}
          </div>
        </div>
        <div className='p-2 bg-gray-700 h-[20vh]'>
        </div>
      </div>
    </div>
  )
}
