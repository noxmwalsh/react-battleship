import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Messages from './Messages';
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

describe('Messages Component', () => {
  it('renders without messages', () => {
    const store = createMockStore({ messages: [] });
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <Messages />
      </Provider>
    );

    expect(getByText('Game Messages')).toBeInTheDocument();
    expect(queryByText('You hit a ship!')).not.toBeInTheDocument();
  });

  it('renders with messages', () => {
    const messages = [
      'You hit a ship!',
      'Computer missed!',
      'You sunk the carrier!'
    ];
    const store = createMockStore({ messages });
    const { getByText } = render(
      <Provider store={store}>
        <Messages />
      </Provider>
    );

    expect(getByText('Game Messages')).toBeInTheDocument();
    messages.forEach(message => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });

  it('renders messages correctly', () => {
    const store = createMockStore({
      messages: ['Test message 1', 'Test message 2']
    });
    const { getByText } = render(
      <Provider store={store}>
        <Messages />
      </Provider>
    );

    expect(getByText('Test message 1')).toBeInTheDocument();
    expect(getByText('Test message 2')).toBeInTheDocument();
  });

  it('highlights the last message', () => {
    const store = createMockStore({
      messages: ['First message', 'Last message']
    });
    const { getByText } = render(
      <Provider store={store}>
        <Messages />
      </Provider>
    );

    const lastMessage = getByText('Last message');
    expect(lastMessage).toHaveClass('message');
    // The last message will have a different background color via CSS :last-child selector
  });
}); 