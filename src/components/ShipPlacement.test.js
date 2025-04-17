import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ShipPlacement from './ShipPlacement';
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

describe('ShipPlacement Component', () => {
  const SHIPS = [
    { name: 'carrier', size: 5, placed: false },
    { name: 'battleship', size: 4, placed: false },
    { name: 'cruiser', size: 3, placed: false },
    { name: 'submarine', size: 3, placed: false },
    { name: 'destroyer', size: 2, placed: false },
  ];

  it('renders ship options', () => {
    const store = createMockStore({
      playerShips: SHIPS,
      gameStatus: 'setup'
    });
    const { getByText } = render(
      <Provider store={store}>
        <ShipPlacement />
      </Provider>
    );

    SHIPS.forEach(ship => {
      expect(getByText(`${ship.name} (${ship.size})`)).toBeInTheDocument();
    });
  });

  it('handles ship selection', () => {
    const store = createMockStore({
      playerShips: SHIPS,
      gameStatus: 'setup'
    });
    const { getByText } = render(
      <Provider store={store}>
        <ShipPlacement />
      </Provider>
    );

    const shipOption = getByText('carrier (5)');
    fireEvent.click(shipOption);
    expect(shipOption).toHaveClass('selected');
  });

  it('handles orientation toggle', () => {
    const store = createMockStore({
      playerShips: SHIPS,
      gameStatus: 'setup'
    });
    const { getByText } = render(
      <Provider store={store}>
        <ShipPlacement />
      </Provider>
    );

    const toggleButton = getByText('Horizontal');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Vertical');
  });

  it('disables placed ships', () => {
    const placedShips = SHIPS.map(ship => ({ ...ship, placed: true }));
    const store = createMockStore({
      playerShips: placedShips,
      gameStatus: 'setup'
    });
    const { getByText } = render(
      <Provider store={store}>
        <ShipPlacement />
      </Provider>
    );

    const shipOption = getByText('carrier (5)');
    expect(shipOption).toHaveClass('placed');
  });

  it('shows placement instructions when ship is selected', () => {
    const store = createMockStore({
      playerShips: SHIPS,
      gameStatus: 'setup'
    });
    const { getByText } = render(
      <Provider store={store}>
        <ShipPlacement />
      </Provider>
    );

    const shipOption = getByText('carrier (5)');
    fireEvent.click(shipOption);
    expect(getByText('Click on your board to place your carrier')).toBeInTheDocument();
  });
}); 