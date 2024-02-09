<script>
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

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input type="text" bind:value={userMessage} placeholder="Type your message here..." />
<button on:click={generateReponse}>Generate Response</button>

{#if generatedText}
    <p class="generated-response">{generatedText}</p>
{/if}
