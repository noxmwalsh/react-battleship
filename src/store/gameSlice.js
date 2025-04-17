import { createSlice } from '@reduxjs/toolkit';

const BOARD_SIZE = 10;
const SHIPS = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
  { name: 'cruiser', size: 3 },
  { name: 'submarine', size: 3 },
  { name: 'destroyer', size: 2 },
];

const getRandomPosition = () => Math.floor(Math.random() * BOARD_SIZE);
const getRandomOrientation = () => Math.random() < 0.5;

const placeComputerShips = () => {
  const board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
  const ships = [...SHIPS];

  for (const ship of ships) {
    let placed = false;
    while (!placed) {
      const row = getRandomPosition();
      const col = getRandomPosition();
      const isVertical = getRandomOrientation();

      // Check if placement is valid
      let isValid = true;
      if (isVertical) {
        if (row + ship.size > BOARD_SIZE) continue;
        for (let i = 0; i < ship.size; i++) {
          if (board[row + i][col] !== null) {
            isValid = false;
            break;
          }
        }
      } else {
        if (col + ship.size > BOARD_SIZE) continue;
        for (let i = 0; i < ship.size; i++) {
          if (board[row][col + i] !== null) {
            isValid = false;
            break;
          }
        }
      }

      if (isValid) {
        // Place the ship
        if (isVertical) {
          for (let i = 0; i < ship.size; i++) {
            board[row + i][col] = ship.name;
          }
        } else {
          for (let i = 0; i < ship.size; i++) {
            board[row][col + i] = ship.name;
          }
        }
        placed = true;
      }
    }
  }

  return board;
};

const makeComputerMove = (board) => {
  // Find all possible moves (cells that haven't been hit or missed)
  const possibleMoves = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== 'hit' && board[row][col] !== 'miss') {
        possibleMoves.push({ row, col });
      }
    }
  }

  // Randomly select a move from possible moves
  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};

const checkShipSunk = (board, shipName) => {
  let hitCount = 0;
  let totalCells = 0;
  
  // Count total cells and hits for this ship
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === shipName) {
        totalCells++;
      } else if (board[row][col] === 'hit' && board[row][col] === shipName) {
        hitCount++;
      }
    }
  }
  
  return hitCount === totalCells;
};

const initialState = {
  playerBoard: Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)),
  computerBoard: placeComputerShips(),
  playerShips: SHIPS.map(ship => ({ ...ship, placed: false })),
  computerShips: SHIPS.map(ship => ({ ...ship, placed: false })),
  gameStatus: 'setup', // 'setup', 'playing', 'gameOver'
  currentPlayer: 'player', // 'player' or 'computer'
  winner: null,
  messages: [], // Initialize messages array
  selectedShip: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    placeShip: (state, action) => {
      const { ship, row, col, isVertical } = action.payload;
      const board = state.currentPlayer === 'player' ? state.playerBoard : state.computerBoard;
      const ships = state.currentPlayer === 'player' ? state.playerShips : state.computerShips;
      
      // Check if placement is valid
      if (isVertical) {
        if (row + ship.size > BOARD_SIZE) return;
        for (let i = 0; i < ship.size; i++) {
          if (board[row + i][col] !== null) return;
        }
      } else {
        if (col + ship.size > BOARD_SIZE) return;
        for (let i = 0; i < ship.size; i++) {
          if (board[row][col + i] !== null) return;
        }
      }

      // Place the ship
      if (isVertical) {
        for (let i = 0; i < ship.size; i++) {
          board[row + i][col] = ship.name;
        }
      } else {
        for (let i = 0; i < ship.size; i++) {
          board[row][col + i] = ship.name;
        }
      }

      // Mark ship as placed
      const shipIndex = ships.findIndex(s => s.name === ship.name);
      if (shipIndex !== -1) {
        ships[shipIndex].placed = true;
      }

      // Check if all ships are placed
      if (ships.every(ship => ship.placed)) {
        state.gameStatus = 'playing';
      }
    },
    makeMove: (state, action) => {
      const { row, col } = action.payload;
      const board = state.currentPlayer === 'player' ? state.computerBoard : state.playerBoard;
      const ships = state.currentPlayer === 'player' ? state.computerShips : state.playerShips;
      
      // Check if move is valid
      if (board[row][col] === 'hit' || board[row][col] === 'miss') return;

      const shipName = board[row][col];
      
      // Update board
      if (board[row][col] === null) {
        board[row][col] = 'miss';
        state.messages.push(`${state.currentPlayer === 'player' ? 'You' : 'Computer'} missed!`);
      } else {
        board[row][col] = 'hit';
        state.messages.push(`${state.currentPlayer === 'player' ? 'You' : 'Computer'} hit a ship!`);
        
        // Check if ship is sunk
        if (checkShipSunk(board, shipName)) {
          state.messages.push(`${state.currentPlayer === 'player' ? 'You' : 'Computer'} sunk the ${shipName}!`);
          // Update ship status
          const hitShip = ships.find(ship => ship.name === shipName);
          if (hitShip) {
            hitShip.placed = false;
          }
        }
      }

      // Check for win condition
      const allShipsSunk = board.every(row => 
        row.every(cell => cell === null || cell === 'hit' || cell === 'miss')
      );

      if (allShipsSunk) {
        state.gameStatus = 'gameOver';
        state.winner = state.currentPlayer;
        state.messages.push(`${state.currentPlayer === 'player' ? 'You' : 'Computer'} won the game!`);
      } else {
        state.currentPlayer = state.currentPlayer === 'player' ? 'computer' : 'player';
        
        // If it's now the computer's turn, make a move
        if (state.currentPlayer === 'computer' && state.gameStatus === 'playing') {
          const computerMove = makeComputerMove(state.playerBoard);
          if (computerMove) {
            const shipName = state.playerBoard[computerMove.row][computerMove.col];
            
            // Update board
            if (state.playerBoard[computerMove.row][computerMove.col] === null) {
              state.playerBoard[computerMove.row][computerMove.col] = 'miss';
              state.messages.push('Computer missed!');
            } else {
              state.playerBoard[computerMove.row][computerMove.col] = 'hit';
              state.messages.push('Computer hit your ship!');
              
              // Check if ship is sunk
              if (checkShipSunk(state.playerBoard, shipName)) {
                state.messages.push(`Computer sunk your ${shipName}!`);
              }
            }

            // Check for win condition after computer move
            const allShipsSunk = state.playerBoard.every(row => 
              row.every(cell => cell === null || cell === 'hit' || cell === 'miss')
            );

            if (allShipsSunk) {
              state.gameStatus = 'gameOver';
              state.winner = 'computer';
              state.messages.push('Computer won the game!');
            } else {
              state.currentPlayer = 'player';
            }
          }
        }
      }
    },
    resetGame: (state) => {
      state.playerBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
      state.computerBoard = placeComputerShips();
      state.playerShips = SHIPS.map(ship => ({ ...ship, placed: false }));
      state.computerShips = SHIPS.map(ship => ({ ...ship, placed: false }));
      state.gameStatus = 'setup';
      state.currentPlayer = 'player';
      state.winner = null;
      state.messages = [];
      state.selectedShip = null;
    },
  },
});

export const { placeShip, makeMove, resetGame } = gameSlice.actions;
export default gameSlice.reducer; 