import './Player.css'

const Player = ({ game, player, winner }) => {
  const playerMark = game[`player${player}mark`]

  return (
    <div className={`Player p${player}`}>
      Player {player}
      <p className={`bg ${winner === playerMark ? 'light' : ''}`}>
        {playerMark}
      </p>
    </div>
  )
}

export default Player