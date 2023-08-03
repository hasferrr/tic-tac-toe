import './Navigation.css'

const Navigation = ({ Gameboard, Gamestate }) => {
  return (
    <div className='Navigation'>
      <div className='title make-btn'>tic-tac-toe</div>
      <div className='left'>
        <div className='button-54 smol' onClick={Gamestate.togglePlayState}>mode</div>
        <div className='button-54 smol' onClick={Gameboard.resetBoard}>reset</div>
      </div>
    </div>
  )
}

export default Navigation
