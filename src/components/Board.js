import './Board.css'

const Board = ({ board, Gameboard }) => {
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

export default Board
