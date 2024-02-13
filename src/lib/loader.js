import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { CloseVectorWeb } from '@langchain/community/vectorstores/closevector/web';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.min.mjs');
const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function pdfLoader(pdfUrl) {
    try {
        const response = await fetch(pdfUrl);
        if (!response.ok) {
            throw new Error('fetching response was not ok');
        }
        const blob = await response.blob();
        const loader = new WebPDFLoader(blob, {
            pdfjs: () => Promise.resolve(pdfjs),
        });
        return loader;
    } catch (error) {
        throw new Error('Error creating loader: ', error);
    }
}

export async function loadDocs(loader, args) {
    try {
        const pages = await loader.load();
        const text_splitter = new RecursiveCharacterTextSplitter({
            chunkSize: args?.chunkSize ? args.chunkSize : 1000,
            chunkOverlap: args?.chunkOverlap ? args.chunkOverlap : 200,
        });
        const docs = await text_splitter.splitDocuments(pages);
        return docs;
    } catch (error) {
        throw new Error('Error loading or splitting document: ', error);
    }
}

export async function createVectorStore(docs, args) {
    try {
        if (docs.length === 0) {
            throw new Error('No documents were prepared, possibly due to an earlier error.');
        }
        const model = new HuggingFaceTransformersEmbeddings({
            modelName: args?.modelName || 'Xenova/all-MiniLM-L6-v2',
        });
        // const vectorStore = 1;
        const vectorStore = await CloseVectorWeb.fromDocuments(docs, model);
        return vectorStore;
    } catch (error) {
        throw new Error('Error creating vector store: ', error);
    }
}
