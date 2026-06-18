require("dotenv").config();

const {
  analyzeResume,
} = require("./services/groqService");

async function test() {
  const result =
    await analyzeResume(
      "I know React, Node.js and MongoDB"
    );

  console.log(result);
}

test();