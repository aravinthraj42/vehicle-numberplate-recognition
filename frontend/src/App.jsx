import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NumberPlateUploader from './Components/NumberPlateUploader'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl font-bold">
        Vehicle Number Plate Recognition
      </h1>
      <NumberPlateUploader />

    </>
  )
}

export default App
