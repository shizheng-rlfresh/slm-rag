<script>
    // import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
    // import { onMount } from 'svelte';

    // let pdfjs;
    // let pdfjsWorker;
    // const pdfUrl = './src/lib/assets/part_time_phd.pdf';

    // onMount(async () => {
    //     pdfjs = await import('pdfjs-dist/legacy/build/pdf.min.mjs');
    //     pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs');
    //     pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    // });

    // export async function prepareDocs(pdfUrl) {
    //     const pdfResponse = await fetch(pdfUrl);
    //     const pdfBlob = await pdfResponse.blob();
    //     const pdfLoader = new WebPDFLoader(pdfBlob);
    //     const doc = await pdfLoader.load();

    //     return pdfLoader;
    // }
    import { prepareDocs } from '$lib/vectorstore';

    const pdfUrl = './src/lib/assets/part_time_phd.pdf';

    prepareDocs(pdfUrl).then((docs) => {
        console.log(docs);
    });
</script>

<p>RAG</p>
