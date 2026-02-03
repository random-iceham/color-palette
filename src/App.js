import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function getRandomColor() {
  // Generate random hex color
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}
//https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
function hsvToHex(h, s, v) {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r, g, b;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return (
    "#" +
    [r, g, b]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

const golden_ratio = 0.618033988749895;
let hue = Math.random();

function goldenColor() {
  hue = (hue + golden_ratio) % 1;
  return hsvToHex(hue, 0.6, 0.95);
}

function pastelColor() {
  return hsvToHex(Math.random(), 0.3, 0.95);
}

function monochromeColor() {
  const baseHue = Math.random();
  return Array(5)
    .fill()
    .map((_, i) => hsvToHex(baseHue, 0.2, 0.4 + i * 0.12));
}

function App() {
  const [colors, setColors] = useState(Array(5).fill().map(getRandomColor));
  const generatePalette = () => {
    setColors(Array(5).fill().map(getRandomColor));
  };
  const [mode, setMode] = useState("random");
  const modes = [
    ["random", "Random", "Completely random colors"],
    [
      "golden",
      "Distinct",
      "Colors spaced evenly according to the golden ratio",
    ],
    ["pastel", "Pastel", "Soft, muted colors"],
    ["mono", "Monochrome", "Shades of a single color"],
  ];
  const [desc, setDesc] = useState(modes.find(([key]) => key === mode)[2]);
  const [copied, setCopied] = useState("");

  function generateRandomPalette(selectedMode = mode) {
    let newColors;

    switch (selectedMode) {
      case "golden":
        newColors = Array(5).fill().map(goldenColor);
        break;
      case "pastel":
        newColors = Array(5).fill().map(pastelColor);
        break;
      case "mono":
        newColors = monochromeColor();
        break;
      default:
        newColors = Array(5).fill().map(getRandomColor);
    }

    setColors(newColors);
    setMode(selectedMode);
  }

  useEffect(() => {
    generatePalette("golden");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-white text-3xl font-bold mb-6">
        Color Palette Generator
      </h1>
      <div className="flex flex-col items-center mb-6">
        {/* Buttons row */}
        <div className="flex gap-3 mb-2">
          {modes.map(([key, label, desc]) => (
            <button
              key={key}
              onClick={() => {
                generateRandomPalette(key);
                setDesc(desc);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium
          ${
            mode === key
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }
        `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Description below */}
        {desc && <p className="text-gray-300 text-sm">{desc}</p>}
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {colors.map((color, idx) => (
          <div
            key={idx}
            className="w-32 h-32 rounded-xl flex flex-col justify-end items-center shadow-lg cursor-pointer relative"
            style={{ backgroundColor: color }}
            onClick={() => {
              navigator.clipboard.writeText(color);
              setCopied(color);
              setTimeout(() => setCopied(""), 1500);
            }}
          >
            <p className="bg-black/50 text-white px-2 py-1 rounded text-sm">
              {color}
            </p>
            {copied === color && (
              <span className="absolute top-2 text-xs text-white bg-black/70 px-2 py-1 rounded">
                Copied!
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
