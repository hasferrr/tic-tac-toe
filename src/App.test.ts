// type board = (null | 'X' | 'O')[]
type board = (null | string)[]
type turn = 'X' | 'O'

// eslint-disable-next-line @typescript-eslint/no-redeclare
let board: board = Array(9).fill(null)

const Gameboard = (() => {

  const switchTurn = (s: board): turn => {
    let X = 0
    let O = 0
    for (let i = 0; i < s.length; i++) {
      if (s[i] === 'X') X++
      else if (s[i] === 'O') O++
    }
    return X > O ? 'O' : 'X'
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

  return { switchTurn, gameResult, check }
})()






//------------------------//------------------------//------------------------

//state is tic-tac-toe board
let bd = [...board]
// const initialState = [...bd]

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

const nextBoard = (bd: board) =>
  action(bd).map(e => createNextBoard(bd, e))

//------------------------//------------------------//------------------------


const solve = (bd: board): value => {
  const result = Gameboard.gameResult(bd)
  if (terminal(bd, result)) {
    return utility(bd, result)
  }
  return solveMany(nextBoard(bd))
}

const solveMany = (bdArray: board[]): value => {
  if (bdArray.length === 0) {
    throw new Error('solveMany reaches empty array')
  }
  const values = bdArray.map(bd => solve(bd))
  return minmaxValueOf(bd)(...values)
}

//------------------------//------------------------//------------------------


const minmax = (bd: board) => {
  return solve(bd)
}


// ------------------------------------Switch Turn-------------------------------------
const ignore = 0
let X:'X' = 'X'
let O:'O' = 'O'
let N = null
let _ = null
let empty;
let FullX;
let FullO;
empty = [N, N, N, N, N, N, N, N, N]
FullX = [X, X, X, X, X, X, X, X, X]
FullO = [O, O, O, O, O, O, O, O, O]

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------            ------------------------------------
// ---------------------------------- UNIT TESTS ------------------------------------
// ----------------------------------            ------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

test('Player 1', () => {
  expect(player(empty))
    .toBe('X')
})

let bd2 = [X, N, N, N, N, N, N, N, N]
test('Player 2', () => {
  expect(player(bd2))
    .toBe('O')
})

let bd3 = [X, O, N, N, N, N, N, N, N]
test('Player 3', () => {
  expect(player(bd3))
    .toBe('X')
})

let bd4 = [X, O, N, N, N, N, X, N, N]
test('Player 4', () => {
  expect(player(bd4))
    .toBe('O')
})

// ------------------------------------Action-------------------------------------

let aN = Array(9).fill(N)
test('Action aN', () => {
  expect(action(aN))
    .toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
})

let a0 = Array(9).fill(X)
test('Action a0', () => {
  expect(action(a0))
    .toStrictEqual([])
})

let a1 = Array(9).fill(X)
a1[0] = N
test('Action a1', () => {
  expect(action(a1))
    .toStrictEqual([0])
})

let a2 = Array(9).fill(X)
a2[0] = N
a2[1] = N
a2[5] = N
test('Action a2', () => {
  expect(action(a2))
    .toStrictEqual([0, 1, 5])
})

let a3 = Array(9).fill(N)
a3[0] = X
a3[8] = O
test('Action a3', () => {
  expect(action(a3))
    .toStrictEqual([1, 2, 3, 4, 5, 6, 7])
})

// ------------------------------------Action-------------------------------------

let expect_cn0 = [...empty]
expect_cn0[0] = X
test('createNextBoard cn0', () => {
  expect(createNextBoard(empty, 0))
    .toStrictEqual(expect_cn0)
})

let cn1 = [X,_,_,  _,_,_,  _,_,_]
let ecn1 = [X,O,_,  _,_,_,  _,_,_]
test('createNextBoard cn1', () => {
  expect(createNextBoard(cn1, 1))
    .toStrictEqual(ecn1)
})

let cn2 = [X,O,_,  _,_,_,  _,_,_]
let ecn2 = [X,O,_,  _,_,_,  X,_,_]
test('createNextBoard cn2', () => {
  expect(createNextBoard(cn2, 6))
    .toStrictEqual(ecn2)
})

let cn3 =  [_,X,O,  O,X,_,  X,_,O]
let ecn3 = [X,X,O,  O,X,_,  X,_,O]
test('createNextBoard cn3', () => {
  expect(createNextBoard(cn3, 0))
    .toStrictEqual(ecn3)
})

let cn4 =  [_,X,O,  O,X,_,  X,_,O]
let ecn4 = [_,X,O,  O,X,X,  X,_,O]
test('createNextBoard cn4', () => {
  expect(createNextBoard(cn4, 5))
    .toStrictEqual(ecn4)
})

// ---------------------------Gameboard Gameresult-------------------------------

const templateRow = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
const templateCol = [[0, 3, 6], [1, 4, 7], [2, 5, 8]]
const templateDiag = [[0, 4, 8], [2, 4, 6]]

test('checkRow 1', () => {
  expect(Gameboard.check(templateRow, [O,O,O,  N,X,N,  N,O,X]))
    .toStrictEqual(O)
})

test('checkRow 2', () => {
  expect(Gameboard.check(templateRow, [N,X,N,  O,O,O,  N,O,X]))
    .toStrictEqual(O)
})

test('checkCol 3', () => {
  expect(Gameboard.check(templateCol, [N,O,N,  O,O,N,  X,O,X]))
    .toStrictEqual(O)
})

test('checkDig 3', () => {
  expect(Gameboard.check(templateDiag, [X,N,O,  O,X,N,  N,O,X]))
    .toStrictEqual(X)
})

test('checkFal F', () => {
  expect(Gameboard.check(templateRow, [X,N,O,  O,N,N,  N,O,X]))
    .toStrictEqual(false)
})

// ---------------------------Gameboard Gameresult-------------------------------

// ------------------------------------Terminal-------------------------------------

//return true if someone win or draw, false otherwise

test('Terminal N-X', () => {
  expect(terminal(empty, X))
    .toStrictEqual(true)
})

test('Terminal N-O', () => {
  expect(terminal(empty, O))
    .toStrictEqual(true)
})

test('Terminal N-TIE', () => {
  expect(terminal(empty, 'tie'))
    .toStrictEqual(true)
})

test('Terminal N-F', () => {
  expect(terminal(empty, false))
    .toStrictEqual(false)
})

test('Terminal FULL NULL', () => {
  //@ts-ignore
  expect(terminal(empty))
    .toStrictEqual(false)
})

test('Terminal X', () => {
  //@ts-ignore
  expect(terminal(FullX))
    .toStrictEqual(true)
})

test('Terminal O', () => {
  //@ts-ignore
  expect(terminal(FullO))
    .toStrictEqual(true)
})

test('Terminal 1F', () => {
  //@ts-ignore
  expect(terminal([N,O,N,  N,O,N,  N,X,N]))
    .toStrictEqual(false)
})

test('Terminal 2F', () => {
  //@ts-ignore
  expect(terminal([N,O,X,  N,O,N,  N,X,X]))
    .toStrictEqual(false)
})

//

test('Terminal 3T', () => {
  //@ts-ignore
  expect(terminal([N,O,X,  N,O,N,  N,O,X]))
    .toStrictEqual(true)
})

test('Terminal 4T', () => {
  //@ts-ignore
  expect(terminal([X,O,N,  X,N,O,  X,O,N]))
    .toStrictEqual(true)
})

test('Terminal 5T', () => {
  //@ts-ignore
  expect(terminal([O,X,N,  O,N,X,  O,X,N]))
    .toStrictEqual(true)
})


test('Terminal 6T', () => {
  //@ts-ignore
  expect(terminal([X,X,X,  N,N,N,  N,N,N]))
  .toStrictEqual(true)
})

test('Terminal 7T', () => {
  //@ts-ignore
  expect(terminal([X,N,X,  O,O,O,  N,N,N]))
  .toStrictEqual(true)
})

test('Terminal 8T', () => {
  //@ts-ignore
  expect(terminal([X,N,X,  O,X,O,  N,N,X]))
  .toStrictEqual(true)
})

test('Terminal Result X', () => {
  //@ts-ignore
  expect(terminal([], X))
  .toStrictEqual(true)
})

test('Terminal Result O', () => {
  expect(terminal([], O))
  .toStrictEqual(true)
})

test('Terminal Result TIE', () => {
  expect(terminal([], 'tie'))
  .toStrictEqual(true)
})

test('Terminal Result FALSE', () => {
  expect(terminal([], false))
  .toStrictEqual(false)
})


// ------------------------------------UTILITY-------------------------------------

//return numerical value of state s

test('utility N-X', () => {
  expect(utility(empty, X))
    .toStrictEqual(1)
})

test('utility N-O', () => {
  expect(utility(empty, O))
    .toStrictEqual(-1)
})

test('utility N-TIE', () => {
  expect(utility(empty, 'tie'))
    .toStrictEqual(0)
})

// --------> throw new error <----------
// test('utility N-F', () => {
//   expect(utility(empty, false))
//     .toStrictEqual(false)
// })

// test('utility FULL NULL', () => {
//   //@ts-ignore
//   expect(utility(empty))
//     .toStrictEqual(false)
// })

test('utility X', () => {
  //@ts-ignore
  expect(utility(FullX))
    .toStrictEqual(1)
})

test('utility O', () => {
  //@ts-ignore
  expect(utility(FullO))
    .toStrictEqual(-1)
})

// test('utility 1F', () => {
//   //@ts-ignore
//   expect(utility([N,O,N,  N,O,N,  N,X,N]))
//     .toStrictEqual(false)
// })

// test('utility 2F', () => {
//   //@ts-ignore
//   expect(utility([N,O,X,  N,O,N,  N,X,X]))
//     .toStrictEqual(false)
// })

test('utility 3T', () => {
  //@ts-ignore
  expect(utility([N,O,X,  N,O,N,  N,O,X]))
    .toStrictEqual(-1)
})

test('utility 4T', () => {
  //@ts-ignore
  expect(utility([X,O,N,  X,N,O,  X,O,N]))
    .toStrictEqual(1)
})

test('utility 5T', () => {
  //@ts-ignore
  expect(utility([X,O,X,  X,O,X,  O,X,O]))
    .toStrictEqual(0)
})

// ----------------------------MIN MAX VALUE FUNCTION------------------------------

test('get Minmaxvalueof Function Empty', () => {
  expect(minmaxValueOf(empty))
    .toStrictEqual(Math.max)
})

test('get Minmaxvalueof Function 1', () => {
  expect(minmaxValueOf(
    (() => {
      const asdf = [...empty]
      asdf[0] = X
      return asdf
    })()
  ))
    .toStrictEqual(Math.min)
})

// ----------------------------------NEXT BOARD------------------------------------

test('NEXT BOARD 0', () => {
  expect(nextBoard(empty))
    .toStrictEqual(
      (() => {
        const arr0 = [...empty]
        const arr1 = [...empty]
        const arr2 = [...empty]
        const arr3 = [...empty]
        const arr4 = [...empty]
        const arr5 = [...empty]
        const arr6 = [...empty]
        const arr7 = [...empty]
        const arr8 = [...empty]
        arr0[0] = X
        arr1[1] = X
        arr2[2] = X
        arr3[3] = X
        arr4[4] = X
        arr5[5] = X
        arr6[6] = X
        arr7[7] = X
        arr8[8] = X
        return [
          arr0,
          arr1,
          arr2,
          arr3,
          arr4,
          arr5,
          arr6,
          arr7,
          arr8
        ]
      })()
    )
})

let nb1Test =
 [_,X,O,
  O,X,_,
  X,_,O]
test('NEXT BOARD 1', () => {
  expect(nextBoard(nb1Test))
    .toStrictEqual(
      (() => {
        const arr0 = [...nb1Test]
        const arr5 = [...nb1Test]
        const arr7 = [...nb1Test]
        arr0[0] = X
        arr5[5] = X
        arr7[7] = X
        return [
          arr0,
          arr5,
          arr7,
        ]
      })()
    )
})

// --------------------------------------------------------------------------------
// ------------------------------------MINMAX--------------------------------------
// --------------------------------------------------------------------------------


test('MINMAX RESOLVED 1', () => {
  expect(
    minmax(
    [O,X,O,
     O,X,X,
     X,X,O])).toStrictEqual(1)
})

test('MINMAX RESOLVED -1', () => {
  expect(
    minmax(
    [O,_,X,
     O,_,_,
     O,_,X])).toStrictEqual(-1)
})

test('MINMAX RESOLVED 0', () => {
  expect(
    minmax(
    [O,X,X,
     X,O,O,
     O,X,X])).toStrictEqual(0)
})

test('MINMAX 1', () => {
  expect(
    minmax(
    [_,X,O,
     O,X,_,
     X,_,O])).toStrictEqual(1)
})

// --------------------------------------------------------------------------------

test('MINMAX ??', () => {
  expect(
    minmax(
    [_,X,O,
     O,X,X,
     X,_,O])).toStrictEqual(0)
})

test('MINMAX ?? <---', () => {
  expect(
    minmax(
    [O,X,O,
     O,X,X,
     X,_,O])).toStrictEqual(1)
})

test('MINMAX ?? --->', () => {
  expect(
    minmax(
    [_,X,O,
     O,X,X,
     X,O,O])).toStrictEqual(0)
})

// --------------------------------------------------------------------------------

test('MINMAX !!', () => {
  expect(
    minmax(
    [X,X,O,
     O,X,_,
     X,_,O])).toStrictEqual(-1)
})

// --------------------------------------------------------------------------------

test('MINMAX XX', () => {
  expect(
    minmax(
    [_,X,O,
     O,X,_,
     X,X,O])).toStrictEqual(1)
})