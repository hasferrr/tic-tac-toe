import { useState } from 'react'

import './App.css'

import Board from './components/Board'
import Navigation from './components/Navigation'
import Score from './components/Score'
import PlayerDisplay from './components/PlayerDisplay'
import Settings from './components/Settings'

const App = () => {
  const [playState, setPlayState] = useState(true)
  const [game, setGame] = useState({
    mode: 'PvP',
    player1mark: 'X',
    player2mark: 'O'
  })

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

  const togglePlayState = () => setPlayState(!playState)
  const changeMode = newMode => setGame({ ...game, mode: newMode })
  const swapMarkMode = () => setGame({
    ...game,
    player1mark: game.player2mark,
    player2mark: game.player1mark
  })

  if (playState) {
    return (
      <div>
        <Settings
          togglePlayState={togglePlayState}
          game={game}
          changeMode={changeMode}
          swapMarkMode={swapMarkMode}
        />
      </div>
    )
  }

  return (
    <div className='App'>
      <Navigation Gameboard={Gameboard} togglePlayState={togglePlayState} />
      <Score />
      <Board board={board} Gameboard={Gameboard} />
      <PlayerDisplay player={1} />
      <PlayerDisplay player={2} />
    </div>
  )
}

export default App
