let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isComputerPlayer = false;

function handleClick(index) {
  if (gameActive && board[index] === '') {
    board[index] = currentPlayer;
    updateCell(index);

    if (checkWinner()) {
      endGame(`Player ${currentPlayer} wins!`);
    } else if (isBoardFull()) {
      endGame('It\'s a tie!');
    } else {
      switchPlayer();
      if (isComputerPlayer && currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500);
      }
    }
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function makeComputerMove() {
  const emptyCells = board.reduce((acc, cell, index) => (cell === '' ? [...acc, index] : acc), []);

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerMove = emptyCells[randomIndex];
    board[computerMove] = currentPlayer;
    updateCell(computerMove);

    if (checkWinner()) {
      endGame('Computer wins!');
    } else if (isBoardFull()) {
      endGame('It\'s a tie!');
    } else {
      switchPlayer();
    }
  }
}

function updateCell(index) {
  const cell = document.getElementById('board').children[index];
  cell.innerText = currentPlayer;
  cell.classList.add('win');
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
      highlightWinningCells(pattern);
      return true;
    }
  }

  return false;
}

function highlightWinningCells(cells) {
  for (const cellIndex of cells) {
    document.getElementById('board').children[cellIndex].classList.add('win');
  }
}

function isBoardFull() {
  return !board.includes('');
}

function endGame(message) {
  gameActive = false;
  updateStatus(message);
  setTimeout(() => {
    hideBoard();
    updateStatus('Game Over');
    showRestartButton();
  }, 1000);
}

function hideBoard() {
  const boardElement = document.getElementById('board');
  boardElement.style.opacity = 0;
}

function showRestartButton() {
  const buttonContainer = document.getElementById('button-container');
  // Clear existing buttons before adding new ones
  buttonContainer.innerHTML = '';

  const restartButton = document.createElement('button');
  restartButton.innerText = 'Restart Game';
  restartButton.onclick = resetGame;
  buttonContainer.appendChild(restartButton);

  if (isComputerPlayer) {
    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Toggle Game Mode';
    toggleButton.onclick = toggleGameMode;
    buttonContainer.appendChild(toggleButton);
  }
}

function resetGame() {
  currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;

  const boardElement = document.getElementById('board');
  boardElement.style.opacity = 1;

  const cells = boardElement.children;
  for (const cell of cells) {
    cell.innerText = '';
    cell.classList.remove('win');
  }

  const buttonContainer = document.getElementById('button-container');
  buttonContainer.innerHTML = '';

  if (isComputerPlayer && currentPlayer === 'O') {
    setTimeout(makeComputerMove, 500);
  }

  updateStatus(`Player ${currentPlayer}'s turn`);
  
  // Show the buttons after resetting the game
  const toggleButton = document.createElement('button');
  toggleButton.innerText = 'Toggle Game Mode';
  toggleButton.onclick = toggleGameMode;
  buttonContainer.appendChild(toggleButton);

  if (isComputerPlayer) {
    showRestartButton();
  }
}

function toggleGameMode() {
  isComputerPlayer = !isComputerPlayer;
  resetGame();
  updateStatus(`Game mode: ${isComputerPlayer ? 'Computer' : 'Two Players'}`);
  
  const buttonContainer = document.getElementById('button-container');
  const toggleButton = document.createElement('button');
  toggleButton.innerText = 'Toggle Game Mode';
  toggleButton.onclick = toggleGameMode;
  buttonContainer.innerHTML = ''; // Clear existing content
  buttonContainer.appendChild(toggleButton);

  if (isComputerPlayer) {
    showRestartButton();
  }
}

function updateStatus(message) {
  const statusElement = document.getElementById('status');
  statusElement.innerText = message;
  statusElement.style.opacity = 1;

  if (message !== 'Game Over') {
    setTimeout(() => {
      statusElement.style.opacity = 0;
    }, 2000);
  }
}
