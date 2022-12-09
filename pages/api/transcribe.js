import * as banana from "@banana-dev/banana-dev";

const apiKey = process.env.BANANA_API_KEY;
const modelKey = process.env.BANANA_MODEL_KEY;

const transcribeAction = async (req, res) => {
  console.log(`req.body`, req.body);
  const modelParameters = {
    mp3BytesString: req.body.audio,
  };

  const output = await banana.run(apiKey, modelKey, modelParameters);

  res.status(200).json(output);
};

export default transcribeAction;
