export const BLACK = 1;
export const WHITE = -1;
export const EMPTY = 0;
export const SIZE = 8;

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const POSITION_WEIGHTS = [
  [120, -25, 20, 6, 6, 20, -25, 120],
  [-25, -45, -5, -5, -5, -5, -45, -25],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [6, -5, 3, 3, 3, 3, -5, 6],
  [6, -5, 3, 3, 3, 3, -5, 6],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-25, -45, -5, -5, -5, -5, -45, -25],
  [120, -25, 20, 6, 6, 20, -25, 120],
];

export function createInitialBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  board[3][3] = WHITE;
  board[4][4] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  return board;
}

export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

export function opponent(player) {
  return -player;
}

export function keyFor(row, col) {
  return `${row}:${col}`;
}

function isInside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

export function collectFlips(board, row, col, player) {
  if (!isInside(row, col) || board[row][col] !== EMPTY) return [];

  const flips = [];
  for (const [dr, dc] of DIRECTIONS) {
    const path = [];
    let r = row + dr;
    let c = col + dc;

    while (isInside(r, c) && board[r][c] === opponent(player)) {
      path.push([r, c]);
      r += dr;
      c += dc;
    }

    if (path.length > 0 && isInside(r, c) && board[r][c] === player) {
      flips.push(...path);
    }
  }

  return flips;
}

export function getLegalMoves(board, player) {
  const moves = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const flips = collectFlips(board, row, col, player);
      if (flips.length > 0) moves.push({ row, col, flips });
    }
  }
  return moves;
}

export function applyMove(board, move, player) {
  const nextBoard = cloneBoard(board);
  nextBoard[move.row][move.col] = player;
  for (const [row, col] of move.flips) {
    nextBoard[row][col] = player;
  }
  return nextBoard;
}

export function countPieces(board) {
  return board.flat().reduce(
    (counts, value) => {
      if (value === BLACK) counts.black += 1;
      if (value === WHITE) counts.white += 1;
      if (value === EMPTY) counts.empty += 1;
      return counts;
    },
    { black: 0, white: 0, empty: 0 },
  );
}

export function isTerminal(board) {
  return (
    countPieces(board).empty === 0 ||
    (getLegalMoves(board, BLACK).length === 0 && getLegalMoves(board, WHITE).length === 0)
  );
}

function evaluateBoard(board, aiPlayer) {
  const aiMoves = getLegalMoves(board, aiPlayer).length;
  const rivalMoves = getLegalMoves(board, opponent(aiPlayer)).length;
  const counts = countPieces(board);
  const aiCount = aiPlayer === BLACK ? counts.black : counts.white;
  const rivalCount = aiPlayer === BLACK ? counts.white : counts.black;

  let positional = 0;
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] === aiPlayer) positional += POSITION_WEIGHTS[row][col];
      if (board[row][col] === opponent(aiPlayer)) positional -= POSITION_WEIGHTS[row][col];
    }
  }

  const corners = [
    board[0][0],
    board[0][7],
    board[7][0],
    board[7][7],
  ].reduce((score, value) => {
    if (value === aiPlayer) return score + 1;
    if (value === opponent(aiPlayer)) return score - 1;
    return score;
  }, 0);

  return positional + (aiMoves - rivalMoves) * 20 + corners * 220 + (aiCount - rivalCount) * 6;
}

function orderMoves(moves) {
  return [...moves].sort((a, b) => {
    const scoreA = POSITION_WEIGHTS[a.row][a.col] + a.flips.length * 4;
    const scoreB = POSITION_WEIGHTS[b.row][b.col] + b.flips.length * 4;
    return scoreB - scoreA;
  });
}

function minimax(board, playerToMove, aiPlayer, depth, alpha, beta) {
  if (depth === 0 || isTerminal(board)) return evaluateBoard(board, aiPlayer);

  const moves = getLegalMoves(board, playerToMove);
  if (moves.length === 0) {
    return minimax(board, opponent(playerToMove), aiPlayer, depth - 1, alpha, beta);
  }

  if (playerToMove === aiPlayer) {
    let value = -Infinity;
    for (const move of orderMoves(moves)) {
      const nextBoard = applyMove(board, move, playerToMove);
      value = Math.max(
        value,
        minimax(nextBoard, opponent(playerToMove), aiPlayer, depth - 1, alpha, beta),
      );
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  }

  let value = Infinity;
  for (const move of orderMoves(moves)) {
    const nextBoard = applyMove(board, move, playerToMove);
    value = Math.min(
      value,
      minimax(nextBoard, opponent(playerToMove), aiPlayer, depth - 1, alpha, beta),
    );
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return value;
}

export function chooseAiMove(board, aiPlayer, depth) {
  const moves = getLegalMoves(board, aiPlayer);
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of orderMoves(moves)) {
    const nextBoard = applyMove(board, move, aiPlayer);
    const score = minimax(nextBoard, opponent(aiPlayer), aiPlayer, depth - 1, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
