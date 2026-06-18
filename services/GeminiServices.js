const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const analyzeResume = async (resumeText) => {
  const prompt = `
Analyze this resume.

Give:
1. Strengths
2. Weaknesses
3. Missing Skills
4. ATS Suggestions

Resume:
${resumeText}
`;

  const result = await model.generateContent(
    prompt
  );

  return result.response.text();
};

module.exports = {
  analyzeResume,
};
console.log(process.env.GEMINI_API_KEY);