const Groq = require("groq-sdk");

console.log(
  "Groq Key Exists:",
  !!process.env.GROQ_API_KEY
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeResume = async (resumeText) => {
  try {
    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `
Analyze this resume.

Provide:
1. Strengths
2. Weaknesses
3. Missing Skills
4. ATS Suggestions

Resume:
${resumeText}
`,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error);

    return "Unable to generate AI feedback.";
  }
};

module.exports = {
  analyzeResume,
};