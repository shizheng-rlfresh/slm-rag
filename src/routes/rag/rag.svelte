<script>
    import { onMount } from 'svelte';
    import { createRetriever, preparePrompt, invoke } from '$lib';

    const args = {
        embedModel: 'Xenova/all-MiniLM-L6-v2',
        chunkSize: 1000,
        chunkOverlap: 200,
        retrieverK: 3,
        max_new_tokens: 128,
        do_sample: false,
    };

    let isLoaded = false;
    let retriever;
    let chatFlag = false;
    let placeHolder = 'Upload PDF file 👉';

    onMount(async () => {
        // Dynamically import deep-chat module
        await import('deep-chat');
        // create retriever
        // retriever = await createRetriever(args);
        isLoaded = true;
    });

    const introMessage =
        'Hi, my name is Qwen1.5. I am a 0.5B pretrained model available through Xenova/Qwen1.5-0.5B-Chat.\nI could be a bit slow...';
</script>

<main class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
    <h1
        class="mb-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-4xl font-bold text-transparent"
    >
        PDF RAG Demo
    </h1>
    <!-- <PdfViewer url={args.pdfUrl} /> -->
    {#if isLoaded}
        <div class="-mx-4 w-full max-w-md rounded-lg bg-white shadow-md">
            <deep-chat
                demo="true"
                introMessage={{
                    text: introMessage,
                }}
                mixedFiles={{ files: { maxNumberOfFiles: 1, acceptedFormats: '.pdf' } }}
                request={{
                    handler: async (body, signals) => {
                        try {
                            if (body instanceof FormData) {
                                if (body.get('error')) {
                                    throw new Error(body.get('error'));
                                }
                                const file = body.get('files');
                                signals.onResponse({
                                    text: `${file.name} was just uploaded! Retriever is ready!\n`,
                                });
                            } else if (body.messages[0].text instanceof Error) {
                                throw new Error(body.messages[0].text);
                            } else {
                                signals.onResponse({ text: body.messages[0].text });
                            }
                        } catch (error) {
                            // Handling errors
                            signals.onResponse({
                                text: `Failed to process pipeline. ${error}`,
                            });
                        }
                    },
                }}
                requestInterceptor={async (request) => {
                    try {
                        if (request.body instanceof FormData) {
                            retriever = await createRetriever(request.body.get('files'), args);
                            if (retriever instanceof Error) {
                                request.body.append('error', retriever);
                                return request;
                            }
                            placeHolder = 'Start asking question or upload new file 👉';
                            chatFlag = false;
                        } else if (request.body.messages && retriever) {
                            const context = await retriever.invoke(request.body.messages[0].text);
                            request.body.messages[0].text = preparePrompt(
                                request.body.messages[0].text,
                                context
                            );
                            chatFlag = true;
                        } else {
                            request.body.messages[0].text =
                                "I don't have context to answer you yet. Please upload your PDF file.";
                        }
                    } catch (error) {
                        request.body.messages[0].text = new Error(
                            'Error request interceptor: ' + error
                        );
                    }
                    return request;
                }}
                responseInterceptor={async (response) => {
                    try {
                        if (chatFlag) {
                            const result = await invoke(response.text, args);
                            if (result instanceof Error) {
                                response.text = result;
                                return response;
                            }
                            response.text = result;
                        }
                    } catch (error) {
                        response.text = new Error('Error response interceptor: ' + error);
                    }
                    return response;
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
