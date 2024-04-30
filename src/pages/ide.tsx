import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MDXProvider } from '@mdx-js/react'
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

export default function index() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { problemStatement, input, testOutput } = router.query;
  const [language, setLanguage] = useState<string | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [output, setOutput] = useState('');

  const [loading, setLoading] = useState(false);

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
      // Append "🪄 Hint : " to the cleaned data
      const hintWithPrefix = "🪄 Hint : " + cleanedChunk;
      // Update the hint state with the modified data
      setHints((prevHints: any) => [...prevHints, hintWithPrefix]);

      // Read some more, and call this function again
      return reader.read().then(processText);
    });
  }

  async function runCode() {
    setLoading(true);
    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language, input }),
    });

    const data = await response.json();
    console.log(data);
    setOutput(data.output);
    setLoading(false);
  }

  async function generateExplanation() {
    const response = await fetch('/api/explain', {
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
      // Append "🔑 Hint : " to the cleaned data
      const hintWithPrefix = "✨ Explanation : " + cleanedChunk;
      // Update the hint state with the modified data
      setHints((prevHints: any) => [...prevHints, hintWithPrefix]);

      // Read some more, and call this function again
      return reader.read().then(processText);
    });
  }

  async function errorFix() {
    const response = await fetch('/api/errorfix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, problemStatement, language, input, output, testOutput }),
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
      // Append "🔑 Hint : " to the cleaned data
      const hintWithPrefix = "✨ Error Fix : " + cleanedChunk;
      // Update the hint state with the modified data
      setHints((prevHints: any) => [...prevHints, hintWithPrefix]);

      // Read some more, and call this function again
      return reader.read().then(processText);
    });
  }

  useEffect(() => {
    if (output !== '') { // Only trigger if output is not an empty string
      // Remove newline characters from both output and testOutput
      console.log("Output : ", output);
      const normalizedOutput = output.replace(/\n/g, '');
      console.log("Normailized output : ", normalizedOutput);
      console.log("Test Output : ", testOutput);

      if (testOutput === normalizedOutput) {
        toast.success("Program executes successfully!");
      } else {
        toast.error("An Error has occurred!");
        toast.success("Analysing Error Cause using AI...")
        errorFix();
      }
    }
  }, [output, testOutput]); // Include testOutput in the dependency array if its changes should also re-trigger this effect// Include testOutput in the dependency array if its changes should also re-trigger this effect

  return (
    <div className='p-3'>
      <Toaster/>
      <div className='flex flex-row justify-between'>
        <Link href="/">
          <h1 className='text-4xl font-bold mb-4'>
            AI Coding Tutor
          </h1>
        </Link>
        <Link href="/" className='bg-yellow-400 py-3 px-6 rounded-lg font-bold'>
          New Problem
        </Link>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-between items-end'>
          <div>
            <h1 className='text-xl font-semibold'>Problem Statement : </h1>
            <p>{problemStatement}</p>
          </div>
          <div className='flex flex-row gap-3'>
            <div className='flex flex-row gap-2'>
              <h1 className='font-semibold'>Test Input : </h1>
              <p>{input}</p>
            </div>
            <div className='flex flex-row gap-2'>
              <h1 className='font-semibold'>Test Output : </h1>
              <p>{testOutput}</p>
            </div>
          </div>
        </div>
        <div className='h-[60vh] grid grid-cols-12 gap-2'>
          <div className='col-span-8 bg-gray-200 p-4 rounded-xl'>
            <div className='pb-3 flex flex-row justify-between'>
              <div className='flex flex-row gap-2'>
                <h1 className='p-2'>Select Language : </h1>
                <select className='p-2 bg-gray-100 rounded-lg' onChange={(e) => { setLanguage(e.target.value) }}>
                  <option value="js">Javascript</option>
                  <option value="py">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div>
                <button onClick={runCode} className='p-2 flex flex-row gap-2 font-bold rounded-lg bg-yellow-400 hover:bg-yellow-500'>
                  {loading ? <div className='flex flex-row gap-2'>
                    <p>Running Code</p>
                    <div className="border-gray-300 h-6 w-6 animate-spin rounded-full border-4 border-t-black" />
                  </div>
                    : <div className='flex flex-row gap-2'>
                      <p>Run Code</p>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 my-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>}
                </button>
              </div>
            </div>
            <ReactCodeMirror
              theme="light"
              value={code}
              height='47vh'
              onChange={(value) => {
                setCode(value);
              }}
            />
          </div>
          <div className='col-span-4 bg-gray-200 p-4 rounded-xl'>
            <div className='flex flex-row justify-between'>
              <h1 className='text-xl font-bold'>Hints & Solutions</h1>
              <div className='flex flex-row gap-2'>
                <button onClick={generateHint} className='p-2 flex flex-row gap-2 font-bold rounded-lg bg-yellow-400 hover:bg-yellow-500'>
                  <p>Hint</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 my-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                <button onClick={generateExplanation} className='p-2 flex flex-row gap-2 font-bold rounded-lg bg-yellow-400 hover:bg-yellow-500'>
                  <p>Explanation</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 my-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
            <div style={{ height: '47vh', overflow: 'auto' }}>
              <div>
                <MDXProvider>
                  {hints.slice().reverse().map((hint, index) => (
                    <div key={index} className='bg-white p-2 rounded-xl mt-2'>
                      {hint}
                    </div>
                  ))}
                </MDXProvider>
              </div>
            </div>
          </div>
        </div>
        <div className='p-2 bg-gray-700 h-[20vh] text-white'>
          <h1 className='font-bold'>Output : </h1>
          <p className='font-mono'>{output}</p>
        </div>
      </div>
    </div>
  )
}
