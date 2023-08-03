import './Score.css'

const Score = ({ game }) => {
  return (
    <div className='Score'>
      {game.player1score}-{game.player2score}
    </div>
  )
}

export default Score