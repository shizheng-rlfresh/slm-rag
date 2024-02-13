import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.min.mjs');
const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const pdfUrl = './src/lib/assets/part_time_phd.pdf';

export async function prepareDocs(pdfUrl) {
    const pdfResponse = await fetch(pdfUrl);
    const pdfBlob = await pdfResponse.blob();
    const pdfLoader = new WebPDFLoader(pdfBlob, {
        pdfjs: () => Promise.resolve(pdfjs),
    });
    const docs = await pdfLoader.load();

    return docs;
}

// export function test() {
//     prepareDocs(pdfUrl).then((loader) => {
//         docs = loader.load();
//         console.log(docs);
//     });
// }

// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// // import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
// // import { CloseVectorWeb } from '@langchain/community/vectorstores/closevector/web';

// pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';

// export async function test() {
//     const blob = new Blob();
//     const loader = new WebPDFLoader(blob, {
//         pdfjs: () => Promise.resolve(pdfjs),
//     });
//     const pages = await loader.load();
//     console.log(pages);
// }

// export async function test() {
//     const blob = new Blob();
//     const loader = new WebPDFLoader(blob, {
//         pdfjs: () => import('pdfjs-dist/legacy/build/pdf.mjs'),
//     });
//     const pages = await loader.load();
//     console.log(pages);
// }

// import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
// // import pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// const blob = new Blob(); // e.g. from a file input

// // pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

// const loader = new WebPDFLoader(blob, {
//     pdfjs: () => import('pdfjs-dist/legacy/build/pdf.mjs'),
// });

// export async function prepareDocs(url, args) {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     const blob = await response.blob();
//     const loader = new WebPDFLoader(blob);

//     try {
//         const pages = await loader.load();
//         console.log(typeof pages);
//         const text_splitter = new RecursiveCharacterTextSplitter({
//             chunkSize: args.chunkSize ? args.chunkSize : 1000,
//             chunkOverlap: args.chunkOverlap ? args.chunkOverlap : 200,
//         });
//         const docs = await text_splitter.splitDocuments(pages);
//         return docs;
//     } catch (error) {
//         console.log('Error loading or splitting document: ', error);
//     }
// }

// export async function createVectorStore(url, args) {
//     try {
//         const docs = (await prepareDocs(url, args)) || [];
//         if (docs.length === 0) {
//             throw new Error('No documents were prepared, possibly due to an earlier error.');
//         }
//         const model = new HuggingFaceTransformersEmbeddings({
//             modelName: args.modelName || 'Xenova/all-MiniLM-L6-v2',
//         });
//         const vectorStore = await CloseVectorWeb.fromDocuments(docs, model);
//         return vectorStore;
//     } catch (error) {
//         console.error('Error creating vector store: ', error);
//         // Depending on your use case, you may want to rethrow the error or handle it differently
//         throw error; // Rethrow if you want the error to propagate
//     }
// }
