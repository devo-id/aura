import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, EyeOff, Eye } from "lucide-react";

interface PomodoroTimerProps {
  onTimerStart?: () => void;
  onTimerPause?: () => void;
  onTimerStop?: () => void;
  isAudioSyncEnabled?: boolean;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onTimerStart,
  onTimerPause,
  onTimerStop,
  isAudioSyncEnabled = false,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<"Focus" | "Break">("Focus");
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isMinimized, setIsMinimized] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chimeRef.current = new Audio("/sounds/chime.mp3");
  }, []);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  const handleSessionComplete = () => {
    if (chimeRef.current) {
      chimeRef.current
        .play()
        .catch((e) => console.log("Could not play chime:", e));
    }

    const newSessionType = sessionType === "Focus" ? "Break" : "Focus";
    const newTime = newSessionType === "Focus" ? 25 * 60 : 5 * 60;

    setSessionType(newSessionType);
    setTimeRemaining(newTime);
    setInitialTime(newTime);
    setIsActive(false);

    document.title =
      newSessionType === "Break"
        ? "Time for a break! - Aura"
        : "Focus time! - Aura";

    if (isAudioSyncEnabled && onTimerStop) {
      onTimerStop();
    }
  };

  const startTimer = () => {
    setIsActive(true);
    if (isAudioSyncEnabled && onTimerStart) {
      onTimerStart();
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
    if (isAudioSyncEnabled && onTimerPause) {
      onTimerPause();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    const resetTime = sessionType === "Focus" ? 25 * 60 : 5 * 60;
    setTimeRemaining(resetTime);
    setInitialTime(resetTime);
    document.title = "Aura - Focus Dashboard";

    if (isAudioSyncEnabled && onTimerStop) {
      onTimerStop();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = ((initialTime - timeRemaining) / initialTime) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="aura-widget text-center animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-aura-text-primary">
          {sessionType} Session
        </h2>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 rounded-lg hover:bg-aura-surface transition-all duration-200 text-aura-text-secondary hover:text-aura-text-primary"
        >
          {isMinimized ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      {!isMinimized && (
        <div>
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="hsl(var(--aura-surface))"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={
                  sessionType === "Break"
                    ? "hsl(var(--aura-accent-light))"
                    : "hsl(var(--aura-accent))"
                }
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`
            text-center p-6 rounded-full
            ${
              sessionType === "Break"
                ? "bg-aura-accent-light/10 border border-aura-accent-light/20"
                : "bg-aura-accent/10 border border-aura-accent/20"
            }
          `}
              >
                <div
                  className={`
              text-4xl font-bold font-mono tracking-wider
              ${
                sessionType === "Break"
                  ? "text-aura-accent-light"
                  : "text-aura-accent"
              }
            `}
                >
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-aura-text-secondary mt-1 uppercase tracking-wide">
                  {sessionType}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={isActive ? pauseTimer : startTimer}
              className="aura-button px-6 py-3 flex items-center gap-2"
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              {isActive ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="
            px-6 py-3 flex items-center gap-2 rounded-lg
            border border-aura-glass-border
            text-aura-text-secondary hover:text-aura-text-primary
            hover:border-aura-accent/30
            transition-all duration-200
          "
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
          <div className="mt-6 text-xs text-aura-text-secondary">
            <p>Focus: 25 min • Break: 5 min</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
