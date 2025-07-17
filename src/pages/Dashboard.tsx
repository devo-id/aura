import React, { useState } from "react";
import TodoList from "../components/TodoList";
import PomodoroTimer from "../components/PomodoroTimer";
import SoundMixer from "../components/SoundMixer";
import DateTimeWidget from "../components/DateTimeWidget";
import { Volume2, VolumeX } from "lucide-react";

const Dashboard: React.FC = () => {
  const [isAudioSyncEnabled, setIsAudioSyncEnabled] = useState(false);
  const [audioControl, setAudioControl] = useState({
    shouldPlay: false,
    shouldPause: false,
    shouldStop: false,
  });

  const handleTimerStart = () => {
    if (isAudioSyncEnabled) {
      setAudioControl({
        shouldPlay: true,
        shouldPause: false,
        shouldStop: false,
      });
      setTimeout(() => {
        setAudioControl({
          shouldPlay: false,
          shouldPause: false,
          shouldStop: false,
        });
      }, 100);
    }
  };

  const handleTimerPause = () => {
    if (isAudioSyncEnabled) {
      setAudioControl({
        shouldPlay: false,
        shouldPause: true,
        shouldStop: false,
      });
      setTimeout(() => {
        setAudioControl({
          shouldPlay: false,
          shouldPause: false,
          shouldStop: false,
        });
      }, 100);
    }
  };

  const handleTimerStop = () => {
    if (isAudioSyncEnabled) {
      setAudioControl({
        shouldPlay: false,
        shouldPause: false,
        shouldStop: true,
      });
      setTimeout(() => {
        setAudioControl({
          shouldPlay: false,
          shouldPause: false,
          shouldStop: false,
        });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-aura-background p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-aura-text-primary mb-2">
              Aura
            </h1>
            <p className="text-aura-text-secondary">
              Your focus dashboard for calm productivity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-aura-text-secondary cursor-pointer">
              <span>Sync sound with timer</span>
              <button
                onClick={() => setIsAudioSyncEnabled(!isAudioSyncEnabled)}
                className={`
                  relative w-11 h-6 rounded-full transition-all duration-200
                  ${
                    isAudioSyncEnabled
                      ? "bg-aura-accent"
                      : "bg-aura-surface border border-aura-glass-border"
                  }
                `}
              >
                <div
                  className={`
                  absolute top-0.5 w-5 h-5 bg-aura-text-primary rounded-full
                  transition-transform duration-200 ease-in-out
                  ${isAudioSyncEnabled ? "translate-x-5" : "translate-x-0.5"}
                `}
                />
              </button>
              {isAudioSyncEnabled ? (
                <Volume2 size={16} />
              ) : (
                <VolumeX size={16} />
              )}
            </label>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <DateTimeWidget />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className="lg:col-span-1 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <TodoList />
          </div>
          <div
            className="lg:col-span-1 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <PomodoroTimer
              onTimerStart={handleTimerStart}
              onTimerPause={handleTimerPause}
              onTimerStop={handleTimerStop}
              isAudioSyncEnabled={isAudioSyncEnabled}
            />
          </div>
          <div
            className="lg:col-span-1 animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <SoundMixer
              externalControl={audioControl}
              onMixerStart={() => {}}
              onMixerPause={() => {}}
              onMixerStop={() => {}}
            />
          </div>
        </div>
      </main>
      <footer className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-xs text-aura-text-secondary">
          Built for focused minds. Take breaks, stay hydrated, and be kind to
          yourself.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
