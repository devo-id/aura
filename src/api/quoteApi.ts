export interface Quote {
  text: string;
  author?: string;
}

export async function fetchRandomMotivationalQuote(): Promise<Quote> {
  try {
    const res = await fetch("https://api.quotable.io/random?tags=motivational");
    if (!res.ok) {
      throw new Error("Failed to fetch quote");
    }
    const data = await res.json();
    return {
      text: data.content,
      author: data.author,
    };
  } catch (error) {
    console.error("Quote API error:", error);
    // Fallback quote
    return {
      text: "Focus on being productive instead of busy.",
      author: undefined,
    };
  }
}
