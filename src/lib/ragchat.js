import { pipeline } from '@xenova/transformers';

/**
 * Prepares a prompt by combining a question and context.
 *
 * @param {string} question - the question to be included in the prompt
 * @param {Array<{ pageContent: string }>} context - the context to be included in the prompt
 * @return {string} the prepared prompt
 */
export function preparePrompt(question, context) {
    // Initialize the prepared prompt with the question and context header
    let preparedPrompt =
        question + '\nPlease answer the question based on the following context:\n';

    // Add each content from the context array to the prepared prompt
    for (let contentIndex = 0; contentIndex < context.length; contentIndex++) {
        preparedPrompt += `${context[contentIndex].pageContent}\n`;
    }

    // Return the prepared prompt
    return preparedPrompt;
}

/**
 * Asynchronously invokes a model to generate text based on the provided prompt and arguments.
 *
 * @param {string} prompt - The prompt for generating the text.
 * @param {Object} args - The arguments object containing model name, pipeline, max new tokens, and do sample flag.
 * @return {Promise<string>} The generated text based on the prompt and arguments.
 */
export async function invoke(prompt, args) {
    try {
        // Set default values for modelName, pipeline, maxNewTokens, and doSample if not provided in args
        const modelName = args?.modelName || 'Xenova/Qwen1.5-0.5B-Chat';
        const pipe = args?.pipe || 'text-generation';
        const maxNewTokens = args?.max_new_tokens || 128;
        const doSample = args?.do_sample || false;

        // Prepare the message for the generator
        const message = [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
        ];

        // Initialize the generator with the specified pipeline and modelName
        const generator = await pipeline(pipe, modelName);

        // Apply chat template to the message
        const text = generator.tokenizer.apply_chat_template(message, {
            tokenize: false,
            add_generation_prompt: true,
        });

        // Generate output text based on the provided message and arguments
        const output = await generator(text, {
            max_new_tokens: maxNewTokens,
            do_sample: doSample,
            return_full_text: false,
        });

        // Return the generated text after removing the assistant's prompt
        return output[0].generated_text.split('assistant\n').pop();
    } catch (error) {
        // Return an error if there is an issue generating the text
        return new Error('generating context: ', error);
    }
}
