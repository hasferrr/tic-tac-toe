import { useEffect, useState } from 'react'
import './App.css'
import Board from './components/Board'
import Navigation from './components/Navigation'
import Score from './components/Score'
import PlayerDisplay from './components/PlayerDisplay'

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState('X')

  const Gameboard = (() => {

    // Assign X or O to board
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

    // Remove all X and O from board
    const resetBoard = () => {
      setBoard(Array(9).fill(null))
      setTurn('X')
    }

    // Produce the winner: 'X', 'O', 'tie', or False
    const gameResult = () => {
      const row = check(templateRow)
      const column = check(templateCol)
      const diagonal = check(templateDiag)
      const result = row || column || diagonal
      if (board.every(x => x) && !result) {
        return 'tie'
      }
      return result
    }

    const templateRow = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
    const templateCol = [[0, 3, 6], [1, 4, 7], [2, 5, 8]]
    const templateDiag = [[0, 4, 8], [2, 4, 6]]

    const check = template => {
      for (let i = 0; i < template.length; i++) {
        const arr = template[i];
        if (arr.every(x => board[x] === 'X')) return 'X'
        if (arr.every(x => board[x] === 'O')) return 'O'
      }
      return false
    }

    return { assign, resetBoard, gameResult }
  })()

  /**
   *
   * @param {string} name
   * @param {string} type
   * @param {string} mark
   * @returns
   */
  const Player = (name, type, mark) => {
    let score = 0
    const getName = () => name
    const getType = () => type
    const getMark = () => mark
    const getScore = () => score
    const addScore = () => ++score
    return { getName, getType, getMark, getScore, addScore }
  }

  useEffect(() => {
    console.log(Gameboard.gameResult())
  }, [Gameboard])

  return (
    <div className='App'>
      <Navigation Gameboard={Gameboard} />
      <Score />
      <Board board={board} Gameboard={Gameboard} />
      <PlayerDisplay player={1} />
      <PlayerDisplay player={2} />
    </div>
  )
}

export default App
