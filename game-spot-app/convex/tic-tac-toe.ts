// Tic-Tac-Toe specific game logic

type Board = (string | null)[][];

const checkWinner = (board: Board) => {
  const lines = [
    // Rows
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    // Columns
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    // Diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const line of lines) {
    if (line[0] && line[0] === line[1] && line[0] === line[2]) {
      return line[0]; // 'X' or 'O'
    }
  }
  return null;
};

const isBoardFull = (board: Board) => {
  return board.every(row => row.every(cell => cell !== null));
};

export const handleTicTacToeMove = (gameState: any, move: any, playerSymbol: 'X' | 'O') => {
  const { board, turn } = gameState;
  const { row, col } = move;

  if (turn !== playerSymbol) {
    throw new Error("Not your turn.");
  }

  if (board[row][col] !== null) {
    throw new Error("Cell is already taken.");
  }

  const newBoard = board.map((r: any, rIndex: number) =>
    r.map((c: any, cIndex: number) => (rIndex === row && cIndex === col ? playerSymbol : c))
  );

  const winner = checkWinner(newBoard);
  const isFull = isBoardFull(newBoard);

  let status: "in_progress" | "finished" = "in_progress";
  let winnerSymbol: 'X' | 'O' | 'Tie' | null = null;

  if (winner) {
    status = "finished";
    winnerSymbol = winner as 'X' | 'O';
  } else if (isFull) {
    status = "finished";
    winnerSymbol = "Tie";
  }

  return {
    newGameState: {
      board: newBoard,
      turn: turn === "X" ? "O" : "X",
    },
    newStatus: status,
    winner: winnerSymbol,
  };
};
