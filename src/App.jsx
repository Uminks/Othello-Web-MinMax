import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyMove,
  BLACK,
  chooseAiMove,
  cloneBoard,
  countPieces,
  createInitialBoard,
  EMPTY,
  getLegalMoves,
  isTerminal,
  keyFor,
  opponent,
  SIZE,
  WHITE,
} from "./game.js";
import { createTranslator, translations } from "./i18n.js";

const FLIP_ANIMATION_MS = 760;
const AI_MOVE_DELAY_MS = 1450;

const initialGameState = {
  board: createInitialBoard(),
  currentPlayer: BLACK,
  mode: "ai",
  humanColor: BLACK,
  aiDepth: 3,
  history: [],
  lastMove: null,
  lastFlips: [],
  isThinking: false,
  gameOver: false,
};

export default function App() {
  const [language, setLanguage] = useState("es");
  const [game, setGame] = useState(initialGameState);
  const aiTurnId = useRef(0);
  const t = useMemo(() => createTranslator(language), [language]);

  const legalMoves = useMemo(
    () => getLegalMoves(game.board, game.currentPlayer),
    [game.board, game.currentPlayer],
  );
  const legalMap = useMemo(
    () => new Map(legalMoves.map((move) => [keyFor(move.row, move.col), move])),
    [legalMoves],
  );
  const flippedMap = useMemo(
    () => new Map(game.lastFlips.map((flip, index) => [keyFor(flip.row, flip.col), index])),
    [game.lastFlips],
  );
  const counts = useMemo(() => countPieces(game.board), [game.board]);
  const result = useMemo(() => getGameResult(game, counts, t), [game, counts, t]);
  const canPlay = game.mode === "pvp" || game.currentPlayer === game.humanColor;
  const blackLegal = useMemo(() => getLegalMoves(game.board, BLACK).length, [game.board]);
  const whiteLegal = useMemo(() => getLegalMoves(game.board, WHITE).length, [game.board]);

  useEffect(() => {
    document.documentElement.lang = translations[language].htmlLang;
    document.title = "Othello Minimax";
  }, [language]);

  useEffect(() => {
    if (!game.lastFlips.length) return undefined;
    const timer = window.setTimeout(() => {
      setGame((current) => ({ ...current, lastFlips: [] }));
    }, FLIP_ANIMATION_MS + 420);
    return () => window.clearTimeout(timer);
  }, [game.lastFlips]);

  useEffect(() => {
    if (game.gameOver || game.mode !== "ai" || game.currentPlayer === game.humanColor) return undefined;

    aiTurnId.current += 1;
    const turnId = aiTurnId.current;
    setGame((current) => ({ ...current, isThinking: true }));

    const timer = window.setTimeout(() => {
      setGame((current) => {
        if (
          turnId !== aiTurnId.current ||
          current.gameOver ||
          current.mode !== "ai" ||
          current.currentPlayer === current.humanColor
        ) {
          return current;
        }

        const move = chooseAiMove(current.board, current.currentPlayer, current.aiDepth);
        if (!move) return resolveAfterTurn({ ...current, isThinking: false }, t);

        return resolveAfterTurn(commitMove(current, move, current.currentPlayer, {
          key: "minimaxMove",
          values: { depth: current.aiDepth },
        }), t);
      });
    }, AI_MOVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [game.currentPlayer, game.gameOver, game.humanColor, game.mode, t]);

  function resetGame(next = {}) {
    aiTurnId.current += 1;
    setGame({
      ...initialGameState,
      board: createInitialBoard(),
      mode: next.mode ?? game.mode,
      humanColor: next.humanColor ?? game.humanColor,
      aiDepth: next.aiDepth ?? game.aiDepth,
    });
  }

  function playHumanMove(move) {
    if (!move || game.isThinking || game.gameOver || !canPlay) return;
    setGame((current) => resolveAfterTurn(
      commitMove(current, move, current.currentPlayer, { key: "manualMove", values: {} }),
      t,
    ));
  }

  function undoMove() {
    if (game.history.length === 0 || game.isThinking) return;
    aiTurnId.current += 1;
    const steps = game.mode === "ai" ? Math.min(2, game.history.length) : 1;
    const history = [...game.history];
    let restored = game;

    for (let index = 0; index < steps; index += 1) {
      const previous = history.pop();
      restored = {
        ...restored,
        board: previous.board,
        currentPlayer: previous.player,
        history,
        lastMove: null,
        lastFlips: [],
        isThinking: false,
        gameOver: false,
      };
    }

    setGame(restored);
  }

  function colorName(player) {
    return player === BLACK ? t("black") : t("white");
  }

  const turnLabel = game.gameOver
    ? t("gameOver")
    : game.isThinking
      ? t("aiThinkingTitle")
      : t("turn", { color: colorName(game.currentPlayer) });
  const gameMessage = game.gameOver
    ? `${result.winnerLabel} ${counts.black}-${counts.white}.`
    : game.isThinking
      ? t("thinking")
      : legalMoves.length
        ? t("chooseMove")
        : t("noMoves");

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
        </div>
        <Scoreboard game={game} counts={counts} t={t} />
      </header>

      <section className="game-layout">
        <aside className="control-panel" aria-label="Game controls">
          <StatusCard currentPlayer={game.currentPlayer} label={turnLabel} message={gameMessage} />
          <ControlSelect label={t("language")} value={language} onChange={setLanguage}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </ControlSelect>
          <ControlSelect
            label={t("mode")}
            value={game.mode}
            onChange={(mode) => resetGame({ mode })}
          >
            <option value="ai">{t("modeAi")}</option>
            <option value="pvp">{t("modePvp")}</option>
          </ControlSelect>
          <ControlSelect
            label={t("playerColor")}
            value={String(game.humanColor)}
            disabled={game.mode === "pvp" || game.isThinking}
            onChange={(value) => resetGame({ humanColor: Number(value) })}
          >
            <option value={BLACK}>{t("colorBlack")}</option>
            <option value={WHITE}>{t("colorWhite")}</option>
          </ControlSelect>
          <ControlSelect
            label={t("difficulty")}
            value={String(game.aiDepth)}
            disabled={game.mode === "pvp" || game.isThinking}
            onChange={(value) => resetGame({ aiDepth: Number(value) })}
          >
            <option value="2">{t("difficultyLight")}</option>
            <option value="3">{t("difficultyCompetitive")}</option>
            <option value="4">{t("difficultyDeep")}</option>
            <option value="5">{t("difficultyExpert")}</option>
          </ControlSelect>

          <div className="control-actions">
            <button className="button primary" type="button" onClick={() => resetGame()}>
              {t("newGame")}
            </button>
            <button className="button ghost" type="button" onClick={undoMove} disabled={!game.history.length || game.isThinking}>
              {t("undo")}
            </button>
          </div>

          <div className="metrics">
            <Metric value={blackLegal} label={t("blackMoves")} />
            <Metric value={whiteLegal} label={t("whiteMoves")} />
            <Metric value={counts.empty} label={t("emptyCells")} />
          </div>
        </aside>

        <section className="board-section" aria-label="Othello board">
          <div className="board-frame">
            <div className="board" role="grid" aria-label="8 by 8 board">
              {Array.from({ length: SIZE * SIZE }, (_, index) => {
                const row = Math.floor(index / SIZE);
                const col = index % SIZE;
                const value = game.board[row][col];
                const key = keyFor(row, col);
                const move = legalMap.get(key);
                const isLegal = Boolean(move) && canPlay && !game.gameOver && !game.isThinking;
                const flippedIndex = flippedMap.get(key);
                const isLast = game.lastMove?.row === row && game.lastMove?.col === col;
                return (
                  <BoardCell
                    key={key}
                    value={value}
                    row={row}
                    col={col}
                    legal={isLegal}
                    last={isLast}
                    flippedIndex={flippedIndex}
                    onClick={() => playHumanMove(move)}
                    t={t}
                  />
                );
              })}
            </div>

            <AnimatePresence>
              {game.gameOver && (
                <EndgameOverlay counts={counts} result={result} onRestart={() => resetGame()} t={t} />
              )}
            </AnimatePresence>
          </div>
        </section>

        <aside className="activity-panel" aria-label="Game activity">
          <div className="panel-heading">
            <h2>{t("activity")}</h2>
            <span>{game.mode === "ai" ? t("depth", { depth: game.aiDepth }) : t("pvp")}</span>
          </div>
          <MoveList history={game.history} t={t} colorName={colorName} />
        </aside>
      </section>
    </main>
  );
}

function commitMove(current, move, player, note) {
  return {
    ...current,
    board: applyMove(current.board, move, player),
    currentPlayer: opponent(player),
    history: [
      ...current.history,
      {
        board: cloneBoard(current.board),
        player,
        move: { row: move.row, col: move.col },
        noteKey: note.key,
        noteValues: note.values,
      },
    ],
    lastMove: { row: move.row, col: move.col },
    lastFlips: move.flips.map(([row, col]) => ({ row, col })),
    isThinking: false,
  };
}

function resolveAfterTurn(nextGame) {
  let resolved = { ...nextGame };

  while (!isTerminal(resolved.board)) {
    const moves = getLegalMoves(resolved.board, resolved.currentPlayer);
    if (moves.length > 0) return resolved;
    resolved = {
      ...resolved,
      history: [
        ...resolved.history,
        {
          board: cloneBoard(resolved.board),
          player: resolved.currentPlayer,
          move: "pass",
          noteKey: "passTurn",
          noteValues: {},
        },
      ],
      currentPlayer: opponent(resolved.currentPlayer),
    };
  }

  return { ...resolved, gameOver: true, isThinking: false };
}

function getGameResult(game, counts, t) {
  const winner = counts.black === counts.white ? EMPTY : counts.black > counts.white ? BLACK : WHITE;
  const winnerLabel = winner === EMPTY ? t("tie") : winner === BLACK ? t("winnerBlack") : t("winnerWhite");

  if (winner === EMPTY) {
    return { winner, winnerLabel, title: t("finalTieTitle"), detail: t("tieDetail"), tone: "tie" };
  }

  if (game.mode === "ai") {
    const humanWon = winner === game.humanColor;
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

function Scoreboard({ game, counts, t }) {
  const blackLabel = game.mode === "ai"
    ? game.humanColor === BLACK ? t("you") : t("ai")
    : t("playerOne");
  const whiteLabel = game.mode === "ai"
    ? game.humanColor === WHITE ? t("you") : t("ai")
    : t("playerTwo");

  return (
    <div className="scoreboard">
      <ScoreCard active={game.currentPlayer === BLACK && !game.gameOver} label={blackLabel} score={counts.black} tone="dark" />
      <ScoreCard active={game.currentPlayer === WHITE && !game.gameOver} label={whiteLabel} score={counts.white} tone="light" />
    </div>
  );
}

function ScoreCard({ active, label, score, tone }) {
  return (
    <motion.article layout className={`score-card ${active ? "active" : ""}`}>
      <span className={`disc-mini ${tone}`} />
      <div>
        <small>{label}</small>
        <motion.strong key={score} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {score}
        </motion.strong>
      </div>
    </motion.article>
  );
}

function StatusCard({ currentPlayer, label, message }) {
  return (
    <motion.div className="status-card" layout>
      <span className={`status-dot ${currentPlayer === BLACK ? "dark" : "light"}`} />
      <div>
        <p>{label}</p>
        <strong>{message}</strong>
      </div>
    </motion.div>
  );
}

function ControlSelect({ label, value, onChange, disabled = false, children }) {
  return (
    <label className="control-group">
      <span>{label}</span>
      <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

function Metric({ value, label }) {
  return (
    <div>
      <span>{value}</span>
      <small>{label}</small>
    </div>
  );
}

function BoardCell({ value, row, col, legal, last, flippedIndex, onClick, t }) {
  const coordinate = `${String.fromCharCode(65 + col)}${row + 1}`;
  const label = value === BLACK
    ? `${coordinate}, ${t("blackDisc")}`
    : value === WHITE
      ? `${coordinate}, ${t("whiteDisc")}`
      : legal
        ? `${coordinate}, ${t("validMove")}`
        : `${coordinate}, ${t("emptyCell")}`;

  return (
    <button
      className={`cell ${legal ? "legal" : ""} ${last ? "last-move" : ""}`}
      type="button"
      role="gridcell"
      aria-label={label}
      disabled={!legal}
      onClick={onClick}
    >
      {value !== EMPTY && <Disc value={value} flippedIndex={flippedIndex} />}
      {value === EMPTY && legal && (
        <motion.span className="move-hint" initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />
      )}
    </button>
  );
}

function Disc({ value, flippedIndex }) {
  const color = value === BLACK ? "black" : "white";
  const previousColor = value === BLACK ? "white" : "black";
  const isFlipped = flippedIndex !== undefined;

  if (!isFlipped) {
    return (
      <motion.span
        className={`disc ${color}`}
        initial={{ scale: 0.6, rotateX: 55, opacity: 0 }}
        animate={{ scale: 1, rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.2, 0.9, 0.22, 1] }}
      />
    );
  }

  return (
    <motion.span
      className={`disc disc-3d ${color}`}
      style={{ "--flip-delay": `${Math.min(flippedIndex, 8) * 0.055}s` }}
      initial={{ rotateY: 0, y: 0, scale: 1 }}
      animate={{ rotateY: 180, y: [0, -3, 0], scale: [1, 0.965, 1] }}
      transition={{
        rotateY: { duration: 0.76, delay: Math.min(flippedIndex, 8) * 0.055, ease: [0.2, 0.72, 0.18, 1] },
        y: { duration: 0.76, delay: Math.min(flippedIndex, 8) * 0.055, ease: "easeInOut" },
        scale: { duration: 0.76, delay: Math.min(flippedIndex, 8) * 0.055, ease: "easeInOut" },
      }}
    >
      <span className={`disc-face front ${previousColor}`} />
      <span className={`disc-face back ${color}`} />
    </motion.span>
  );
}

function MoveList({ history, t, colorName }) {
  const recent = history.slice(-12).reverse();
  if (!recent.length) {
    return <ol className="move-list"><li className="empty-activity">{t("ready")}</li></ol>;
  }

  return (
    <ol className="move-list">
      {recent.map((entry, index) => {
        const moveText = entry.move === "pass"
          ? t("passes")
          : `${String.fromCharCode(65 + entry.move.col)}${entry.move.row + 1}`;
        return (
          <motion.li
            key={`${history.length}-${index}-${moveText}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <span className={`disc-mini ${entry.player === BLACK ? "dark" : "light"}`} />
            <div>
              <strong>{colorName(entry.player)} {moveText}</strong>
              <small>{t(entry.noteKey, entry.noteValues)}</small>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

function EndgameOverlay({ counts, result, onRestart, t }) {
  return (
    <motion.div
      className={`endgame-overlay ${result.tone}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="endgame-burst" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => <span key={index} />)}
      </div>
      <motion.div
        className="endgame-card"
        initial={{ y: 22, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.42, ease: [0.18, 0.9, 0.24, 1.1] }}
      >
        <span className="endgame-kicker">{t("result")}</span>
        <strong>{result.title}</strong>
        <p>{result.detail} {t("finalScore", { black: counts.black, white: counts.white })}</p>
        <div className="endgame-score">
          <span>{counts.black}</span>
          <span aria-hidden="true">:</span>
          <span>{counts.white}</span>
        </div>
        <button className="button primary" type="button" onClick={onRestart}>
          {t("newGame")}
        </button>
      </motion.div>
    </motion.div>
  );
}
