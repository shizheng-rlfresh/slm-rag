<script>
    // Importing necessary modules
    import { onMount } from 'svelte';
    import { chatTempalte, chatGenerate } from '$lib';

    // Make sure to use onMount and render deep-chat on load
    onMount(async () => {
        // Dynamically import deep-chat module
        await import('deep-chat');
        isLoaded = true;
    });

    // Initializing state variable
    let isLoaded = false;
    // Setting intro message
    const introMessage =
        'Hi, my name is CuteChat. I am a gpt2-small fine-tuned with OASST2 on a NVIDIA Tesla T4 GPU.';

    // Initializing user input variable
    let userMessage;
</script>

<main class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
    <h1
        class="mb-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-4xl font-bold text-transparent"
    >
        CuteChat Demo
    </h1>
    {#if isLoaded}
        <div class="-mx-4 w-full max-w-md rounded-lg bg-white shadow-md">
            <deep-chat
                demo="true"
                introMessage={{
                    text: introMessage,
                }}
                request={{
                    handler: async (body, signals) => {
                        try {
                            // Generating chat response
                            const text = await chatGenerate(body.messages[0].text);
                            signals.onResponse({ text: text[0].generated_text });
                        } catch (e) {
                            // Handling errors
                            console.error(e);
                            signals.onResponse({ text: 'Failed to process pipeline' });
                        }
                    },
                }}
                requestInterceptor={async (request) => {
                    // Intercepting and processing user message
                    userMessage = await chatTempalte(request.body.messages[0].text);
                    request.body.messages[0].text = userMessage.encoded_message;
                    return request;
                }}
                responseInterceptor={async (response) => {
                    // Manipulating response to remove user message from it
                    response.text = response.text.replace(userMessage.decoded_message, '');
                    return response;
                }}
            />
        </div>
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
