require("dotenv").config();

console.log("STARTING TEST");

const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("KEY EXISTS:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

async function test() {
  try {
    console.log("INSIDE TEST");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(
      "Say hello"
    );

    console.log(result.response.text());
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}

test();