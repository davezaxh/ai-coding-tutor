import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MDXProvider } from '@mdx-js/react'
import { useRouter } from 'next/router';

export default function index() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { problemStatement } = router.query;
  const [language, setLanguage] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [hints, setHints] = useState<string[]>([]);

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
      setHints((prevHints: any) => [...prevHints, cleanedChunk]);

      // Read some more, and call this function again
      return reader.read().then(processText);
    });
  }

  return (
    <div className='p-3'>
      <div>
        <Link href="/">
          <h1 className='text-4xl font-bold mb-4'>
            AI Coding Tutor
          </h1>
        </Link>
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
              <h1 className='text-lg font-bold'>Hints & Solutions</h1>
              <button onClick={generateHint} className='p-2 flex flex-row gap-2 font-bold rounded-lg bg-yellow-400 hover:bg-yellow-500'>
                <p>Hint</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 my-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
            <div style={{ height: '47vh', overflow: 'auto' }}>
              <div>
                <MDXProvider>
                  {hints.map((hint, index) => (
                    <div key={index} className='bg-white p-2 rounded-xl mt-2'>
                      {hint}
                    </div>
                  ))}
                </MDXProvider>
              </div>
            </div>
          </div>
        </div>
        <div className='p-2 bg-gray-700 h-[20vh]'>
        </div>
      </div>
    </div>
  )
}
