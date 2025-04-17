import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Board from './Board';
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

describe('Board Component', () => {
  const createInitialBoard = () => Array(10).fill().map(() => Array(10).fill(null));

  it('renders board with correct number of cells', () => {
    const store = createMockStore({
      playerBoard: createInitialBoard(),
      computerBoard: createInitialBoard(),
      gameStatus: 'setup',
      messages: []
    });
    const { container } = render(
      <Provider store={store}>
        <Board isPlayerBoard={true} />
      </Provider>
    );

    expect(container.querySelector('.board')).toBeInTheDocument();
    expect(container.querySelectorAll('.cell').length).toBe(100);
  });

  it('handles cell clicks during setup phase', () => {
    const store = createMockStore({
      playerBoard: createInitialBoard(),
      computerBoard: createInitialBoard(),
      gameStatus: 'setup',
      messages: []
    });
    const { container } = render(
      <Provider store={store}>
        <Board isPlayerBoard={true} />
      </Provider>
    );

    const cell = container.querySelector('.cell');
    fireEvent.click(cell);
    // The cell should remain empty since no ship is selected
    expect(cell).toHaveClass('empty');
  });

  it('handles cell clicks during playing phase', () => {
    const store = createMockStore({
      playerBoard: createInitialBoard(),
      computerBoard: createInitialBoard(),
      gameStatus: 'playing',
      currentPlayer: 'player',
      messages: []
    });
    const { container } = render(
      <Provider store={store}>
        <Board isPlayerBoard={false} />
      </Provider>
    );

    const cell = container.querySelector('.cell');
    fireEvent.click(cell);
    // The cell should be marked as miss since the board is empty
    expect(cell).toHaveClass('miss');
  });

  it('displays hit cells correctly', () => {
    const board = createInitialBoard();
    board[0][0] = 'hit';
    const store = createMockStore({
      playerBoard: board,
      computerBoard: createInitialBoard(),
      gameStatus: 'playing',
      messages: []
    });
    const { container } = render(
      <Provider store={store}>
        <Board isPlayerBoard={true} />
      </Provider>
    );

    const cell = container.querySelector('.cell');
    expect(cell).toHaveClass('hit');
  });

  it('displays miss cells correctly', () => {
    const board = createInitialBoard();
    board[0][0] = 'miss';
    const store = createMockStore({
      playerBoard: board,
      computerBoard: createInitialBoard(),
      gameStatus: 'playing',
      messages: []
    });
    const { container } = render(
      <Provider store={store}>
        <Board isPlayerBoard={true} />
      </Provider>
    );

    const cell = container.querySelector('.cell');
    expect(cell).toHaveClass('miss');
  });
}); 