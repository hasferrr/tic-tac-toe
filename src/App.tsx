import React from 'react'
import { useEffect, useState } from 'react'

import './App.css'

import Board from './components/Board'
import Navigation from './components/Navigation'
import Score from './components/Score'
import Player from './components/Player'
import Mode from './components/Mode'
import Bottom from './components/Bottom'

type board = (null | 'X' | 'O')[]
type turn = 'X' | 'O'

interface game {
  mode: 'PvP' | 'PvC',
  level: number,
  player1mark: 'X' | 'O',
  player2mark: 'X' | 'O',
  player1score: number,
  player2score: number
}

const App = () => {
  const [playState, setPlayState] = useState(true)
  const [game, setGame] = useState<game>({
    mode: 'PvP',
    level: 0,
    player1mark: 'X',
    player2mark: 'O',
    player1score: 0,
    player2score: 0
  })
  const [board, setBoard] = useState<board>(Array(9).fill(null))
  const [turn, setTurn] = useState<turn>('X')
  const [winner, setWinner] = useState<turn | 'tie' | false>(false)


  const Gameboard = (() => {

    // Assign X or O to board
    const assign = event => {
      assignManual(event.target.id, turn)
    }

    const assignManual = (index, value) => {
      if (board[index] === null) {
        const updatedBoard = [...board]
        updatedBoard[index] = value
        setBoard(updatedBoard)
        setTurn(switchTurn(updatedBoard))
      }
    }

    const switchTurn = (s: board): turn => {
      let X = 0
      let O = 0
      for (let i = 0; i < s.length; i++) {
        if (s[i] === 'X') X++
        else if (s[i] === 'O') O++
      }
      console.log('X:',X)
      console.log('O:',O)
      return X > O ? 'O' : 'X'
    }

    // Remove all X and O from board
    const resetBoard = () => {
      setBoard(Array(9).fill(null))
      setTurn('X')
    }

    // Produce the winner: 'X', 'O', 'tie', or False
    // from the given board (or use the board state as a default value)
    const gameResult = (bd = board) => {
      const row = check(templateRow)
      const column = check(templateCol)
      const diagonal = check(templateDiag)
      const result = row || column || diagonal
      if (bd.every(x => x) && !result) {
        return 'tie'
      }
      return result
    }

    const templateRow = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
    const templateCol = [[0, 3, 6], [1, 4, 7], [2, 5, 8]]
    const templateDiag = [[0, 4, 8], [2, 4, 6]]

    const check = (template, bd = board) => {
      for (let i = 0; i < template.length; i++) {
        const arr = template[i];
        if (arr.every(x => bd[x] === 'X')) return 'X'
        if (arr.every(x => bd[x] === 'O')) return 'O'
      }
      return false
    }

    return { assign, switchTurn, assignManual, resetBoard, gameResult }
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

  const ComputerMove = (() => {

    // computer make a random legal move
    const easy = () => {
      if (board.every(x => x !== null)) {
        return
      }
      const assignMark = () => {
        const rand = Math.floor(Math.random() * 9) // random num 0 to 8
        if (!board[rand]) {
          Gameboard.assignManual(rand, turn)
          return
        }
        assignMark()
      }
      assignMark()
    }

    const minmax = (bd: board, turn: turn) => {
      //state is tic-tac-toe board
      const initialState = [...bd]

      //return who's the turn now, X or O
      const player = (s: board): turn => Gameboard.switchTurn(s)

      //return index of legal moves in state s
      const action = (s: board): Set<number> => {
        const actionSet: Set<number> = new Set()
        for (let i = 0; i < s.length; i++) {
          if (s[i] === null) {
            actionSet.add(i)
          }
        }
        return actionSet
      }

      //return state after action a taken in state s
      const result = (s: board, a: number): board => {
        const newS = [...s]
        newS[a] = player(s)
        return newS
      }

      //return true if someone win or draw, false otherwise
      const terminal = (s: board): boolean => Gameboard.gameResult(s) ? true : false

      //return numerical value of state s
      const utility = (s: board): 1 | 0 | -1 => {
        const res = Gameboard.gameResult(s)
        return res === 'X' ? 1 : res === 'O' ? -1 : 0
      }

      const solve = () => { }

      return solve()
    }

    return { easy }
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

    } else if (game.mode === 'PvC' && turn === game.player2mark) {
      if (game.level === 0) {
        ComputerMove.easy()
      }
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
        winner={winner}
      />
      <Score game={game} winner={winner} />
      <Board
        turn={turn}
        game={game}
        board={board}
        winner={winner}
        Gameboard={Gameboard}
      />
      <Player game={game} player={1} winner={winner} />
      <Player game={game} player={2} winner={winner} />
      <Bottom turn={turn} />
    </div>
  )
}

export default App
