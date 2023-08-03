import './PlayerDisplay.css'

const PlayerDisplay = ({ player }) => {
  return (
    <div className={`PlayerDisplay p${player}`}>
      Player {player}
    </div>
  )
}

export default PlayerDisplay