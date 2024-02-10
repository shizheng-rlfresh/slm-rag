<script>
    import { onMount } from 'svelte';
    import { chatTempalte, chatGenerate } from '$lib';

    // Make sure to use onMount and render deep-chat on load
    onMount(async () => {
        await import('deep-chat');
        isLoaded = true;
    });

    let isLoaded = false;
    const introMessage =
        'Hi, my name is CuteChat. I am a gpt2-small fine-tuned with OASST2 on a NVIDIA Tesla T4 GPU.';

    let userMessage;
</script>

<main>
    <h1>CuteChat Demo</h1>
    {#if isLoaded}
        <deep-chat
            demo="true"
            introMessage={{
                text: introMessage,
            }}
            request={{
                handler: async (body, signals) => {
                    try {
                        const text = await chatGenerate(body.messages[0].text);
                        signals.onResponse({ text: text[0].generated_text });
                    } catch (e) {
                        console.error(e);
                        signals.onResponse({ text: 'Failed to process pipeline' });
                    }
                },
            }}
            requestInterceptor={async (request) => {
                userMessage = await chatTempalte(request.body.messages[0].text);
                request.body.messages[0].text = userMessage.encoded_message;
                return request;
            }}
            responseInterceptor={async (response) => {
                response.text = response.text.replace(userMessage.decoded_message, '');
                return response;
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
