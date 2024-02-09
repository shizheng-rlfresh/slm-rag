// place files you want to import through the `$lib` alias in this folder.
import { AutoTokenizer, pipeline } from '@xenova/transformers';

// Create text-generation pipeline
const pipe = await pipeline('text-generation', 'shi-zheng-qxhs/gpt2_oasst2_curated_onnx');
const tokenizer = await AutoTokenizer.from_pretrained('shi-zheng-qxhs/gpt2_oasst2_curated_onnx');

let message = 'Who is the president of the United States?';
message = [
    { content: 'Below is a dialogue between a human user and an AI assistant.', role: 'system' },
    { content: message, role: 'user' },
];
message = tokenizer.apply_chat_template(message, { tokenize: false }) + '<|assistant|>';

const output = await pipe(message);
console.log(output[0].generated_text);

// console.log(message);

// message = tokenizer(message, { return_tensors: 'pt' });
// console.log(message);

// const output = await model.generate(message);
// console.log(output[0].generated_text);

// // Define the prompt and list of messages
// const prompt = 'Give me a short introduction to large language model.';
// const messages = [
//     { role: 'system', content: 'You are a helpful assistant.' },
//     { role: 'user', content: prompt },
// ];

// // Apply chat template
// const text = generator.tokenizer.apply_chat_template(messages, {
//     tokenize: false,
//     add_generation_prompt: true,

// });

// // Generate text
// const output = await generator(text, {
//     max_new_tokens: 128,
//     do_sample: false,
// });
// console.log(output[0].generated_text);
// // 'A large language model is a type of artificial intelligence system that can generate text based on the input provided by users, such as books, articles, or websites. It uses advanced algorithms and techniques to learn from vast amounts of data and improve its performance over time through machine learning and natural language processing (NLP). Large language models have become increasingly popular in recent years due to their ability to handle complex tasks such as generating human-like text quickly and accurately. They have also been used in various fields such as customer service chatbots, virtual assistants, and search engines for information retrieval purposes.'
