import * as banana from "@banana-dev/banana-dev";
import formidable from "formidable";
import { Buffer } from "buffer";

export const config = {
  api: {
    bodyParser: false,
  },
};

console.log("Buffer", Buffer);

const apiKey = process.env.BANANA_API_KEY;
const modelKey = process.env.BANANA_MODEL_KEY;

const toBase64 = (fileBuffer) => {
  const base64data = fileBuffer.toString("base64");
  return base64data;
};

const transcribeAction = async (file) => {
  const base64data = toBase64(file);
  const base64String = base64data.split(",")[1];

  const modelParameters = {
    mp3BytesString: base64String,
  };

  const output = await banana.run(apiKey, modelKey, modelParameters);
  console.log("output");

  return output;
};

const generateAction = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./";
  form.keepExtensions = true;
  let file = null;
  form.parse(req, (err, fields, files) => {
    file = files["audio-file"];
    console.log("file data", file);
    const fileBuffer = Buffer.from(file);
    try {
      const output = transcribeAction(fileBuffer);
      res.status(200).json(output);
    } catch (e) {
      console.log("error", e);
      res.status(500).json({ error: "failed to load data" });
    }
  });
};

export default generateAction;
