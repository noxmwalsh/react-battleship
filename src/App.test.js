import { render, screen } from '@testing-library/react';
import App from './App';

test('renders battleship title', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { level: 1, name: /Battleship/i });
  expect(titleElement).toBeInTheDocument();
});
