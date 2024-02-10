<script>
    import { chatGenerate } from '$lib/index';
    import Deepchat from './chat2.svelte';
    let deepchat;
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

    function handleMessages(event) {
        console.log(event);
    }
    console.log(deepchat.getMessages());
</script>

<!-- <p>{deepchat.getMessages()}</p> -->
<Deepchat bind:this={deepchat} on:new-message={handleMessages} />
