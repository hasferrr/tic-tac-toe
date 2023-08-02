import { useEffect, useState } from 'react'
import './App.css'

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState('X')

  const Gameboard = (() => {

    const assign = event => {
      if (board[event.target.id] === null) {
        event.target.innerText = turn
        setBoard((() => {
          const copy = [...board]
          copy[event.target.id] = turn
          return copy
        })())
        setTurn(turn === 'X' ? 'O' : 'X')
      }
    }

    const resetBoard = () => {
      setBoard(Array(9).fill(null))
      setTurn('X')
    }

    return { assign, resetBoard }
  })()

  return (
    <div className='Board'>
      {board.map((box, index) =>
        <div key={index} className='box' id={index} onClick={Gameboard.assign} >
          {box}
        </div>
      )}
    </div>
  )
}

export default App
