import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Kudos app', () => {
  render(<App />);
  const linkElement = screen.getByText('Kudos App');
  expect(linkElement).toBeInTheDocument();
});
