import './Board.css'

const Board = ({ turn, game, board, winner, Gameboard }) => {
  const handleClick = !winner
    ? game.mode === 'PvC' && game.player2mark === turn
      ? () => { }
      : Gameboard.assign
    : () => { }

  return (
    <div className='Board'>
      {board.map((box, index) =>
        <div
          key={index}
          className='box'
          id={index}
          onClick={handleClick}
        >
          {box}
        </div>
      )}
    </div>
  )
}

export default Board
