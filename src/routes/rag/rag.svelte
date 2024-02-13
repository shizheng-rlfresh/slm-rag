<script>
    import { onMount } from 'svelte';
    import { createRetriever, preparePrompt, invoke } from '$lib';

    const args = {
        pdfUrl: './src/lib/assets/part_time_phd.pdf',
        embedModel: 'Xenova/all-MiniLM-L6-v2',
        chunkSize: 1000,
        chunkOverlap: 200,
        llmModel: 'gpt2',
        retrieverK: 3,
    };

    let isLoaded = false;
    let loader;
    let retriever;

    onMount(async () => {
        // Dynamically import deep-chat module
        await import('deep-chat');
        // create retriever
        retriever = await createRetriever(args);
        isLoaded = true;
    });

    const introMessage =
        'Hi, my name is CuteChat. I am a gpt2-small fine-tuned with OASST2 on a NVIDIA Tesla T4 GPU.';

    // Initializing user input variable
    let userMessage;
</script>

<main class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
    <h1
        class="mb-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-4xl font-bold text-transparent"
    >
        RAG Demo
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
                            const text = await retriever.invoke(body.messages[0].text);
                            // console.log(text);
                            let textContent = preparePrompt(body.messages[0].text, text);
                            textContent = await invoke(textContent);
                            console.log(textContent);
                            signals.onResponse({ text: textContent });
                        } catch (e) {
                            // Handling errors
                            console.error(e);
                            signals.onResponse({ text: 'Failed to process pipeline' });
                        }
                    },
                }}
            />
        </div>
    {:else}
        <div class="m-6 text-2xl">Loading</div>
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
