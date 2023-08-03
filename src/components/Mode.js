import './Mode.css'

const Mode = ({ Gamestate, game }) => {

  return (
    <div className='Mode center'>
      <h1 className='make-btn'>tic-tac-toe.</h1>

      <section className='select-wrap center'>
        <div className='select button-54 center' onClick={() => Gamestate.changeMode('PvP')}>
          PvP
        </div>
        <div className='select button-54 center' onClick={() => Gamestate.changeMode('PvC')}>
          PvC
        </div>
      </section>

      <section className='display-mode center'>
        <p>Mode : <strong>{game.mode}</strong></p>
        <div>Player 1 : <strong className='button-54' onClick={Gamestate.swapMarkMode}>{game.player1mark}</strong></div>
        <div>Player 2 : <strong className='button-54' onClick={Gamestate.swapMarkMode}>{game.player2mark}</strong></div>
      </section>

      <button
        className="button-54 center start"
        onClick={Gamestate.startGame}
      >
        Start
      </button>
    </div>
  )
}

export default Mode