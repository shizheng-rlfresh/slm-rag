<script>
    import Deepchat from './chat.svelte';
    import Nav from '$lib/nav.svelte';

    const name = 'PDF RAG Demo';
    const url = '/rag';
</script>

<Nav {name} {url} />
<Deepchat />
