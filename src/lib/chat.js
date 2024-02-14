// place files you want to import through the `$lib` alias in this folder.
import { AutoTokenizer, pipeline } from '@xenova/transformers';

const systemContent =
    'Below is a dialogue between a human user and an very helpful AI assistant named CuteChat.\n';

const message = {
    encoded_message: '',
    decoded_message: '',
};

/**
 * Preprocesses a user message and returns an array of objects containing system and user content.
 *
 * @param {string} userMessage - The message to be preprocessed
 * @return {Array} Array of objects containing system and user content
 */
function messagePreprocess(userMessage) {
    return [
        {
            content: systemContent,
            role: 'system',
        },
        { content: userMessage, role: 'user' },
    ];
}

/**
 * Reverts chat template by removing special placeholders.
 *
 * @param {string} userMessage - The user's message with placeholders
 * @return {string} The reverted chat template
 */
function revertChatTemplate(userMessage) {
    return userMessage
        .replaceAll('<|assistant|>', '')
        .replaceAll('<|user|>', '')
        .replaceAll('<|endoftext|>', '')
        .replaceAll('<|system|>', '')
        .replaceAll('<|end|>\n', '\n');
}

/**
 * Function to process user message, apply chat template, and decode the message.
 *
 * @param {string} userMessage - the message input by the user
 * @return {object} the processed message object
 */
export async function chatTempalte(userMessage) {
    const tokenizer = await AutoTokenizer.from_pretrained(
        'shi-zheng-qxhs/gpt2_oasst2_curated_onnx'
    );

    message.encoded_message = messagePreprocess(userMessage);

    message.encoded_message =
        tokenizer.apply_chat_template(message.encoded_message, { tokenize: false }) +
        '<|assistant|>';

    message.decoded_message = revertChatTemplate(message.encoded_message);

    return message;
}

/**
 * Generates a response from the AI assistant based on the user's message.
 *
 * @param {string} userMessage - The message input by the user
 * @return {Promise<string>} The generated response from the AI assistant
 */
export async function chatGenerate(userMessage) {
    const textGenerationPipeline = await pipeline(
        'text-generation',
        'shi-zheng-qxhs/gpt2_oasst2_curated_onnx'
    );

    const output = await textGenerationPipeline(userMessage, {
        max_new_tokens: 128,
        penalty_alpha: 0.6,
        top_k: 6,
        eos_token_id: 50256,
        pad_token_id: 50256,
    });

    return output;
}
