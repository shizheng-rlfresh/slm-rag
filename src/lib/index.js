// place files you want to import through the `$lib` alias in this folder.
import { AutoTokenizer, pipeline } from '@xenova/transformers';

export async function chatTempalte(userMessage) {
    const tokenizer = await AutoTokenizer.from_pretrained(
        'shi-zheng-qxhs/gpt2_oasst2_curated_onnx'
    );

    const systemContent =
        'Below is a dialogue between a human user and an very helpful AI assistant named CuteChat.\n';

    let message = [
        {
            content: systemContent,
            role: 'system',
        },
        { content: userMessage, role: 'user' },
    ];

    message = tokenizer.apply_chat_template(message, { tokenize: false }) + '<|assistant|>';

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
    // const tokenizer = await AutoTokenizer.from_pretrained(
    //     'shi-zheng-qxhs/gpt2_oasst2_curated_onnx'
    // );

    // const systemContent =
    //     'Below is a dialogue between a human user and an very helpful AI assistant named CuteChat.\n';

    // let message = [
    //     {
    //         content: systemContent,
    //         role: 'system',
    //     },
    //     { content: userMessage, role: 'user' },
    // ];

    // message = tokenizer.apply_chat_template(message, { tokenize: false }) + '<|assistant|>';

    const output = await textGenerationPipeline(message, {
        max_new_tokens: 128,
        penalty_alpha: 0.6,
        top_k: 6,
        eos_token_id: tokenizer.eos_token_id,
        pad_token_id: tokenizer.pad_token_id,
    });

    return output[0].generated_text.replace(userMessage, '').trim();
}

// /**
//  * Generates a response from the AI assistant based on the user's message.
//  *
//  * @param {string} userMessage - The message input by the user
//  * @return {Promise<string>} The generated response from the AI assistant
//  */
// export async function chatGenerate(userMessage) {
//     const textGenerationPipeline = await pipeline(
//         'text-generation',
//         'shi-zheng-qxhs/gpt2_oasst2_curated_onnx'
//     );
//     const tokenizer = await AutoTokenizer.from_pretrained(
//         'shi-zheng-qxhs/gpt2_oasst2_curated_onnx'
//     );

//     const systemContent =
//         'Below is a dialogue between a human user and an very helpful AI assistant named CuteChat.\n';

//     let message = [
//         {
//             content: systemContent,
//             role: 'system',
//         },
//         { content: userMessage, role: 'user' },
//     ];

//     message = tokenizer.apply_chat_template(message, { tokenize: false }) + '<|assistant|>';

//     const output = await textGenerationPipeline(message, {
//         max_new_tokens: 128,
//         penalty_alpha: 0.6,
//         top_k: 6,
//         eos_token_id: tokenizer.eos_token_id,
//         pad_token_id: tokenizer.pad_token_id,
//     });

//     return output[0].generated_text.replace(systemContent, '').replace(userMessage, '').trim();
// }

// chatGenerate('Who is the president of the United States?').then((output) => console.log(output));
// // 'A large language model is a type of artificial intelligence system that can generate text based on the input provided by users, such as books, articles, or websites. It uses advanced algorithms and techniques to learn from vast amounts of data and improve its performance over time through machine learning and natural language processing (NLP). Large language models have become increasingly popular in recent years due to their ability to handle complex tasks such as generating human-like text quickly and accurately. They have also been used in various fields such as customer service chatbots, virtual assistants, and search engines for information retrieval purposes.'
