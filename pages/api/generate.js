import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = `
Write a 1,000 word newsletter email base on the following audio transcript.

Me:`;
const generateAction = async (req, res) => {
  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // const secondPrompt = `
  //   Take the response from Jinx below and generate a Letter post written in the style of crazy 16 year old girl and the philosophy of The Joker. Don't mention the Joker. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

  //   Me: ${req.body.userInput}

  //   Jinx: ${basePromptOutput.text}

  //   Letter from Jinx:
  //   `;

  // const secondPromptCompletion = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: `${secondPrompt}`,
  //   temperature: 0.85,
  //   max_tokens: 550,
  // });

  // const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
