import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Game from './Game';
import gameReducer from '../store/gameSlice';

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      game: gameReducer
    },
    preloadedState: {
      game: initialState
    }
  });
};

describe('Game Component', () => {
  const initialBoard = Array(10).fill().map(() => Array(10).fill(null));
  const initialShips = [
    { name: 'carrier', size: 5, placed: false },
    { name: 'battleship', size: 4, placed: false },
    { name: 'cruiser', size: 3, placed: false },
    { name: 'submarine', size: 3, placed: false },
    { name: 'destroyer', size: 2, placed: false }
  ];

  it('renders game title and boards', () => {
    const store = createMockStore({
      playerBoard: initialBoard,
      computerBoard: initialBoard,
      playerShips: initialShips,
      computerShips: initialShips,
      gameStatus: 'setup',
      currentPlayer: 'player',
      messages: []
    });
    const { getByText, container } = render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    expect(getByText('Battleship')).toBeInTheDocument();
    expect(container.querySelectorAll('.board').length).toBe(2);
  });

  it('shows ship placement during setup phase', () => {
    const store = createMockStore({
      playerBoard: initialBoard,
      computerBoard: initialBoard,
      playerShips: initialShips,
      computerShips: initialShips,
      gameStatus: 'setup',
      currentPlayer: 'player',
      messages: []
    });
    const { getByText } = render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    expect(getByText('Place Your Ships')).toBeInTheDocument();
  });

  it('shows game over message when game is over', () => {
    const store = createMockStore({
      playerBoard: initialBoard,
      computerBoard: initialBoard,
      playerShips: initialShips,
      computerShips: initialShips,
      gameStatus: 'gameOver',
      winner: 'player',
      messages: ['Game over message']
    });
    const { getByText } = render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    expect(getByText('You Win!')).toBeInTheDocument();
    expect(getByText('Play Again')).toBeInTheDocument();
  });

  it('handles game reset', () => {
    const store = createMockStore({
      playerBoard: initialBoard,
      computerBoard: initialBoard,
      playerShips: initialShips,
      computerShips: initialShips,
      gameStatus: 'gameOver',
      winner: 'player',
      messages: ['Game over message']
    });
    const { getByText } = render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    const resetButton = getByText('Play Again');
    fireEvent.click(resetButton);
    expect(getByText('Place Your Ships')).toBeInTheDocument();
  });

  it('shows messages component', () => {
    const store = createMockStore({
      playerBoard: initialBoard,
      computerBoard: initialBoard,
      playerShips: initialShips,
      computerShips: initialShips,
      gameStatus: 'setup',
      messages: ['Test message']
    });
    const { getByText } = render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    expect(getByText('Game Messages')).toBeInTheDocument();
    expect(getByText('Test message')).toBeInTheDocument();
  });
}); 