<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import { chatTempalte, chatGenerate } from '$lib';
    import { DeepChat } from 'deep-chat';
    // import { DeepChat } from 'deep-chat';
    // Make sure to use onMount and render deep-chat on load
    onMount(async () => {
        await import('deep-chat');
        isLoaded = true;
    });

    let isLoaded = false;

    // const initialMessages = [{ content: introMessage, role: 'assistant' }];

    const dispatch = createEventDispatcher();
    const dispatchNewMessage = (event) => {
        dispatch('new-message', event);
    };

    let userMessage = '';
</script>

<main>
    <h1>Deep Chat</h1>
    {#if isLoaded}
        <!-- demo/textInput are examples of passing an object directly into a property -->
        <!-- initialMessages is an example of passing an object from script into a property -->
        <deep-chat
            on:new-message={dispatchNewMessage}
            demo="true"
            introMessage={{
                text: 'Hi, my name is CuteChat. I am a fine-tuned gpt2-small on OASST2 with a NVIDIA Tesla T4 GPU.',
            }}
            directConnection={{
                huggingFace: {
                    key: '',
                    textGeneration: {
                        model: 'shi-zheng-qxhs/gpt2_oasst2_curated',
                        parameters: {
                            max_new_tokens: 128,
                            penalty_alpha: 0.6,
                            top_k: 6,
                            eos_token_id: 50256,
                            pad_token_id: 50256,
                        },
                    },
                },
            }}
            requestInterceptor={async (details) => {
                details.body.inputs = await chatTempalte(details.body.inputs);
                userMessage = details.body.inputs;
                return details;
            }}
            responseInterceptor={async (details) => {
                details[0].generated_text = details[0].generated_text
                    .replace(userMessage, '')
                    .trim();
                return details;
            }}
        />
    {/if}
</main>

<style>
    main {
        font-family: sans-serif;
        text-align: center;
        justify-content: center;
        display: grid;
    }
</style>
