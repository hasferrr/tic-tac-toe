import './Player.css'

const Player = ({ player }) => {
  return (
    <div className={`Player p${player}`}>
      Player {player}
    </div>
  )
}

export default Player