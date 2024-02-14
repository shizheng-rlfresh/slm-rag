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

/**
 * Asynchronously loads a PDF file using the provided URL or Blob.
 *
 * @param {Blob|string} pdf - The URL or Blob of the PDF to load
 * @return {Promise<WebPDFLoader|Error>} A Promise that resolves with the loaded WebPDFLoader or rejects with an Error
 */
async function loadPdf(pdf) {
    try {
        let blob;

        // Check if the input is a URL and fetch the PDF
        if (!(pdf instanceof Blob) && typeof pdf === 'string') {
            const response = await fetch(pdf);
            if (!response.ok) {
                throw new Error('Fetching response was not successful');
            }
            blob = await response.blob();
        }
        // Check if the input is already a Blob
        else if (pdf instanceof Blob) {
            blob = pdf;
        }
        // Throw an error if the input is neither a URL nor a Blob
        else {
            throw new Error('Invalid PDF URL or Blob');
        }

        // Create and return a new WebPDFLoader with the loaded blob
        return new WebPDFLoader(blob, {
            pdfjs: () => Promise.resolve(pdfjs),
        });
    } catch (error) {
        // Catch and handle any errors that occur during the loading process
        return new Error('creating PDF loader: ' + error);
    }
}

/**
 * Load and split documents using the provided loader and arguments
 * @param {object} loader - The loader object
 * @param {object} args - The arguments object
 * @returns {Promise<Array<string>|Error>} - A promise that resolves with an array of split documents
 */
async function loadDocs(loader, args) {
    try {
        // Load pages using the provided loader
        const pages = await loader.load();
        // Create a text splitter with chunk size and overlap based on the provided arguments
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: args?.chunkSize || 1000,
            chunkOverlap: args?.chunkOverlap || 200,
        });
        // Split documents using the text splitter and return the result
        return await textSplitter.splitDocuments(pages);
    } catch (error) {
        // Return an error if there's an error loading or splitting the document
        return new Error('Error loading or splitting document: ', error);
    }
}

/**
 * Create a vector store from the given documents using the specified arguments.
 *
 * @param {Array<string>} docs docs - The array of documents to create the vector store from.
 * @param {Object} args - The arguments to customize the vector store creation.
 * @returns {Promise<CloseVectorWeb|Error>} - A promise that resolves with the created vector store.
 */
async function createVectorStore(docs, args) {
    try {
        // Check if the array of documents is empty
        if (docs.length === 0) {
            throw new Error('No documents were prepared, possibly due to an earlier error.');
        }

        // Create a new HuggingFaceTransformersEmbeddings model with the specified modelName or use the default embeddingModel
        const model = new HuggingFaceTransformersEmbeddings({
            modelName: args?.modelName || embeddingModel, // modelName from args or default embeddingModel
        });

        // Return the vector store created from the documents using the model
        return await CloseVectorWeb.fromDocuments(docs, model);
    } catch (error) {
        // If an error occurs, create a new error for creating vector store and include the original error
        return new Error('creating vector store: ', error);
    }
}

/**
 * Creates a retriever for searching text within a PDF document
 * @param {string} pdf - The path to the PDF document
 * @param {object} args - Additional arguments for configuring the retriever
 * @param {string} args.embedModel - The name of the embedding model to use
 * @param {number} args.chunkSize - The size of each chunk for processing the PDF
 * @param {number} args.chunkOverlap - The overlap between consecutive chunks
 * @param {number} args.retrieverK - The number of retrievals to perform
 * @param {string} args.retrieverSearch - The type of search to perform
 * @returns {Promise<Retriever|Error>} - A retriever for searching the PDF document or an Error if an issue occurs
 */
export async function createRetriever(pdf, args) {
    // Set default values for optional arguments
    const embedModel = args?.embedModel || embeddingModel;
    const chunkSize = args?.chunkSize || 1000;
    const chunkOverlap = args?.chunkOverlap || 200;
    const retrieverK = args?.retrieverK || 1;
    const retrieverSearch = args?.retrieverSearch || 'similarity';
    try {
        // Load the PDF document
        const loader = await loadPdf(pdf);
        if (loader instanceof Error) {
            return loader;
        }
        // Extract the text content from the PDF document
        const docs = await loadDocs(loader, { chunkSize, chunkOverlap });
        if (docs instanceof Error) {
            return docs;
        }
        // Create a vector store for the text content
        const vectorStore = await createVectorStore(docs, { modelName: embedModel });
        if (vectorStore instanceof Error) {
            return vectorStore;
        }
        // Convert the vector store into a retriever for searching
        return vectorStore.asRetriever({ k: retrieverK, searchType: retrieverSearch });
    } catch (error) {
        return new Error('creating retriever: ', error);
    }
}
