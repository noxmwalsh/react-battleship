import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeMove, placeShip } from '../store/gameSlice';
import './Board.css';

const Board = ({ isPlayerBoard }) => {
  const dispatch = useDispatch();
  const { playerBoard, computerBoard, gameStatus, currentPlayer } = useSelector(state => state.game);
  const board = isPlayerBoard ? playerBoard : computerBoard;

  const handleCellClick = (row, col) => {
    if (gameStatus === 'setup' && isPlayerBoard) {
      // Get the selected ship from the ShipPlacement component
      const selectedShip = document.querySelector('.ship-option.selected');
      if (!selectedShip) return;
      
      const shipName = selectedShip.textContent.split(' ')[0];
      const shipSize = parseInt(selectedShip.textContent.match(/\((\d+)\)/)[1]);
      const isVertical = document.querySelector('button').textContent === 'Vertical';
      
      dispatch(placeShip({ 
        ship: { name: shipName, size: shipSize }, 
        row, 
        col, 
        isVertical 
      }));
    } else if (gameStatus === 'playing' && currentPlayer === 'player' && !isPlayerBoard) {
      dispatch(makeMove({ row, col }));
    }
  };

  const getCellClass = (cell) => {
    if (cell === 'hit') return 'cell hit';
    if (cell === 'miss') return 'cell miss';
    if (cell && isPlayerBoard) return 'cell ship';
    return 'cell empty';
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(cell)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board; 