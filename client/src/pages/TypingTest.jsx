import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

/* ---------------- WORD BANK ---------------- */
const WORDS = {
  easy: ["the", "cat", "dog", "sun", "tree", "book", "run", "home", "water"],
  medium: [
    "typing",
    "practice",
    "accuracy",
    "keyboard",
    "developer",
    "performance",
  ],
  hard: [
    "optimization",
    "architecture",
    "professional",
    "synchronization",
    "implementation",
  ],
};

/* ---------------- RANDOM TEXT ---------------- */
function generateParagraph(level) {
  const sentences = Math.floor(Math.random() * 3) + 3; // 3–5
  let para = [];

  for (let i = 0; i < sentences; i++) {
    const wordsCount = Math.floor(Math.random() * 6) + 6; // 6–12
    let sentence = [];

    for (let j = 0; j < wordsCount; j++) {
      sentence.push(
        WORDS[level][Math.floor(Math.random() * WORDS[level].length)]
      );
    }

    let s = sentence.join(" ");
    para.push(s.charAt(0).toUpperCase() + s.slice(1));
  }

  return para.join(". ") + ".";
}

/* ================= COMPONENT ================= */
export default function TypingTest() {
  const [difficulty, setDifficulty] = useState("easy");
  const [paragraph, setParagraph] = useState(generateParagraph("easy"));
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [input, setInput] = useState("");

  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [completedTexts, setCompletedTexts] = useState(0);

  /* ----------- GLOBAL REFS (CRITICAL) ----------- */
  const testStartRef = useRef(null);
  const totalCharsRef = useRef(0);
  const correctCharsRef = useRef(0);
  const timerRef = useRef(null);

  /* ----------- SPLIT PARAGRAPH ----------- */
  useEffect(() => {
    const split = paragraph
      .split(". ")
      .map((l) => l.trim().endsWith(".") ? l.trim() : l.trim() + ".");
    setLines(split);
    setCurrentLine(0);
    setInput("");
  }, [paragraph]);

  /* ----------- TIMER ----------- */
  useEffect(() => {
    if (!started) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          finishTest();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started]);

  /* ----------- HANDLE INPUT ----------- */
  const handleChange = (e) => {
    const value = e.target.value;

    if (!started) {
      setStarted(true);
      testStartRef.current = Date.now();
    }

    // -------- CHAR COUNT (FIXED) --------
    if (value.length > input.length) {
      const idx = value.length - 1;
      totalCharsRef.current += 1;

      if (value[idx] === lines[currentLine][idx]) {
        correctCharsRef.current += 1;
      }
    }

    setInput(value);

    // -------- WPM (GLOBAL, STABLE) --------
    const elapsedMs = Date.now() - testStartRef.current;
    const elapsedMinutes = Math.max(elapsedMs / 60000, 0.1);

    const calcWpm = Math.round(
      (totalCharsRef.current / 5) / elapsedMinutes
    );
    setWpm(calcWpm);

    // -------- ACCURACY --------
    const acc = Math.round(
      (correctCharsRef.current / totalCharsRef.current) * 100 || 100
    );
    setAccuracy(acc);

    // -------- LAST LINE DONE → NEXT PARAGRAPH --------
    if (
      value.trim() === lines[currentLine] &&
      currentLine === lines.length - 1
    ) {
      setCompletedTexts((c) => c + 1);
      if (timeLeft > 0) {
        setParagraph(generateParagraph(difficulty));
      }
      return;
    }

    // -------- LINE COMPLETE --------
    if (value.trim() === lines[currentLine]) {
      setCurrentLine((c) => c + 1);
      setInput("");
    }
  };

  /* ----------- FINISH TEST ----------- */
  const finishTest = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    await axios.post("http://localhost:5000/score/save", {
      username: user.username,
      wpm,
      accuracy,
      difficulty,
    });

    window.location = "/leaderboard";
  };

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Typing Speed Test</h2>

        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setParagraph(generateParagraph(e.target.value));
          }}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <div style={styles.stats}>
          <span>⏱ {timeLeft}s</span>
          <span>⚡ {wpm} WPM</span>
          <span>🎯 {accuracy}%</span>
          <span>📄 {completedTexts}</span>
        </div>

        <div style={styles.textBox}>
          {lines.map((line, i) => (
            <p key={i}>
              {line.split("").map((c, j) => {
                let color = "black";
                if (i < currentLine) color = "green";
                else if (i === currentLine && j < input.length)
                  color = input[j] === c ? "green" : "red";

                return (
                  <span key={j} style={{ color }}>
                    {c}
                  </span>
                );
              })}
            </p>
          ))}
        </div>

        <textarea
          value={input}
          onChange={handleChange}
          placeholder="Type here..."
          style={styles.textarea}
        />
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    width: 720,
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    background: "#eef2ff",
    padding: 10,
    borderRadius: 8,
    margin: "15px 0",
    fontWeight: "bold",
  },
  textBox: {
    border: "2px solid #333",
    minHeight: 160,
    padding: 15,
    borderRadius: 8,
    background: "#f9f9f9",
    marginBottom: 10,
  },
  textarea: {
    width: "100%",
    height: 80,
    fontSize: 16,
    padding: 10,
    borderRadius: 6,
  },
};
