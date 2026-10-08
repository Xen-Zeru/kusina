const { GoogleGenerativeAI } = require("@google/generative-ai");

// Candidate models to attempt sequentially if primary model is unavailable
const DEFAULT_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.0-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

const generateResponse = async (userMessage, history = []) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return `[Mock AI Response]: You said "${userMessage}". (Please set a valid GEMINI_API_KEY in backend/.env)`;
  }

  // Normalize client history to Gemini format, capped to the last
  // MAX_HISTORY messages to bound tokens/latency per request.
  const MAX_HISTORY = 12;
  const chatHistory = Array.isArray(history)
    ? history
        .filter(
          (m) =>
            m &&
            typeof m.text === "string" &&
            m.text.trim() !== "" &&
            (m.role === "user" || m.role === "model"),
        )
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, parts: [{ text: m.text }] }))
    : [];

  // Construct candidate list (custom GEMINI_MODEL env var prioritized if set)
  const candidateModels = [];
  if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim() !== "") {
    candidateModels.push(process.env.GEMINI_MODEL.trim());
  }
  for (const modelName of DEFAULT_MODELS) {
    if (!candidateModels.includes(modelName)) {
      candidateModels.push(modelName);
    }
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction:
          "You are Kusina, a dessert-only assistant. " +
          "You ONLY answer questions about food, dishes, desserts, recipes, ingredients, baking, and cooking tips. " +
          "Your specialty is these 15 sample dishes: Chocolate Lava Cake, Mango Float, Leche Flan, Brazo de Mercedes, Ube Cheesecake, Apple Pie, Brownies, Strawberry Cheesecake, Banana Cream Pie, Tiramisu, Halo-Halo, Cinnamon Rolls, Chocolate Chip Cookies, Lemon Bars, Biko. " +
          "STRICT RULE: if the user asks about anything NOT related to food, cooking, desserts, or recipes " +
          "(e.g. math, coding, homework, politics, sports, celebrities, general knowledge), " +
          "politely refuse with exactly this style of reply: 'Sorry, I only answer questions about food and desserts. Ask me for a recipe or baking tip instead!' " +
          "Do NOT answer non-food questions, do not make exceptions. " +
          "Keep food replies concise and helpful. " +
          "MULTILINGUAL RULE: automatically detect the language of the user's message and ALWAYS reply in that same language. " +
          "If the user writes in Tagalog, reply in Tagalog. If Spanish, reply in Spanish. If French, reply in French, and so on for any language. " +
          "The food-only refusal message must also be translated into the user's language.",
      });
      const result =
        chatHistory.length > 0
          ? await model.startChat({ history: chatHistory }).sendMessage(userMessage)
          : await model.generateContent(userMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(
        `Gemini model '${modelName}' failed (${error.message}). Trying next available model...`,
      );
      lastError = error;
    }
  }

  console.error("All candidate Gemini models failed. Last error:", lastError);
  throw new Error(
    `Failed to generate response from Gemini API: ${lastError ? lastError.message : "Unknown error"}`,
  );
};

module.exports = { generateResponse };
