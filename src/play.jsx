import { useState } from "react";
const list = [
  {
    image: { url: "/public/audirrs7.jpg" },
    name: "Audi rs7",
  },
  {
    image: { url: "/public/bmwm6.jpg" },
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
    image: { url: "./public/renaultarkana.jpg" },
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

export default function Play({ state }) {
  const [cards, setCards] = useState(() => {
    return shuffledcards(state);
  });

  // how many cards to SHOW each round
  const difficultyDisplayCounts = {
    easy: 3,
    medium: 4,
    hard: 5,
  };

  const normalized = normalizeDifficulty(state);
  const numberOfDisplayedCards = difficultyDisplayCounts[normalized];

  const _final = cards
    .slice(0, numberOfDisplayedCards)
    .map((card) => (
      <Card key={card.Id} url={card.image.url} name={card.name} />
    ));

  return (
    <div className="flex flex-col size-full p-4">
      <div className="flex flex-1 w-full items-center justify-between mb-6">
        <img src="./logoo.png" alt="" className="h-16 md:h-20 object-contain" />
        <Score />
      </div>
      <div className="flex justify-center items-center gap-6 flex-1">
        {_final}
      </div>
    </div>
  );
}

function Card({ url, name }) {
  return (
    <div className="group relative flex flex-col items-center justify-between w-40 sm:w-52 md:w-64 aspect-[3/4] rounded-2xl bg-gradient-to-b from-amber-900/90 to-amber-800/90 border border-amber-700/70 shadow-xl shadow-black/40 overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60">
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
  );
}
function Loading() {
  return <div></div>;
}

function Score() {
  return <div className="mr-0">hi</div>;
}
