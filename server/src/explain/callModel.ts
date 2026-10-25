// The one place Blueprint talks to Claude. Written for you; you don't need to change it.
// Send it a prompt, get Claude's text reply back. It throws if anything goes wrong.

import Anthropic from "@anthropic-ai/sdk";

export type CallModel = (prompt: string) => Promise<string>;

const MODEL = "claude-opus-5-5";

export const callModel: CallModel = async (prompt) => {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  // AUDIT: 15s cap so a slow API call can't stall the demo; explainConflict falls back on timeout.
  const response = await client.beta.messages.create(
    {
      model: MODEL,
      max_tokens: 2000,
      // Low effort: this is a short rewrite, and the demo audience is waiting on it.
      output_config: { effort: "low" },
      // If a safety classifier declines, retry on a fallback model inside the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages: [{ role: "user", content: prompt }],
    },
    { timeout: 15_000, maxRetries: 1 },
  );

  if (response.stop_reason === "refusal") throw new Error("Claude declined the request");
  const text = response.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("");
  if (!text) throw new Error("Claude returned no text");
  return text;
};
