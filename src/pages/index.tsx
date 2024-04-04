import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react'

export default function index() {
  const [code, setCode] = useState("");
  const [problemStatement, setProblemStatement] = useState("");

  //Temporarily set a random problem statement
  useEffect(() => {
    setProblemStatement("Write a JavaScript function to calculate the sum of two numbers. ");
  }, [])

  return (
    <div className='p-4'>
      <div>
        <h1 className='text-4xl font-bold'>AI Coding Tutor</h1>
      </div>
      <div className='flex flex-col gap-2'>
        <div>
          <h1 className='text-xl font-semibold'>Problem Statement : </h1>
          <p>{problemStatement}</p>
        </div>
        <div className='grid grid-cols-12'>
          <div className='col-span-9 bg-gray-200 p-4 rounded-xl'>
            <ReactCodeMirror
              value={code}
            />
          </div>
          <div className='col-span-3'>

          </div>
        </div>
      </div>
    </div>
  )
}
