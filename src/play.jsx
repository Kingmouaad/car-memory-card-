import { useState } from "react";
const list = [
  {
    image: { url: "/audirrs7.jpg" },
    name: "Audi rs7",
  },
  {
    image: { url: "/bmwm6.jpg" },
    name: "BMW M6",
  },
  {
    image: { url: "/doblo.jpg" },
    name: "Fiat doblo",
  },
  {
    image: { url: "/duster.jpg" },
    name: "Duster",
  },
  {
    image: { url: "/Geelycoloray.jpg" },
    name: "Geely Coloray",
  },
  {
    image: { url: "/golf.jpg" },
    name: "Golf",
  },
  {
    image: { url: "/Peugeot2008.jpg" },
    name: "Peugeot 2008",
  },
  {
    image: { url: "/polo.jpg" },
    name: "Polo",
  },
  {
    image: { url: "/renaultarkana.jpg" },
    name: "Renault Arkana",
  },
  {
    image: { url: "/tiguen.jpg" },
    name: "tiguen",
  },
];

function normalizeDifficulty(state) {
  const s = String(state).toLowerCase();
  if (s === "easy") return "easy";
  if (s === "hard") return "hard";
  // treat anything else (e.g. "meduim") as medium
  return "medium";
}

function shuffledcards(state) {
  const normalized = normalizeDifficulty(state);

  // how many UNIQUE cards to use in the pool for the whole level
  const difficultyPoolSizes = {
    easy: 5, // pick 5 cards from the list
    medium: 7,
    hard: list.length,
  };

  const poolSize = difficultyPoolSizes[normalized];

  const shuffledCards = list
    .slice(0, poolSize)
    .sort(() => Math.random() - 0.5)
    .map((card) => ({
      ...card,
      Id: crypto.randomUUID(),
    }));

  return shuffledCards;
}

export default function Play({ state, onBackHome }) {
  const [cards, setCards] = useState(() => {
    return shuffledcards(state);
  });
  const [touched, setTouched] = useState([]); // store clicked card Ids
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [status, setStatus] = useState("playing"); // "playing" | "win" | "lose"

  // how many cards to SHOW each round
  const difficultyDisplayCounts = {
    easy: 3,
    medium: 4,
    hard: 5,
  };

  const normalized = normalizeDifficulty(state);
  const numberOfDisplayedCards = difficultyDisplayCounts[normalized];

  const [visibleCards, setVisibleCards] = useState(() =>
    cards.slice(0, numberOfDisplayedCards)
  );

  const [isFlipped, setIsFlipped] = useState(false);

  function resetGame() {
    const freshCards = shuffledcards(state);
    setCards(freshCards);
    setTouched([]);
    setScore(0);
    setStatus("playing");
    setIsFlipped(false);
    setVisibleCards(freshCards.slice(0, numberOfDisplayedCards));
  }

  function getRandomSubset(sourceCards, count) {
    const shuffled = [...sourceCards].sort(() => Math.random() -0.5);
    return shuffled.slice(0, count);
  }

  function handleclick(selected) {
    if (isFlipped || status !== "playing") return;

    const alreadyTouched = touched.includes(selected.Id);

   

    // if card was already clicked before -> immediate lose
    if (alreadyTouched) {
      setStatus("lose");
      return;
    }

    const newTouched = [...touched, selected.Id];
    setTouched(newTouched);

    // if all cards have been clicked exactly once -> win
    const hasWon = cards.every((card) => newTouched.includes(card.Id));
    if (hasWon) {
      setStatus("win");
      return;
    }
     // update score & best score as derived state
     setScore((prev) => {
      const next = prev + 1;
      setBestScore((best) => Math.max(best, next));
      return next;
    });

    // start flip to back (0deg -> 180deg)
    setIsFlipped(true);

    // once the card is on the back side, swap to new cards
    setTimeout(() => {
      setVisibleCards(getRandomSubset(cards, numberOfDisplayedCards));
    }, 500);

    // then flip back to the front to reveal the new cards
    setTimeout(() => {
      setIsFlipped(false);
    }, 520);
  }

  const _final = visibleCards.map((card) => (
    <Card
      onClick={() => handleclick(card)}
      key={card.Id}
      url={card.image.url}
      name={card.name}
      isFlipped={isFlipped}
    />
  ));

 
  

  return (
    <div className="relative flex flex-col size-full p-4 animate-page-in">
      <div className="flex flex-1 items-start mb-6 w-full justify-between gap-4">
        <img
          src="/logoo.png"
          alt="home"
          className="h-[200px] md:h-[300px] cursor-pointer animate-logo-pop"
          onClick={onBackHome}
        />
        <Score score={score} bestScore={bestScore} />
      </div>
      <div className="flex justify-center items-center gap-6 flex-1 animate-cards-in">
        {_final}
      </div>
      {status === "lose" && <Lose onReplay={resetGame} onBackHome={onBackHome} />}
      {status === "win" && <Win onReplay={resetGame} onBackHome={onBackHome} />}
    </div>
  );
}
function Win({ onReplay, onBackHome }){
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
      <div className="h-[50%] w-[50%] max-w-[500px] max-h-[500px] rounded flex flex-col justify-center items-center p-[10px] bg-amber-900/90">
        <img src="/happycar.jpg" alt="win" className="mb-4 max-h-[60%]" />
        <div className="flex w-full max-w-xs gap-3 mt-2">
          <button className="w-1/2" onClick={onReplay}>Replay</button>
          <button className="w-1/2" onClick={onBackHome}>Home</button>
        </div>
      </div>
    </div>
  );
}
function Lose({ onReplay, onBackHome }){
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
      <div className="h-[50%] w-[50%] max-w-[500px] max-h-[500px] rounded flex flex-col justify-center items-center p-[10px] bg-amber-900/90">
        <img src="/sadface.jpg" alt="lose" className="mb-4 max-h-[60%]" />
        <div className="flex w-full max-w-xs gap-7 mt-2 h-[50%] justify-center items-center">
          <button className="w-1/2" onClick={onReplay}>Replay</button>
          <button className="w-1/2" onClick={onBackHome}>Home</button>
        </div>
      </div>
    </div>
  );
}

function Card({ url, name, onClick, isFlipped }) {
  return (
    <div
      onClick={onClick}
      className="card-3d-container w-40 sm:w-52 md:w-64 aspect-[3/4]"
    >
      <div
        className={`card-3d-inner group rounded-2xl border border-amber-700/70 shadow-xl shadow-black/40 overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60 ${
          isFlipped ? " rotate-y-180" : ""
        }`}
      >
        {/* Front face (shows the car) */}
        <div
          className={`card-front flex flex-col items-center justify-between bg-gradient-to-b from-amber-900/90 to-amber-800/90 transition-opacity duration-300 ${
            isFlipped ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff_0,_transparent_60%)] transition-opacity duration-300" />
          <img
            src={url}
            alt={name}
            className="h-3/4 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex items-center justify-center h-1/4 w-full px-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent text-sm sm:text-base font-semibold tracking-wide text-amber-50 backdrop-blur-[2px]">
            <span className="text-center line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {name}
            </span>
          </div>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-400/10 group-hover:ring-amber-300/40 transition-all duration-300 pointer-events-none" />
        </div>

        {/* Back face (empty, just the back of the card) */}
        <div
          className={`card-back flex items-center justify-center transition-opacity duration-300 bg-gradient-to-b from-amber-900 to-amber-800 ${
            isFlipped ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Solid brown back side */}
        </div>
      </div>
    </div>
  );
}
function Loading() {
  return <div></div>;
}

function Score({ score, bestScore }) {
  return (
    <div className="flex items-center flex-col mr-0 text-white font-semibold px-5 py-3 rounded-2xl w-full max-w-xs bg-gradient-to-br from-amber-900/95 via-amber-800/95 to-amber-700/90 shadow-lg shadow-black/60 border border-amber-500/40 backdrop-blur-sm animate-fade-in">
      <div className="mb-1 text-lg tracking-wide">Score: {score}</div>
      <div className="text-sm text-white/80">Best: {bestScore}</div>
    </div>
  );
}
