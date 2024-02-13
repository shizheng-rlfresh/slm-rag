<script>
    import { onMount } from 'svelte';
    import { createRetriever } from '$lib/loader';

    const args = {
        pdfUrl: './src/lib/assets/part_time_phd.pdf',
        embedModel: 'Xenova/all-MiniLM-L6-v2',
        chunkSize: 1000,
        chunkOverlap: 200,
        llmModel: 'gpt2',
    };

    let isLoaded = false;
    let loader;
    let retriever;

    onMount(async () => {
        // Dynamically import deep-chat module
        await import('deep-chat');
        retriever = await createRetriever(args);
        isLoaded = true;

        // console.log(vectorStore);
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
                            console.log(body.messages[0].text);
                            const text = await retriever.invoke(body.messages[0].text);
                            signals.onResponse({ text: text[0].pageContent });
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
