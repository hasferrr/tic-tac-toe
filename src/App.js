import { useState } from 'react'
import './App.css'

const App = () => {
  const [board, setBoard] = useState(Array(9).fill('X'))

  return (
    <div className='Board'>
      {board.map((box, index) =>
        <div key={index} className='box'>
          {box}
        </div>
      )}
    </div>
  )
}

export default App
