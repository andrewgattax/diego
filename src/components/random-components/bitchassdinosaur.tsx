import React, { useState, useEffect } from 'react';
import './bitchstyle/bitchass.css';

import bombAudio from '../../assets/audio/faaah.mp3';
import bombTexture from '../../assets/diego/image2.jpeg';
import img1 from '../../assets/diego/image1.jpeg';
import img2 from '../../assets/diego/image2.jpeg';
import img3 from '../../assets/diego/image3.jpeg';
import img4 from '../../assets/diego/image4.jpeg';
import img5 from '../../assets/diego/image5.jpeg';

const diegoImages = [img1, img2, img3, img4, img5];

const ROWS = 10;
const COLS = 10;
const MINES = 10;

type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type GameState = 'playing' | 'won' | 'lost';

export default function BitchAssDinosaur() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // 1. Create empty grid
    let newGrid: Cell[][] = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => ({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // 2. Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // 3. Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < ROWS && c + j >= 0 && c + j < COLS) {
                if (newGrid[r + i][c + j].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameState('playing');
  };

  const revealCell = (row: number, col: number) => {
    if (gameState !== 'playing') return;
    const newGrid = [...grid.map(r => [...r])]; // Deep copy
    const cell = newGrid[row][col];

    if (cell.isRevealed || cell.isFlagged) return;

    if (cell.isMine) {
      // Game Over
      const audio = new Audio(bombAudio);
      audio.volume = 1;
      audio.play().catch(e => console.error(e));

      newGrid.forEach(r => r.forEach(c => {
        if (c.isMine) c.isRevealed = true;
      }));
      setGrid(newGrid);
      setGameState('lost');
      return;
    }

    // Flood fill to reveal empty cells
    const stack = [[row, col]];
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const current = newGrid[r][c];

      if (!current.isRevealed && !current.isFlagged) {
        current.isRevealed = true;

        if (current.neighborMines === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < ROWS && c + j >= 0 && c + j < COLS) {
                stack.push([r + i, c + j]);
              }
            }
          }
        }
      }
    }

    setGrid(newGrid);

    // Check Win
    let hasWon = true;
    newGrid.forEach(r => r.forEach(c => {
      if (!c.isMine && !c.isRevealed) hasWon = false;
    }));

    if (hasWon) {
      setGameState('won');
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const newGrid = [...grid];
    if (!newGrid[row][col].isRevealed) {
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
      setGrid([...newGrid]);
    }
  };

  const renderConfetti = () => {
    if (gameState !== 'won') return null;
    return (
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 3;
          const duration = 3 + Math.random() * 4;
          const img = diegoImages[Math.floor(Math.random() * diegoImages.length)];
          return (
            <img
              key={i}
              src={img}
              className="confetti-piece"
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
              alt="confetti"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="minesweeper-container">
      {renderConfetti()}
      <h1>Bitchass</h1>
      <div className="game-status">
        {gameState === 'won' && <span className="won">You Won! 🎉</span>}
        {gameState === 'lost' && <span className="lost">Game Over! 💥</span>}
        {gameState === 'playing' && <span>Playing... 💣</span>}
        <button onClick={startNewGame}>Restart</button>
      </div>

      <div className="grid">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="row">
            {row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isMine && cell.isRevealed ? 'mine' : ''} ${cell.isFlagged ? 'flagged' : ''}`}
                onClick={() => revealCell(cell.row, cell.col)}
                onContextMenu={(e) => toggleFlag(e, cell.row, cell.col)}
              >
                {cell.isRevealed ? (
                  cell.isMine ? <img src={bombTexture} alt="bomb" draggable="false" /> : cell.neighborMines > 0 ? cell.neighborMines : ''
                ) : (
                  cell.isFlagged ? '🚩' : ''
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}