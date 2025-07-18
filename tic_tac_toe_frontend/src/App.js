import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette per specs
const COLORS = {
  primary: '#2196F3',
  secondary: '#E3F2FD',
  accent:    '#FFC107'
};

const BOARD_SIZE = 3;
const initialBoard = Array(BOARD_SIZE * BOARD_SIZE).fill(null);

function calculateWinner(squares) {
  // Check rows, cols, diags
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],       // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],       // cols
    [0, 4, 8], [2, 4, 6]                   // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * Minimalistic, centered 3x3 Tic Tac Toe game.
   * Two players ("X" and "O") play interactively on the same device.
   * Features: centered UI, player turn, game reset, win/draw announcement, styled per palette.
   */
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Update status based on current board state
    const result = calculateWinner(board);
    if (result) {
      setStatus(`Winner: Player ${result.winner}`);
      setGameOver(true);
    } else if (board.every(Boolean)) {
      setStatus("It's a draw!");
      setGameOver(true);
    } else {
      setStatus(`Turn: Player ${xIsNext ? 'X' : 'O'}`);
      setGameOver(false);
    }
  }, [board, xIsNext]);

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    if (board[idx] || gameOver) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setBoard(initialBoard);
    setXIsNext(true);
    setStatus('');
    setGameOver(false);
  };

  // Helper: highlight winning line
  const winnerResult = calculateWinner(board);
  const winSquares = winnerResult ? winnerResult.line : [];

  return (
    <div className="App" style={{
      minHeight: '100vh',
      background: COLORS.secondary,
      color: COLORS.primary,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <main style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <section
          aria-label="Tic Tac Toe game"
          style={{
            padding: '20px 32px 32px 32px',
            borderRadius: '18px',
            boxShadow: '0 4px 28px rgba(33, 150, 243, 0.07)',
            background: '#fff',
            minWidth: 280
          }}
        >
          <h1 style={{
            margin: 0, marginBottom: 8,
            color: COLORS.primary,
            fontWeight: 800,
            textAlign: 'center',
            letterSpacing: '-1px',
            fontSize: '2rem'
          }}>Tic Tac Toe</h1>
          <div style={{
            marginBottom: 18,
            fontSize: '1.03rem',
            minHeight: 32,
            color: status.startsWith('Winner') ? COLORS.accent :
              (status.includes('draw') ? '#888' : COLORS.primary),
            fontWeight: 700,
            letterSpacing: 0
          }}>
            {status}
          </div>
          <Board
            squares={board}
            onClick={handleSquareClick}
            winSquares={winSquares}
            disabled={gameOver}
            palette={COLORS}
          />
          <button
            className="ttt-reset-btn"
            type="button"
            onClick={handleReset}
            style={{
              marginTop: 24,
              background: COLORS.primary,
              color: COLORS.secondary,
              padding: '10px 24px',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(33,150,243,0.07)',
              transition: 'all 0.18s'
            }}
            aria-label="Reset game"
          >
            Reset
          </button>
        </section>
      </main>
      <footer style={{
        color: '#BABABA',
        fontSize: '0.96rem',
        marginTop: 18,
        marginBottom: 10,
        textAlign: 'center'
      }}>
        <span>Minimalistic React Tic Tac Toe &copy; Kavia</span>
      </footer>
    </div>
  );
}

/**
 * Board React component – renders the 3x3 tic tac toe board
 * @param {Object} props
 *   - squares: array of "X", "O", or null for each board slot
 *   - onClick: callback when a square is clicked
 *   - winSquares: array of indexes in a winning line (to highlight)
 *   - disabled: disables interaction if true
 *   - palette: color palette object
 */
function Board({ squares, onClick, winSquares, disabled, palette }) {
  return (
    <div
      role="grid"
      aria-label="Tic Tac Toe board"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 56px)`,
        gridTemplateRows: `repeat(${BOARD_SIZE}, 56px)`,
        gap: 0,
        background: palette.primary + '10',
        border: `2.5px solid ${palette.primary}`,
        borderRadius: 8,
        boxShadow: '0 0 0 1px rgba(33,150,243,0.025)',
        margin: '0 auto'
      }}
      tabIndex={0}
    >
      {squares.map((val, idx) =>
        <Square
          key={idx}
          value={val}
          onClick={() => onClick(idx)}
          highlight={winSquares.includes(idx)}
          disabled={disabled || !!val}
          palette={palette}
        />
      )}
    </div>
  );
}

/**
 * Square component for one board cell
 * @param {Object} props
 *   - value: "X", "O" or null
 *   - onClick: click callback
 *   - highlight: highlight if part of winning line
 *   - disabled: disables square if true
 *   - palette: color palette object
 */
function Square({ value, onClick, highlight, disabled, palette }) {
  return (
    <button
      aria-label={value ? `Cell ${value}` : "Empty cell"}
      type="button"
      className="ttt-square"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 56,
        height: 56,
        background: highlight ? palette.accent + '11' : palette.secondary,
        border: `1px solid ${highlight ? palette.accent : palette.primary + '60'}`,
        borderRadius: 6,
        fontSize: '2.1rem',
        fontWeight: 700,
        color: value === "X" ? palette.primary : value === "O" ? palette.accent : palette.primary,
        textAlign: 'center',
        outline: highlight ? '2px solid ' + palette.accent : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        margin: 0,
        transition: 'background 0.18s, border 0.18s'
      }}
      tabIndex={value ? -1 : 0}
    >
      {value}
    </button>
  );
}
