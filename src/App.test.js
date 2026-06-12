import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App rendering', () => {
  beforeEach(() => localStorageMock.clear());

  test('renders EcoTrack header', () => {
    render(<App />);
    expect(screen.getByText('EcoTrack')).toBeInTheDocument();
  });

  test('shows dashboard by default', () => {
    render(<App />);
    expect(screen.getByText('Your Carbon Dashboard')).toBeInTheDocument();
  });

  test('navigates to calculator tab', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /calculator/i }));
    expect(screen.getByText('Carbon Footprint Calculator')).toBeInTheDocument();
  });

  test('navigates to tips tab', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /tips/i }));
    expect(screen.getByText('Reduction Tips')).toBeInTheDocument();
  });

  test('navigates to challenges tab', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /challenges/i }));
    expect(screen.getByText('Eco Challenges')).toBeInTheDocument();
  });

  test('active nav tab has aria-current="page"', () => {
    render(<App />);
    const dashboardBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashboardBtn).toHaveAttribute('aria-current', 'page');
  });

  test('dashboard shows stat cards', () => {
    render(<App />);
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('Annual Projection')).toBeInTheDocument();
    expect(screen.getByText('Trees to Offset')).toBeInTheDocument();
  });
});

describe('Tips interaction', () => {
  beforeEach(() => localStorageMock.clear());

  test('can commit to a tip and see savings banner', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /tips/i }));
    const commitBtns = screen.getAllByRole('button', { name: /commit to:/i });
    fireEvent.click(commitBtns[0]);
    expect(screen.getByText(/1 tips committed/i)).toBeInTheDocument();
  });
});

describe('Challenges interaction', () => {
  beforeEach(() => localStorageMock.clear());

  test('can start a challenge', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /challenges/i }));
    const startBtns = screen.getAllByRole('button', { name: /start challenge/i });
    fireEvent.click(startBtns[0]);
    expect(screen.getByText(/active challenges/i)).toBeInTheDocument();
  });
});
