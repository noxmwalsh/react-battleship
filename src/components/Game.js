import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetGame } from '../store/gameSlice';
import Board from './Board';
import ShipPlacement from './ShipPlacement';
import Messages from './Messages';
import './Game.css';

const Game = () => {
  const dispatch = useDispatch();
  const { gameStatus, winner } = useSelector(state => state.game);

  const handleReset = () => {
    dispatch(resetGame());
  };

  return (
    <div className="game-container">
      <h1>Battleship</h1>
      <div className="game-content">
        <div className="board-container">
          <h2>Your Board</h2>
          <Board isPlayerBoard={true} />
        </div>
        <div className="board-container">
          <h2>Computer's Board</h2>
          <Board isPlayerBoard={false} />
        </div>
      </div>
      {gameStatus === 'setup' && <ShipPlacement />}
      {gameStatus === 'gameOver' && (
        <div className="game-over">
          <h2>{winner === 'player' ? 'You Win!' : 'Computer Wins!'}</h2>
          <button onClick={handleReset}>Play Again</button>
        </div>
      )}
      <Messages />
    </div>
  );
};

export default Game; 