import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { CloseVectorWeb } from '@langchain/community/vectorstores/closevector/web';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// This is a temporary fix for a bug in pdfjs
// see details in https://github.com/langchain-ai/langchainjs/issues/4383
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.min.mjs');
const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// default Embedding model from Transformers.js - used for vectorstore
const embeddingModel = 'Xenova/all-MiniLM-L6-v2';
// default LLM from transformers.js - used for coversation/text-generation

async function loadPdf(pdf) {
    let pdfLoader;
    try {
        let blob;
        if (!(pdf instanceof Blob) && typeof pdf === 'string') {
            const response = await fetch(pdf);
            if (!response.ok) {
                throw new Error('Fetching response was not successful');
            }
            blob = await response.blob();
        } else if (pdf instanceof Blob) {
            blob = pdf;
        } else {
            throw new 'Invalid PDF URL or Blob'();
        }

        pdfLoader = new WebPDFLoader(blob, {
            pdfjs: () => Promise.resolve(pdfjs),
        });
    } catch (error) {
        pdfLoader = new Error('creating PDF loader: ' + error);
    }

    return pdfLoader;
}

async function loadDocs(loader, args) {
    let docs;
    try {
        const pages = await loader.load();
        const text_splitter = new RecursiveCharacterTextSplitter({
            chunkSize: args?.chunkSize ? args.chunkSize : 1000,
            chunkOverlap: args?.chunkOverlap ? args.chunkOverlap : 200,
        });
        docs = await text_splitter.splitDocuments(pages);
    } catch (error) {
        docs = new Error('loading or splitting document: ', error);
    }

    return docs;
}

async function createVectorStore(docs, args) {
    let vectorStore;
    try {
        if (docs.length === 0) {
            throw new Error('No documents were prepared, possibly due to an earlier error.');
        }
        const model = new HuggingFaceTransformersEmbeddings({
            modelName: args?.modelName || embeddingModel,
        });
        vectorStore = await CloseVectorWeb.fromDocuments(docs, model);
    } catch (error) {
        vectorStore = new Error('creating vector store: ', error);
    }

    return vectorStore;
}

export async function createRetriever(pdf, args) {
    let retriever;
    const embedModel = args?.embedModel ? args.embedModel : embeddingModel;
    const chunkSize = args?.chunkSize ? args.chunkSize : 1000;
    const chunkOverlap = args?.chunkOverlap ? args.chunkOverlap : 200;
    const retrieverK = args?.retrieverK ? args.retrieverK : 1;
    const retrieverSearch = args?.retrieverSearch ? args.retrieverSearch : 'similarity';
    try {
        const loader = await loadPdf(pdf);
        if (loader instanceof Error) {
            console.log('loader: ', loader);
            return loader;
        }
        const docs = await loadDocs(loader, { chunkSize, chunkOverlap });
        if (docs instanceof Error) {
            console.log('docs: ', docs);
            return docs;
        }
        const vectorStore = await createVectorStore(docs, { modelName: embedModel });
        if (vectorStore instanceof Error) {
            console.log('vectorStore: ', vectorStore);
            return vectorStore;
        }
        retriever = vectorStore.asRetriever({ k: retrieverK, searchType: retrieverSearch });
    } catch (error) {
        retriever = new Error('creating retriever: ', error);
    }

    return retriever;
}
