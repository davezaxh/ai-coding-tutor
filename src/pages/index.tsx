import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react'

export default function index() {
  const [code, setCode] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [language, setLanguage] = useState<string | null>(null);

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
              theme="dark"
              value={code}
            />
          </div>
          <div className='col-span-4 bg-gray-200 p-4 rounded-xl'>
            <h1>Hints & Solutions</h1>
          </div>
        </div>
        <div className='p-2 bg-gray-700 h-[20vh]'>
        </div>
      </div>
    </div>
  )
}
