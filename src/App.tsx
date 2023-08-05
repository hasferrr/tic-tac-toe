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
      const row = check(templateRow, bd)
      const column = check(templateCol, bd)
      const diagonal = check(templateDiag, bd)
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

    const changeLevel = () => setGame({
      ...game,
      level: game.level ? 0 : 1
    })

    return { togglePlayState, changeMode, swapMarkMode, startGame, changeLevel }
  })()

  const ComputerMove = (() => {

    // computer make a random legal move
    const easy = () => {
      if (board.every(x => x !== null)) {
        return
      }
      assignRandom()
    }

    const assignRandom = () => {
      const rand = Math.floor(Math.random() * 9) // random num 0 to 8
      if (!board[rand]) {
        Gameboard.assignManual(rand, turn)
        return
      }
      assignRandom()
    }

    const minmax = (bd: board) => {
      const solve = (bd: board): value => {
        const result = Gameboard.gameResult(bd)
        if (terminal(bd, result)) {
          return utility(bd, result)
        }
        return solveMany(nextBoard(bd), minmaxValueOf(bd))
      }

      const solveMany = (bdArray: board[], getMinMax: (...values: number[]) => value): value => {
        if (bdArray.length === 0) {
          throw new Error('solveMany reaches empty array')
        }
        const values: value[] = []
        const desiredOutcomes = getMinMax === Math.max ? 1 : -1

        for (let i = 0; i < bdArray.length; i++) {
          if (values.includes(desiredOutcomes)) {
            break
          }
          values.push(solve(bdArray[i]))
        }

        return getMinMax(...values)
      }

      return solve(bd)
    }

    //return who's the turn now, X or O
    const player = (s: board): turn => Gameboard.switchTurn(s)

    //return index of legal moves in state s
    const action = (s: board): number[] => {
      const actionSet: number[] = []
      for (let i = 0; i < s.length; i++) {
        if (s[i] === null) {
          actionSet.push(i)
        }
      }
      return actionSet
    }

    //return state after action a taken in state s
    const createNextBoard = (s: board, a: number): board => {
      const newS = [...s]
      newS[a] = player(s)
      return newS
    }

    //return true if someone win or draw, false otherwise
    const terminal = (s: board, result?: false | "X" | "O" | "tie"): boolean => {
      if (result === undefined) {
        result = Gameboard.gameResult(s)
      }
      return result ? true : false
    }

    //return numerical value of state s
    type value = 1 | 0 | -1
    const utility = (s: board, result?: false | "X" | "O" | "tie"): value => {
      if (result === undefined) {
        result = Gameboard.gameResult(s)
      }
      if (result === false) {
        throw new Error('minmax: utility error (there\'s no winner or tie) ')
      }
      return result === 'X' ? 1 : result === 'O' ? -1 : 0
    }

    //return a function(s); decide whether maximize or minimize the value
    const minmaxValueOf = (s: board): ((...values: number[]) => value) =>
      //@ts-ignore
      player(s) === 'X' ? Math.max : Math.min

    //return the valid next board of the given board
    const nextBoard = (bd: board, actions?: number[]) => {
      if (actions === undefined) {
        return action(bd).map(e => createNextBoard(bd, e))
      }
      return actions.map(e => createNextBoard(bd, e))
    }

    const impossible = () => {
      let nil = 0
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) nil++
      }
      if (nil === 0) {
        return
      }
      if (nil === 9) {
        assignRandom()
        return
      }

      //generate the array of: [valid next board], and [index of legal moves]
      const arrActions = action(board)
      const arrNextBD = nextBoard(board, arrActions)

      // { bd: next bd, action: index of legal move, value: minmax(bd) }
      const arrNbdActionVal = arrNextBD.map((bd, index) => {
        return { bd: bd, action: arrActions[index], value: minmax(bd) }
      })

      // get minmax value from the next boards
      const theMinMax = minmaxValueOf(board)(...arrNbdActionVal.map(x => x.value))

      //assign value corresponds to the minmax value
      for (let i = 0; i < arrNbdActionVal.length; i++) {
        const nextObj = arrNbdActionVal[i];
        if (nextObj.value === theMinMax) {
          Gameboard.assignManual(nextObj.action, player(board))
          break
        }
      }
    }

    return { easy, impossible }
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
      if (game.level === 1) {
        setTimeout(() => {
          ComputerMove.impossible()
        }, 10);
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
