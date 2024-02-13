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
const chatModel = 'gpt2';

async function loadPdf(pdfUrl) {
    try {
        const response = await fetch(pdfUrl);
        if (!response.ok) {
            throw new Error('Fetching response was not successful');
        }
        const blob = await response.blob();
        const pdfLoader = new WebPDFLoader(blob, {
            pdfjs: () => Promise.resolve(pdfjs),
        });
        return pdfLoader;
    } catch (error) {
        throw new Error('Error creating PDF loader: ' + error);
    }
}

async function loadDocs(loader, args) {
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

async function createVectorStore(docs, args) {
    try {
        if (docs.length === 0) {
            throw new Error('No documents were prepared, possibly due to an earlier error.');
        }
        const model = new HuggingFaceTransformersEmbeddings({
            modelName: args?.modelName || embeddingModel,
        });
        // const vectorStore = 1;
        const vectorStore = await CloseVectorWeb.fromDocuments(docs, model);
        return vectorStore;
    } catch (error) {
        throw new Error('Error creating vector store: ', error);
    }
}

export async function createRetriever(args) {
    const pdfUrl = args?.pdfUrl ? args.pdfUrl : './src/lib/assets/part_time_phd.pdf';
    const embedModel = args?.embedModel ? args.embedModel : embeddingModel;
    const llmModel = args?.llmModel ? args.llmModel : chatModel;
    const chunkSize = args?.chunkSize ? args.chunkSize : 1000;
    const chunkOverlap = args?.chunkOverlap ? args.chunkOverlap : 200;
    const retrieverK = args?.retrieverK ? args.retrieverK : 1;
    const retrieverSearch = args?.retrieverSearch ? args.retrieverSearch : 'similarity';

    try {
        const loader = await loadPdf(pdfUrl);
        const docs = await loadDocs(loader, { chunkSize, chunkOverlap });
        const vectorStore = await createVectorStore(docs, { modelName: embedModel });
        const retriever = vectorStore.asRetriever({ k: retrieverK, searchType: retrieverSearch });
        return retriever;
    } catch (error) {
        throw new Error('Error creating retriever: ', error);
    }
}
