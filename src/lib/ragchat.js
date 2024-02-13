import { pipeline } from '@xenova/transformers';

export function preparePrompt(question, context) {
    let prompt = question + '\nPlease answer the question based on the following context:\n';
    for (let i = 0; i < context.length; i++) {
        prompt += `${context[i].pageContent}\n`;
    }
    return prompt;
}

export async function invoke(prompt, args) {
    const model = args?.modelName || 'Xenova/Qwen1.5-0.5B-Chat';
    const pipe = args?.pipeline || 'text-generation';
    const maxNewToken = args?.max_new_tokens || 40;
    const doSample = args?.do_sample || false;
    console.log(model);
    console.log(pipe);

    const message = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
    ];

    const generator = await pipeline(pipe, model);

    const text = generator.tokenizer.apply_chat_template(message, {
        tokenize: false,
        add_generation_prompt: true,
    });

    const output = await generator(text, {
        max_new_tokens: maxNewToken,
        do_sample: doSample,
        return_full_text: false,
    });

    return output;
}

// const generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat');

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
// 'A large language model is a type of artificial intelligence system that can generate text based on the input provided by users, such as books, articles, or websites. It uses advanced algorithms and techniques to learn from vast amounts of data and improve its performance over time through machine learning and natural language processing (NLP). Large language models have become increasingly popular in recent years due to their ability to handle complex tasks such as generating human-like text quickly and accurately. They have also been used in various fields such as customer service chatbots, virtual assistants, and search engines for information retrieval purposes.'
