import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, EyeOff, Eye } from "lucide-react";

interface Sound {
  id: string;
  name: string;
  url: string;
  playing: boolean;
  volume: number;
}

interface SoundMixerProps {
  onMixerStart?: () => void;
  onMixerPause?: () => void;
  onMixerStop?: () => void;
  externalControl?: {
    shouldPlay: boolean;
    shouldPause: boolean;
    shouldStop: boolean;
  };
}

const SoundMixer: React.FC<SoundMixerProps> = ({
  onMixerStart,
  onMixerPause,
  onMixerStop,
  externalControl,
}) => {
  const [sounds, setSounds] = useState<Sound[]>([
    {
      id: "focus",
      name: "Focus Flow",
      url: "/sounds/focus-flow.mp3",
      playing: false,
      volume: 0.5,
    },
    {
      id: "calm",
      name: "Ethereal Calm",
      url: "/sounds/ethereal-calm.mp3",
      playing: false,
      volume: 0.5,
    },
    {
      id: "forest",
      name: "Midnight Forest",
      url: "/sounds/midnight-forest.mp3",
      playing: false,
      volume: 0.5,
    },
    {
      id: "caves",
      name: "Caves of Dawn",
      url: "/sounds/caves-of-dawn.mp3",
      playing: false,
      volume: 0.5,
    },
  ]);

  const [isMinimized, setIsMinimized] = useState(false);

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const isAnyPlaying = sounds.some((sound) => sound.playing);

  useEffect(() => {
    sounds.forEach((sound) => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = sound.volume;
        audioRefs.current[sound.id] = audio;
      }
    });
  }, [sounds]);

  useEffect(() => {
    if (!externalControl) return;

    if (externalControl.shouldPlay && !isAnyPlaying) {
      const soundToPlay = sounds.find((s) => s.playing) || sounds[0];
      toggleSound(soundToPlay.id);
    } else if (externalControl.shouldPause && isAnyPlaying) {
      pauseAllSounds();
    } else if (externalControl.shouldStop && isAnyPlaying) {
      stopAllSounds();
    }
  }, [externalControl]);

  const toggleSound = (soundId: string) => {
    setSounds((prev) =>
      prev.map((sound) => {
        if (sound.id === soundId) {
          const newPlaying = !sound.playing;
          const audio = audioRefs.current[soundId];

          if (audio) {
            if (newPlaying) {
              audio
                .play()
                .catch((e) => console.log("Could not play audio:", e));
              if (onMixerStart && !isAnyPlaying) onMixerStart();
            } else {
              audio.pause();
              if (onMixerPause && sounds.filter((s) => s.playing).length === 1)
                onMixerPause();
            }
          }

          return { ...sound, playing: newPlaying };
        }
        return sound;
      })
    );
  };

  const updateVolume = (soundId: string, volume: number) => {
    setSounds((prev) =>
      prev.map((sound) => {
        if (sound.id === soundId) {
          const audio = audioRefs.current[soundId];
          if (audio) {
            audio.volume = volume;
          }
          return { ...sound, volume };
        }
        return sound;
      })
    );
  };

  const pauseAllSounds = () => {
    setSounds((prev) =>
      prev.map((sound) => {
        if (sound.playing) {
          const audio = audioRefs.current[sound.id];
          if (audio) audio.pause();
        }
        return { ...sound, playing: false };
      })
    );
    if (onMixerPause) onMixerPause();
  };

  const stopAllSounds = () => {
    setSounds((prev) =>
      prev.map((sound) => {
        const audio = audioRefs.current[sound.id];
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        return { ...sound, playing: false };
      })
    );
    if (onMixerStop) onMixerStop();
  };

  return (
    <div className="aura-widget animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-aura-text-primary">
          Ambient Sounds
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg hover:bg-aura-surface transition-all duration-200 text-aura-text-secondary hover:text-aura-text-primary"
          >
            {isMinimized ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div>
          <div className="flex items-center justify-between mb-4">
            {isAnyPlaying && (
              <div className="flex gap-2">
                <button
                  onClick={pauseAllSounds}
                  className="
                  px-3 py-1 text-xs rounded-md
                  border border-aura-glass-border
                  text-aura-text-secondary hover:text-aura-text-primary
                  hover:border-aura-accent/30
                  transition-all duration-200
                "
                >
                  Pause All
                </button>
                <button
                  onClick={stopAllSounds}
                  className="
                  px-3 py-1 text-xs rounded-md
                  border border-aura-glass-border
                  text-aura-text-secondary hover:text-aura-text-primary
                  hover:border-aura-accent/30
                  transition-all duration-200
                "
                >
                  Stop All
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {sounds.map((sound) => (
              <div
                key={sound.id}
                className="
              flex items-center gap-4 p-4 rounded-lg
              bg-aura-surface border border-aura-glass-border
              hover:border-aura-accent/30
              transition-all duration-200
            "
              >
                {/* Play/Pause button */}
                <button
                  onClick={() => toggleSound(sound.id)}
                  className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-200
                ${
                  sound.playing
                    ? "bg-aura-accent text-aura-text-primary hover:bg-aura-accent-light"
                    : "bg-aura-surface border border-aura-glass-border hover:border-aura-accent"
                }
              `}
                >
                  {sound.playing ? <Pause size={16} /> : <Play size={16} />}
                </button>

                {/* Sound name */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-aura-text-primary">
                    {sound.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Volume2 size={12} className="text-aura-text-secondary" />
                    <span className="text-xs text-aura-text-secondary">
                      {Math.round(sound.volume * 100)}%
                    </span>
                  </div>
                </div>

                {/* Volume slider */}
                <div className="flex items-center gap-2">
                  <Slider
                    defaultValue={[sound.volume]}
                    max={1}
                    step={0.01}
                    className="w-24"
                    onValueChange={(value) => updateVolume(sound.id, value[0])}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Status indicator */}
          <div className="mt-6 text-center">
            <div
              className={`
          inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs
          ${
            isAnyPlaying
              ? "bg-aura-accent/20 text-aura-accent border border-aura-accent/30"
              : "bg-aura-surface text-aura-text-secondary border border-aura-glass-border"
          }
        `}
            >
              <div
                className={`
            w-2 h-2 rounded-full
            ${
              isAnyPlaying
                ? "bg-aura-accent animate-pulse"
                : "bg-aura-text-secondary"
            }
          `}
              />
              {isAnyPlaying ? "Playing ambient mix" : "All sounds stopped"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundMixer;
