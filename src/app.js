const BLACK = 1;
const WHITE = -1;
const EMPTY = 0;
const SIZE = 8;
const FLIP_ANIMATION_MS = 850;
const AI_MOVE_DELAY_MS = 1450;
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

const boardElement = document.querySelector("#board");
const htmlRoot = document.querySelector("#htmlRoot");
const eyebrowText = document.querySelector("#eyebrowText");
const blackScore = document.querySelector("#blackScore");
const whiteScore = document.querySelector("#whiteScore");
const blackLabel = document.querySelector("#blackLabel");
const whiteLabel = document.querySelector("#whiteLabel");
const blackMoves = document.querySelector("#blackMoves");
const whiteMoves = document.querySelector("#whiteMoves");
const emptyCells = document.querySelector("#emptyCells");
const turnDot = document.querySelector("#turnDot");
const turnLabel = document.querySelector("#turnLabel");
const gameMessage = document.querySelector("#gameMessage");
const languageSelect = document.querySelector("#languageSelect");
const modeSelect = document.querySelector("#modeSelect");
const playerColorSelect = document.querySelector("#playerColorSelect");
const difficultySelect = document.querySelector("#difficultySelect");
const newGameButton = document.querySelector("#newGameButton");
const undoButton = document.querySelector("#undoButton");
const moveList = document.querySelector("#moveList");
const aiBadge = document.querySelector("#aiBadge");
const blackScoreCard = document.querySelector("#blackScoreCard");
const whiteScoreCard = document.querySelector("#whiteScoreCard");
const languageLabel = document.querySelector("#languageLabel");
const modeLabel = document.querySelector("#modeLabel");
const playerColorLabel = document.querySelector("#playerColorLabel");
const difficultyLabel = document.querySelector("#difficultyLabel");
const blackMovesLabel = document.querySelector("#blackMovesLabel");
const whiteMovesLabel = document.querySelector("#whiteMovesLabel");
const emptyCellsLabel = document.querySelector("#emptyCellsLabel");
const activityTitle = document.querySelector("#activityTitle");
const endgameOverlay = document.querySelector("#endgameOverlay");
const endgameKicker = document.querySelector("#endgameKicker");
const endgameTitle = document.querySelector("#endgameTitle");
const endgameDetail = document.querySelector("#endgameDetail");
const endgameBlackScore = document.querySelector("#endgameBlackScore");
const endgameWhiteScore = document.querySelector("#endgameWhiteScore");
const playAgainButton = document.querySelector("#playAgainButton");

const translations = {
  es: {
    pageTitle: "Othello Minimax",
    eyebrow: "Othello con algoritmo minimax",
    language: "Idioma",
    mode: "Modo",
    playerColor: "Tu color",
    difficulty: "Dificultad IA",
    newGame: "Nueva partida",
    undo: "Deshacer",
    activity: "Actividad",
    blackMoves: "jugadas negras",
    whiteMoves: "jugadas blancas",
    emptyCells: "casillas libres",
    you: "Tu",
    ai: "IA",
    playerOne: "Jugador 1",
    playerTwo: "Jugador 2",
    black: "Negras",
    white: "Blancas",
    blackDisc: "ficha negra",
    whiteDisc: "ficha blanca",
    emptyCell: "casilla vacia",
    validMove: "jugada valida",
    turn: "Turno de {color}",
    gameOver: "Partida terminada",
    aiThinkingTitle: "La IA esta pensando",
    chooseMove: "Elige una casilla marcada.",
    thinking: "Calculando la mejor jugada...",
    noMoves: "Sin jugadas validas, el turno pasa.",
    winnerBlack: "Ganan Negras",
    winnerWhite: "Ganan Blancas",
    tie: "Empate",
    final: "Final",
    aiReady: "IA lista",
    aiThinking: "IA pensando",
    depth: "Profundidad {depth}",
    pvp: "PVP",
    ready: "La partida esta lista.",
    manualMove: "Jugada manual",
    minimaxMove: "Minimax profundidad {depth}",
    passTurn: "Sin jugadas disponibles",
    passes: "pasa turno",
    modeAi: "Jugador vs IA",
    modePvp: "Jugador vs jugador",
    colorBlack: "Negras",
    colorWhite: "Blancas",
    difficultyLight: "Ligera",
    difficultyCompetitive: "Competitiva",
    difficultyDeep: "Profunda",
    difficultyExpert: "Experta",
    result: "Resultado",
    youWin: "Ganaste",
    youLose: "Perdiste",
    pvpWinner: "Gana {winner}",
    finalTieTitle: "Empate",
    finalScore: "Marcador final {black}-{white}.",
    playerVictoryDetail: "{winner} cierra la partida con ventaja.",
    youWinDetail: "Dominaste el tablero y venciste a la IA.",
    youLoseDetail: "La IA gana esta vez. Puedes ajustar la dificultad y volver a intentarlo.",
    tieDetail: "Nadie pudo romper el equilibrio del tablero.",
    htmlLang: "es",
  },
  en: {
    pageTitle: "Othello Minimax",
    eyebrow: "Othello with minimax algorithm",
    language: "Language",
    mode: "Mode",
    playerColor: "Your color",
    difficulty: "AI difficulty",
    newGame: "New game",
    undo: "Undo",
    activity: "Activity",
    blackMoves: "black moves",
    whiteMoves: "white moves",
    emptyCells: "empty cells",
    you: "You",
    ai: "AI",
    playerOne: "Player 1",
    playerTwo: "Player 2",
    black: "Black",
    white: "White",
    blackDisc: "black disc",
    whiteDisc: "white disc",
    emptyCell: "empty cell",
    validMove: "valid move",
    turn: "{color}'s turn",
    gameOver: "Game over",
    aiThinkingTitle: "The AI is thinking",
    chooseMove: "Choose a highlighted square.",
    thinking: "Calculating the best move...",
    noMoves: "No valid moves, turn passes.",
    winnerBlack: "Black wins",
    winnerWhite: "White wins",
    tie: "Tie",
    final: "Final",
    aiReady: "AI ready",
    aiThinking: "AI thinking",
    depth: "Depth {depth}",
    pvp: "PVP",
    ready: "The game is ready.",
    manualMove: "Manual move",
    minimaxMove: "Minimax depth {depth}",
    passTurn: "No moves available",
    passes: "passes",
    modeAi: "Player vs AI",
    modePvp: "Player vs player",
    colorBlack: "Black",
    colorWhite: "White",
    difficultyLight: "Light",
    difficultyCompetitive: "Competitive",
    difficultyDeep: "Deep",
    difficultyExpert: "Expert",
    result: "Result",
    youWin: "You win",
    youLose: "You lose",
    pvpWinner: "{winner} wins",
    finalTieTitle: "Tie",
    finalScore: "Final score {black}-{white}.",
    playerVictoryDetail: "{winner} closes the game with the lead.",
    youWinDetail: "You controlled the board and beat the AI.",
    youLoseDetail: "The AI wins this time. Adjust the difficulty and try again.",
    tieDetail: "Nobody broke the balance of the board.",
    htmlLang: "en",
  },
};

const state = {
  board: createInitialBoard(),
  currentPlayer: BLACK,
  mode: "ai",
  language: "es",
  humanColor: BLACK,
  aiDepth: 3,
  history: [],
  lastMove: null,
  lastFlips: [],
  flipAnimationId: 0,
  aiTurnId: 0,
  legalMoves: [],
  isThinking: false,
  gameOver: false,
};

function createInitialBoard() {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  board[3][3] = WHITE;
  board[4][4] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  return board;
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function opponent(player) {
  return -player;
}

function isInside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function collectFlips(board, row, col, player) {
  if (!isInside(row, col) || board[row][col] !== EMPTY) {
    return [];
  }

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

function getLegalMoves(board, player) {
  const moves = [];

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const flips = collectFlips(board, row, col, player);
      if (flips.length > 0) {
        moves.push({ row, col, flips });
      }
    }
  }

  return moves;
}

function applyMove(board, move, player) {
  const nextBoard = cloneBoard(board);
  nextBoard[move.row][move.col] = player;

  for (const [row, col] of move.flips) {
    nextBoard[row][col] = player;
  }

  return nextBoard;
}

function countPieces(board) {
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

function isTerminal(board) {
  return (
    countPieces(board).empty === 0 ||
    (getLegalMoves(board, BLACK).length === 0 && getLegalMoves(board, WHITE).length === 0)
  );
}

function t(key, values = {}) {
  const template = translations[state.language][key] ?? translations.es[key] ?? key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

function colorName(player) {
  return player === BLACK ? t("black") : t("white");
}

function updateStaticText() {
  document.title = t("pageTitle");
  htmlRoot.lang = t("htmlLang");
  eyebrowText.textContent = t("eyebrow");
  languageLabel.textContent = t("language");
  modeLabel.textContent = t("mode");
  playerColorLabel.textContent = t("playerColor");
  difficultyLabel.textContent = t("difficulty");
  newGameButton.textContent = t("newGame");
  undoButton.textContent = t("undo");
  blackMovesLabel.textContent = t("blackMoves");
  whiteMovesLabel.textContent = t("whiteMoves");
  emptyCellsLabel.textContent = t("emptyCells");
  activityTitle.textContent = t("activity");
  setOptionText(modeSelect, "ai", t("modeAi"));
  setOptionText(modeSelect, "pvp", t("modePvp"));
  setOptionText(playerColorSelect, "1", t("colorBlack"));
  setOptionText(playerColorSelect, "-1", t("colorWhite"));
  setOptionText(difficultySelect, "2", t("difficultyLight"));
  setOptionText(difficultySelect, "3", t("difficultyCompetitive"));
  setOptionText(difficultySelect, "4", t("difficultyDeep"));
  setOptionText(difficultySelect, "5", t("difficultyExpert"));
}

function setOptionText(select, value, text) {
  const option = [...select.options].find((item) => item.value === value);
  if (option) option.textContent = text;
}

function minimax(board, playerToMove, aiPlayer, depth, alpha, beta) {
  if (depth === 0 || isTerminal(board)) {
    return evaluateBoard(board, aiPlayer);
  }

  const moves = getLegalMoves(board, playerToMove);
  if (moves.length === 0) {
    return minimax(board, opponent(playerToMove), aiPlayer, depth - 1, alpha, beta);
  }

  const maximizing = playerToMove === aiPlayer;

  if (maximizing) {
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

function orderMoves(moves) {
  return [...moves].sort((a, b) => {
    const scoreA = POSITION_WEIGHTS[a.row][a.col] + a.flips.length * 4;
    const scoreB = POSITION_WEIGHTS[b.row][b.col] + b.flips.length * 4;
    return scoreB - scoreA;
  });
}

function chooseAiMove(board, aiPlayer, depth) {
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

function renderBoard() {
  updateStaticText();
  state.legalMoves = getLegalMoves(state.board, state.currentPlayer);
  const legalKeys = new Set(state.legalMoves.map((move) => keyFor(move.row, move.col)));
  const flippedKeys = new Map(
    state.lastFlips.map((flip, index) => [keyFor(flip.row, flip.col), index]),
  );
  boardElement.innerHTML = "";

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const cell = document.createElement("button");
      const value = state.board[row][col];
      const legal = legalKeys.has(keyFor(row, col));
      const isLast = state.lastMove?.row === row && state.lastMove?.col === col;

      cell.className = "cell";
      if (legal && canCurrentSidePlay()) cell.classList.add("legal");
      if (isLast) cell.classList.add("last-move");
      cell.type = "button";
      cell.role = "gridcell";
      cell.ariaLabel = buildCellLabel(row, col, value, legal);
      cell.disabled = state.gameOver || state.isThinking || !legal || !canCurrentSidePlay();
      cell.addEventListener("click", () => playHumanMove(row, col));

      if (value !== EMPTY) {
        const disc = document.createElement("span");
        const flippedIndex = flippedKeys.get(keyFor(row, col));
        const classNames = ["disc", value === BLACK ? "black" : "white"];

        if (flippedIndex !== undefined) {
          const fromColor = value === BLACK ? "white" : "black";
          const toColor = value === BLACK ? "black" : "white";

          classNames.push("flipped");
          disc.style.setProperty("--flip-delay", `${Math.min(flippedIndex, 8) * 55}ms`);
          disc.appendChild(createDiscFace("front", fromColor));
          disc.appendChild(createDiscFace("back", toColor));
        }

        disc.className = classNames.join(" ");
        cell.appendChild(disc);
      } else if (legal && canCurrentSidePlay()) {
        const hint = document.createElement("span");
        hint.className = "move-hint";
        cell.appendChild(hint);
      }

      boardElement.appendChild(cell);
    }
  }

  renderHud();
}

function createDiscFace(side, color) {
  const face = document.createElement("span");
  face.className = `disc-face ${side} ${color}`;
  return face;
}

function renderHud() {
  const counts = countPieces(state.board);
  const blackLegal = getLegalMoves(state.board, BLACK).length;
  const whiteLegal = getLegalMoves(state.board, WHITE).length;
  const result = getGameResult(counts);

  blackScore.textContent = counts.black;
  whiteScore.textContent = counts.white;
  blackMoves.textContent = blackLegal;
  whiteMoves.textContent = whiteLegal;
  emptyCells.textContent = counts.empty;
  blackScoreCard.classList.toggle("active", state.currentPlayer === BLACK && !state.gameOver);
  whiteScoreCard.classList.toggle("active", state.currentPlayer === WHITE && !state.gameOver);
  turnDot.className = `status-dot ${state.currentPlayer === BLACK ? "dark" : "light"}`;

  if (state.mode === "ai") {
    blackLabel.textContent = state.humanColor === BLACK ? t("you") : t("ai");
    whiteLabel.textContent = state.humanColor === WHITE ? t("you") : t("ai");
  } else {
    blackLabel.textContent = t("playerOne");
    whiteLabel.textContent = t("playerTwo");
  }

  if (state.gameOver) {
    const winner = result.winnerLabel;
    turnLabel.textContent = t("gameOver");
    gameMessage.textContent = `${winner} ${counts.black}-${counts.white}.`;
    aiBadge.textContent = t("final");
    renderEndgame(result, counts);
  } else if (state.isThinking) {
    turnLabel.textContent = t("aiThinkingTitle");
    gameMessage.textContent = t("thinking");
    aiBadge.textContent = t("aiThinking");
    hideEndgame();
  } else {
    const color = colorName(state.currentPlayer);
    turnLabel.textContent = t("turn", { color });
    gameMessage.textContent = state.legalMoves.length
      ? t("chooseMove")
      : t("noMoves");
    aiBadge.textContent = state.mode === "ai" ? t("depth", { depth: state.aiDepth }) : t("pvp");
    hideEndgame();
  }

  undoButton.disabled = state.history.length === 0 || state.isThinking;
  playerColorSelect.disabled = state.mode === "pvp" || state.isThinking;
  difficultySelect.disabled = state.mode === "pvp" || state.isThinking;
}

function getGameResult(counts = countPieces(state.board)) {
  const winner =
    counts.black === counts.white ? EMPTY : counts.black > counts.white ? BLACK : WHITE;
  const winnerLabel =
    winner === EMPTY ? t("tie") : winner === BLACK ? t("winnerBlack") : t("winnerWhite");

  if (winner === EMPTY) {
    return {
      winner,
      winnerLabel,
      title: t("finalTieTitle"),
      detail: t("tieDetail"),
      tone: "tie",
    };
  }

  if (state.mode === "ai") {
    const humanWon = winner === state.humanColor;
    return {
      winner,
      winnerLabel,
      title: humanWon ? t("youWin") : t("youLose"),
      detail: humanWon ? t("youWinDetail") : t("youLoseDetail"),
      tone: humanWon ? "win" : "lose",
    };
  }

  return {
    winner,
    winnerLabel,
    title: t("pvpWinner", { winner: winner === BLACK ? t("playerOne") : t("playerTwo") }),
    detail: t("playerVictoryDetail", { winner: winnerLabel }),
    tone: "pvp",
  };
}

function renderEndgame(result, counts) {
  endgameOverlay.hidden = false;
  endgameOverlay.className = `endgame-overlay ${result.tone}`;
  endgameKicker.textContent = t("result");
  endgameTitle.textContent = result.title;
  endgameDetail.textContent = `${result.detail} ${t("finalScore", {
    black: counts.black,
    white: counts.white,
  })}`;
  endgameBlackScore.textContent = counts.black;
  endgameWhiteScore.textContent = counts.white;
  playAgainButton.textContent = t("newGame");
}

function hideEndgame() {
  endgameOverlay.hidden = true;
  endgameOverlay.className = "endgame-overlay";
}

function renderActivity() {
  const recent = state.history.slice(-12).reverse();
  moveList.innerHTML = "";

  if (recent.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-activity";
    item.textContent = t("ready");
    moveList.appendChild(item);
    return;
  }

  for (const entry of recent) {
    const item = document.createElement("li");
    const moveText =
      entry.move === "pass"
        ? t("passes")
        : `${String.fromCharCode(65 + entry.move.col)}${entry.move.row + 1}`;
    const note = entry.noteKey ? t(entry.noteKey, entry.noteValues) : entry.note;
    item.innerHTML = `
      <span class="disc-mini ${entry.player === BLACK ? "dark" : "light"}"></span>
      <div>
        <strong>${colorName(entry.player)} ${moveText}</strong>
        <small>${note}</small>
      </div>
    `;
    moveList.appendChild(item);
  }
}

function buildCellLabel(row, col, value, legal) {
  const coordinate = `${String.fromCharCode(65 + col)}${row + 1}`;
  if (value === BLACK) return `${coordinate}, ${t("blackDisc")}`;
  if (value === WHITE) return `${coordinate}, ${t("whiteDisc")}`;
  if (legal) return `${coordinate}, ${t("validMove")}`;
  return `${coordinate}, ${t("emptyCell")}`;
}

function keyFor(row, col) {
  return `${row}:${col}`;
}

function canCurrentSidePlay() {
  return state.mode === "pvp" || state.currentPlayer === state.humanColor;
}

function playHumanMove(row, col) {
  const move = state.legalMoves.find((item) => item.row === row && item.col === col);
  if (!move || state.isThinking || state.gameOver || !canCurrentSidePlay()) return;
  commitMove(move, state.currentPlayer, { key: "manualMove", values: {} });
  advanceTurn();
}

function commitMove(move, player, note) {
  state.history.push({
    board: cloneBoard(state.board),
    player,
    move: { row: move.row, col: move.col },
    noteKey: note.key,
    noteValues: note.values,
  });
  state.board = applyMove(state.board, move, player);
  state.lastMove = { row: move.row, col: move.col };
  state.lastFlips = move.flips.map(([row, col]) => ({ row, col }));
  scheduleFlipCleanup();
}

function scheduleFlipCleanup() {
  state.flipAnimationId += 1;
  const animationId = state.flipAnimationId;

  window.setTimeout(() => {
    if (animationId !== state.flipAnimationId) return;
    state.lastFlips = [];
  }, FLIP_ANIMATION_MS + 400);
}

function passTurn(player) {
  state.history.push({
    board: cloneBoard(state.board),
    player,
    move: "pass",
    noteKey: "passTurn",
    noteValues: {},
  });
}

function advanceTurn() {
  state.currentPlayer = opponent(state.currentPlayer);
  resolveTurn();
}

function resolveTurn() {
  state.legalMoves = getLegalMoves(state.board, state.currentPlayer);

  if (isTerminal(state.board)) {
    state.gameOver = true;
    state.isThinking = false;
    render();
    return;
  }

  if (state.legalMoves.length === 0) {
    passTurn(state.currentPlayer);
    state.currentPlayer = opponent(state.currentPlayer);
    state.legalMoves = getLegalMoves(state.board, state.currentPlayer);
    if (state.legalMoves.length === 0) {
      state.gameOver = true;
    }
    render();
    if (!state.gameOver && state.mode === "ai" && state.currentPlayer !== state.humanColor) {
      queueAiMove();
    }
    return;
  }

  render();

  if (state.mode === "ai" && state.currentPlayer !== state.humanColor) {
    queueAiMove();
  }
}

function queueAiMove() {
  state.aiTurnId += 1;
  const turnId = state.aiTurnId;
  state.isThinking = true;
  renderHud();

  window.setTimeout(() => {
    if (turnId !== state.aiTurnId || state.gameOver || state.currentPlayer === state.humanColor) {
      return;
    }

    const move = chooseAiMove(state.board, state.currentPlayer, state.aiDepth);
    if (move) {
      commitMove(move, state.currentPlayer, {
        key: "minimaxMove",
        values: { depth: state.aiDepth },
      });
    }
    state.isThinking = false;
    advanceTurn();
  }, AI_MOVE_DELAY_MS);
}

function resetGame() {
  state.board = createInitialBoard();
  state.currentPlayer = BLACK;
  state.mode = modeSelect.value;
  state.language = languageSelect.value;
  state.humanColor = Number(playerColorSelect.value);
  state.aiDepth = Number(difficultySelect.value);
  state.history = [];
  state.lastMove = null;
  state.lastFlips = [];
  state.flipAnimationId += 1;
  state.aiTurnId += 1;
  state.isThinking = false;
  state.gameOver = false;
  render();

  if (state.mode === "ai" && state.currentPlayer !== state.humanColor) {
    queueAiMove();
  }
}

function undoMove() {
  if (state.history.length === 0 || state.isThinking) return;

  const steps = state.mode === "ai" ? Math.min(2, state.history.length) : 1;
  for (let index = 0; index < steps; index += 1) {
    const previous = state.history.pop();
    state.board = previous.board;
    state.currentPlayer = previous.player;
    state.lastMove = null;
    state.lastFlips = [];
    state.flipAnimationId += 1;
    state.aiTurnId += 1;
  }

  state.gameOver = false;
  render();
}

function render() {
  renderBoard();
  renderActivity();
}

function handleLanguageChange() {
  state.language = languageSelect.value;
  render();
}

modeSelect.addEventListener("change", resetGame);
languageSelect.addEventListener("change", handleLanguageChange);
languageSelect.addEventListener("input", handleLanguageChange);
playerColorSelect.addEventListener("change", resetGame);
difficultySelect.addEventListener("change", resetGame);
newGameButton.addEventListener("click", resetGame);
undoButton.addEventListener("click", undoMove);
playAgainButton.addEventListener("click", resetGame);

resetGame();
