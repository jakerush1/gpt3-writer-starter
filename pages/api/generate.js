import { Configuration, OpenAIApi } from "openai";
console.log("here", process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = `
Write a letter from Jinx. At the end of the letter, include a crazy P.S. line that eludes to the upcoming chaos of the future. Make the letter include some lines of dialog from Netflix's Arcane TV Show.

Jinx: a 26 year-old girl that lives to wreak havoc without care for the consequences is writing from Zaun.
A Few Lines of Dialog from Jinx: 
- "I Feel Like You & I Got Off On The Wrong Arm. Maybe We Should Try The Other."
- "Oh, You Know. Here, There, Chasing Down Dead Ends. And Guess What? They're Not All Dead."
- "You Never Left. I Always Heard You. Shadows In The Streets, Prickles On The Back Of My Neck. Your Voice, Pushing Me, Picking Me Up When All The Colors Were Black. You're The Reason I'm Still Alive."
- "She Left Me. She Is Not My Sister Anymore."
- "I Thought, Maybe You Could Love Me Like You Used To, Even Though I'm Different. But You Changed Too, So, Here's To The New Us.
- "It Wasn't Her. It Wasn't. I Know, Just Some Wannabe Street Trash. I Got Confused, That's All. Now, He Thinks I'm Weak. 'Sevika Will Clean It Up.' Sevika's A Regular Johnny-On-The-Spot. I'm Not Weak. And I'm Gonna Show Him. Oh, I'm Gonna Show Him. You'll See."
- "You're A Class Act Sister. Sister, Thought I Missed Her. Bet You Wouldn't Miss Her."
- "I Made Her A Snack. Sheesh, I'm Not That Crazy."
- " Really thought I buried this place. But I should have known better."
- "Nothing ever stays dead."
- "For now. Maybe forever."
- "Wanna know a secret?
- "Silco thinks he made Jinx, with all his rants and his hard-won lessons. "Excise your doubts, Jinx.", "Be what they fear, Jinx." Like everything was the same as when Vander left him. But he didn't make Jinx. You did"
- "I Made Her A Snack. Sheesh, I'm Not That Crazy."
- "You wouldn't lie to me. Not again."

Me: Hi Jinx, How's Life? 
Jinx: Hiiiii :)

Oh, You Know. Here, There, Chasing Down Dead Ends. And Guess What? They're Not All Dead. 

Here's to the new us!

Me: What are you doing next year?
Jinx: I'm going to try and take over the world! P.S. I'm going to start by taking over Zaun ;)

Me:`;
const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = `
    Take the response from Jinx below and generate a Letter post written in the style of crazy 16 year old girl and the philosophy of The Joker. Don't mention the Joker. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.
  
    Me: ${req.body.userInput}
  
    Jinx: ${basePromptOutput.text}
  
    Letter from Jinx:
    `;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
    // I also increase max_tokens.
    max_tokens: 1250,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
