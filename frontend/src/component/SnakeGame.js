// SnakeGame.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

import './SnakeGame.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  // const [size, setSize] = useState(20);
  // const [speed, setSpeed] = useState(200);
  const [paused, setPaused] = useState(true);

  const size = 20;
  const speed = 200;

  const gameArea = useRef(null);

  const togglePause = () => {
    setPaused((prevPaused) => !prevPaused);
  };  

  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    return { x, y };
  };

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowUp' && direction.y === 0) {
      setDirection({ x: 0, y: -1 });
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
      setDirection({ x: 0, y: 1 });
    } else if (event.key === 'ArrowLeft' && direction.x === 0) {
      setDirection({ x: -1, y: 0 });
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
      setDirection({ x: 1, y: 0 });
    }
  };

  const moveSnake = useCallback(() => {
    const newHead = {
      x: (snake[0].x + direction.x + size) % size,
      y: (snake[0].y + direction.y + size) % size,
    };
  
    if (snake.some((part) => part.x === newHead.x && part.y === newHead.y)) {
      setSnake([{ x: 10, y: 10 }]);
      setFood(getRandomPosition());
      setDirection({ x: 1, y: 0 });
      return;
    }
  
    setSnake((prevState) => [newHead, ...prevState.slice(0, -1)]);
  
    if (newHead.x === food.x && newHead.y === food.y) {
      setSnake((prevState) => [...prevState, prevState[prevState.length - 1]]);
      setFood(getRandomPosition());
    }
  }, [snake, direction, size, food]);

  useEffect(() => {
    if (paused) {
      return;
    }
  
    gameArea.current.focus();
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [snake, direction, moveSnake, speed, paused]);
  
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated || !userRole ==='admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="game-container">
      <div
        ref={gameArea}
        className="game-area"
        tabIndex="0"
        onKeyDown={handleKeyPress}
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {snake.map((part, index) => (
          <div
            key={index}
            className="snake-part"
            style={{ gridColumnStart: part.x + 1, gridRowStart: part.y + 1 }}
          />
        ))}
        <div
          className="food"
          style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }}
        />
      </div>
      <button className="pause-button" onClick={togglePause}>
        {paused ? 'Reprendre' : 'Pause'}
      </button>
    </div>
  );
};

export default SnakeGame;
