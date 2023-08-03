import './Player.css'

const Player = ({ game, player, winner }) => {
  const playerMark = game[`player${player}mark`]

  return (
    <div className={`Player p${player}`}>
      Player {player}
      <div className={`bg ${winner === playerMark ? 'light' : ''}`}>
        {playerMark === 'X'
          ? <div id='cross'></div>
          : <div id='circle'></div>
        }
      </div>
    </div>
  )
}

export default Player