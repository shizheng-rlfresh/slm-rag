import { pipeline } from '@xenova/transformers';

/**
 * Prepares a prompt by combining a question and context.
 *
 * @param {string} question - the question to be included in the prompt
 * @param {Array} context - the context to be included in the prompt
 * @return {string} the prepared prompt
 */
export function preparePrompt(question, context) {
    let prompt = question + '\nPlease answer the question based on the following context:\n';
    for (let i = 0; i < context.length; i++) {
        prompt += `${context[i].pageContent}\n`;
    }
    return prompt;
}

/**
 * Asynchronously invokes a model to generate text based on the provided prompt and arguments.
 *
 * @param {string} prompt - The prompt for generating the text.
 * @param {Object} args - The arguments object containing model name, pipeline, max new tokens, and do sample flag.
 * @return {string} The generated text based on the prompt and arguments.
 */
export async function invoke(prompt, args) {
    const model = args?.modelName || 'Xenova/Qwen1.5-0.5B-Chat';
    const pipe = args?.pipeline || 'text-generation';
    const maxNewToken = args?.max_new_tokens || 128;
    const doSample = args?.do_sample || false;

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

    return output[0].generated_text.split('assistant\n').pop();
}
