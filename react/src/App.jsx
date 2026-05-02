import React, { useState } from 'react'
import './App.css'

function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const winner = checkWinner(board);
    const isDraw = !winner && board.every(square => square !== null);

    const handleClick = (index) => {
        if (board[index] || winner) return;
        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
    };

    return (
        <div>
            <h2>Tic-Tac-Toe Game</h2>
            <div className="status">
                {winner ? `Winner: ${winner}` : isDraw ? "Draw!" : `Next player: ${isXNext ? 'X' : 'O'}`}
            </div>
            <div className="board">
                {board.map((square, i) => (
                    <div key={i} className="square" onClick={() => handleClick(i)}>
                        {square}
                    </div>
                ))}
            </div>
            <button className="reset-btn" onClick={resetGame}>Restart Game</button>
        </div>
    );
}

function Calculator() {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);

    const handleDigit = (digit) => {
        if (waitingForNewValue) {
            setDisplay(String(digit));
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === '0' ? String(digit) : display + digit);
        }
    };

    const handleOperator = (nextOperator) => {
        const inputValue = parseFloat(display);
        
        if (previousValue == null) {
            setPreviousValue(inputValue);
        } else if (operator) {
            const currentValue = previousValue || 0;
            let newValue = 0;
            if (operator === '+') newValue = currentValue + inputValue;
            else if (operator === '-') newValue = currentValue - inputValue;
            else if (operator === '*') newValue = currentValue * inputValue;
            else if (operator === '/') newValue = currentValue / inputValue;
            
            setPreviousValue(newValue);
            setDisplay(String(newValue));
        }
        
        setWaitingForNewValue(true);
        setOperator(nextOperator);
    };

    const handleEqual = () => {
        if (!operator || previousValue == null) return;
        handleOperator(operator);
        setOperator(null);
        setPreviousValue(null);
        setWaitingForNewValue(true);
    };

    const handleClear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };

    return (
        <div>
            <h2>React Calculator</h2>
            <div className="calc">
                <div className="display">{display}</div>
                <div className="keypad">
                    <button className="calc-btn clear" onClick={handleClear}>C</button>
                    <button className="calc-btn op" onClick={() => handleOperator('/')}>/</button>
                    <button className="calc-btn op" onClick={() => handleOperator('*')}>*</button>
                    
                    <button className="calc-btn" onClick={() => handleDigit(7)}>7</button>
                    <button className="calc-btn" onClick={() => handleDigit(8)}>8</button>
                    <button className="calc-btn" onClick={() => handleDigit(9)}>9</button>
                    <button className="calc-btn op" onClick={() => handleOperator('-')}>-</button>
                    
                    <button className="calc-btn" onClick={() => handleDigit(4)}>4</button>
                    <button className="calc-btn" onClick={() => handleDigit(5)}>5</button>
                    <button className="calc-btn" onClick={() => handleDigit(6)}>6</button>
                    <button className="calc-btn op" onClick={() => handleOperator('+')}>+</button>
                    
                    <button className="calc-btn" onClick={() => handleDigit(1)}>1</button>
                    <button className="calc-btn" onClick={() => handleDigit(2)}>2</button>
                    <button className="calc-btn" onClick={() => handleDigit(3)}>3</button>
                    <button className="calc-btn op" style={{gridRow: 'span 2'}} onClick={handleEqual}>=</button>
                    
                    <button className="calc-btn zero" onClick={() => handleDigit(0)}>0</button>
                    <button className="calc-btn" onClick={() => handleDigit('.')}>.</button>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [currentApp, setCurrentApp] = useState('tictactoe');

    return (
        <div className="container">
            <h1>Single Page Application (SPA)</h1>
            <div className="nav-menu">
                <button 
                    className={`nav-btn ${currentApp === 'tictactoe' ? 'active' : ''}`}
                    onClick={() => setCurrentApp('tictactoe')}
                >
                    Tic-Tac-Toe
                </button>
                <button 
                    className={`nav-btn ${currentApp === 'calc' ? 'active' : ''}`}
                    onClick={() => setCurrentApp('calc')}
                >
                    Calculator
                </button>
            </div>
            
            <div className="app-content">
                {currentApp === 'tictactoe' ? <TicTacToe /> : <Calculator />}
            </div>
        </div>
    );
}

export default App;
