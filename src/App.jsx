import { useState } from "react";
import Play from "./play";
function App() {
  const [state, setstate] = useState("");

  return (
    <>
      {!state && (
        <div className="size-full flex flex-col items-center gap-3 animate-fade-in">
          <div className="animate-logo-bounce">
            <img
              src="/logoo.png"
              alt=""
              className="cursor-pointer"
              onClick={() => setstate("")}
            />
          </div>
          <div className="text-6xl md:text-7xl font-black  tracking-wider text-amber-50 [-webkit-text-stroke:2px_#8B7355] drop-shadow-[5px_5px_0px_rgba(139,115,85,0.7)] [text-shadow:5px_5px_0px_rgba(139,115,85,0.7),10px_10px_20px_rgba(0,0,0,0.3)]">
            Memory Game
          </div>
          <div className="w-full h-[30%]  flex justify-center items-center gap-8">
            <button onClick={() => setstate("Easy")}>Easy</button>
            <button onClick={() => setstate("Meduim")}>Meduim</button>
            <button onClick={() => setstate("Hard")}>Hard</button>
          </div>
        </div>
      )}
      {state && <Play state={state} onBackHome={() => setstate("")} />}
    </>
  );
}

export default App;
