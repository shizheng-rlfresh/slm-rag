<!-- <script>
    import { chatGenerate } from '$lib/index';

    let userMessage = '';
    let generatedText = '';

    async function generateReponse() {
        if (userMessage) {
            try {
                generatedText = await chatGenerate(userMessage);
                console.log(generatedText);
            } catch (error) {
                console.error('Error: generating response', error);
                generatedText = 'An error occurred while generating the response.';
            }
        }
    }
</script>

<input type="text" bind:value={userMessage} placeholder="Type your message here..." />
<button on:click={generateReponse}>Generate Response</button>

{#if generatedText}
    <p class="generated-response">{generatedText}</p>
{/if} -->
<script>
    import { chatGenerate } from '$lib/index';

    let userInput = '';
    let messages = [];

    async function generateResponse() {
        if (userInput.trim()) {
            const userMessage = { role: 'user', content: userInput };
            messages = [...messages, userMessage];
            try {
                const response = await chatGenerate(userInput);
                messages = [...messages, { role: 'ai', content: response }];
            } catch (error) {
                console.error('Error generating response:', error);
                messages = [...messages, { role: 'ai', content: 'Sorry, something went wrong.' }];
            }
            userInput = ''; // Clear the input after sending the message
        }
    }
</script>

<div class="flex h-screen flex-col">
    <div id="chat-window" class="flex-1 space-y-2 overflow-y-auto p-4">
        {#each messages as message, i (message + i)}
            <div
                class={`max-w-3/4 rounded-lg p-2 ${message.role === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-100 text-gray-800'}`}
            >
                {message.content}
            </div>
        {/each}
    </div>
    <div class="border-t border-gray-200 bg-white p-4">
        <div class="flex space-x-2">
            <input
                type="text"
                placeholder="Type your message here..."
                class="flex-1 rounded-full border p-2 outline-none focus:ring"
                bind:value={userInput}
                on:keydown={(e) => e.key === 'Enter' && generateResponse()}
            />
            <button
                class="rounded-full bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none"
                on:click={generateResponse}
            >
                Send
            </button>
        </div>
    </div>
</div>

<style>
    /* Ensure the chat window scrolls to the bottom on new messages */
    #chat-window {
        scroll-behavior: smooth;
    }
</style>
