import './Navigation.css'

const Navigation = ({ Gameboard }) => {
  return (
    <div className='Navigation'>
      <div className='title make-btn'>tic-tac-toe</div>
      <div className='reset make-btn' onClick={Gameboard.resetBoard}>reset</div>
    </div>
  )
}

export default Navigation
