<script>
    import RAG from './rag.svelte';
    import Nav from '$lib/nav.svelte';

    const name = 'CuteChat Demo';
    const url = '/';
</script>

<Nav {name} {url} />
<RAG />
