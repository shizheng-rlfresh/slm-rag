<script>
    import { prepareDocs } from '$lib/vectorstore';
    // import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';

    const url = './src/lib/assets/part_time_phd.pdf';

    prepareDocs(url).then((docs) => {
        console.log(docs);
    });

    // (async () => {
    //     const response = await fetch(url);
    //     const blob = await response.blob();

    //     const loader = new WebPDFLoader(blob);
    //     const docs = await loader.load();
    //     console.log({ docs });
    // })();

    // console.log({ docs });

    // prepareDocs(url).then((docs) => {
    //     console.log(docs);
    // });
</script>

<p>RAG</p>
