import './Player.css'

const Player = ({ game, player }) => {
  return (
    <div className={`Player p${player}`}>
      Player {player}
      <p className='bg'>{game[`player${player}mark`]}</p>
    </div>
  )
}

export default Player