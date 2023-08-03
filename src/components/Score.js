import './Score.css'

const Score = ({ game, winner }) => {
  if (winner) {
    return (
      <div className='Score'>
        {winner === 'tie'
          ? `It's Draw`
          : `The Winner is ${winner}`
        }
      </div>
    )
  }

  return (
    <div className='Score'>
      {game.player1score}-{game.player2score}
    </div>
  )
}

export default Score