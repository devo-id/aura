import React, { useState, useEffect } from "react";
import { Calendar, Clock, EyeOff, Eye } from "lucide-react";
import { fetchRandomMotivationalQuote, type Quote } from "../api/quoteApi";

const LOCAL_STORAGE_KEY = "dailyMotivationalQuote";

const DateTimeWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTodayDateString = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  useEffect(() => {
    const storedDataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDataRaw) {
      try {
        const storedData = JSON.parse(storedDataRaw);
        if (storedData.date === getTodayDateString() && storedData.quote) {
          setQuote(storedData.quote);
          return;
        }
      } catch (error) {
        console.error("Failed to parse stored quote data:", error);
      }
    }
    fetchRandomMotivationalQuote().then((newQuote) => {
      setQuote(newQuote);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ date: getTodayDateString(), quote: newQuote })
      );
    });
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="aura-widget h-fit animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-aura-text-primary">
          Time & Focus
        </h2>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 rounded-lg hover:bg-aura-surface transition-all duration-200 text-aura-text-secondary hover:text-aura-text-primary"
        >
          {isMinimized ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      {!isMinimized && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-aura-accent font-medium animate-fade-in">
              {getGreeting()}
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={20} className="text-aura-accent" />
              <span className="text-aura-text-secondary text-sm">
                Current Time
              </span>
            </div>
            <div
              className="text-4xl font-bold text-aura-text-primary animate-pulse-glow bg-aura-surface/50 rounded-lg py-4 px-6"
              style={{
                fontFamily: "monospace",
                textShadow: "0 0 10px hsl(var(--aura-accent) / 0.3)",
              }}
            >
              {formatTime(currentTime)}
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar size={20} className="text-aura-accent" />
              <span className="text-aura-text-secondary text-sm">
                Today's Date
              </span>
            </div>
            <div className="text-lg text-aura-text-primary font-medium bg-aura-surface/30 rounded-lg py-3 px-4">
              {formatDate(currentTime)}
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-aura-accent/10 via-aura-accent/5 to-aura-accent/10 rounded-lg border border-aura-accent/20">
            <p className="text-sm text-aura-text-secondary italic">
              {quote ? `"${quote.text}"` : "Loading..."}
            </p>
            {quote?.author && (
              <p className="mt-1 text-xs text-aura-text-secondary">
                — {quote.author}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeWidget;
