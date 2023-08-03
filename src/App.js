import { useEffect, useState } from 'react'

import './App.css'

import Board from './components/Board'
import Navigation from './components/Navigation'
import Score from './components/Score'
import Player from './components/Player'
import Mode from './components/Mode'
import Bottom from './components/Bottom'

const App = () => {
  const [playState, setPlayState] = useState(true)
  const [game, setGame] = useState({
    mode: 'PvP',
    player1mark: 'X',
    player2mark: 'O',
    player1score: 0,
    player2score: 0
  })
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(game.player1mark)
  const [winner, setWinner] = useState(false)


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
      setTurn(game.player1mark)
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

  const Gamestate = (() => {
    const togglePlayState = () => setPlayState(!playState)

    const changeMode = newMode => setGame({ ...game, mode: newMode })

    const swapMarkMode = () => setGame({
      ...game,
      player1mark: game.player2mark,
      player2mark: game.player1mark
    })

    const startGame = () => {
      togglePlayState()
      Gameboard.resetBoard()
      setGame({
        ...game,
        player1score: 0,
        player2score: 0
      })
    }

    return { togglePlayState, changeMode, swapMarkMode, startGame }
  })()


  useEffect(() => {
    const result = Gameboard.gameResult()
    setWinner(result)
    if (result) {
      // increment score
      if (game.player1mark === result) {
        setGame({ ...game, player1score: game.player1score + 1 })
      } else if (game.player2mark === result) {
        setGame({ ...game, player2score: game.player2score + 1 })
      }

      setTimeout(() => {
        setWinner(false)
        Gameboard.resetBoard()
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board])


  if (playState) {
    return <Mode Gamestate={Gamestate} game={game} />
  }

  return (
    <div className='App'>
      <Navigation
        Gameboard={Gameboard}
        Gamestate={Gamestate}
      />
      <Score game={game} winner={winner} />
      <Board board={board} Gameboard={Gameboard} winner={winner} />
      <Player game={game} player={1} />
      <Player game={game} player={2} />
      <Bottom turn={turn} />
    </div>
  )
}

export default App
