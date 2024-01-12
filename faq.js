import "dotenv/config";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { openai } from "./openai.js";

const question = process.argv[2] || "Hi";

export const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());

export async function docsFromPdf(pdf) {
  const loader = new PDFLoader(pdf);

  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: ". ",
      chunkSize: 2500,
      chunkOverlap: 200,
    })
  );
}
export const loadStore = async () => {
  const pdfDocs = await docsFromPdf(process.env.PDF_FILE_PATH);
  return createStore([...pdfDocs]);
};

const query = async () => {
  const store = await loadStore();

  const results = await store.similaritySearch(question, 1);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k-0613",
    temperature: 0,
    messages: [
      {
        role: "assistant",
        content:
          "You are a helpful AI assistant. Answser questions to your best ability. ",
      },
      {
        role: "user",
        content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
        Question: ${question}
  
        Context: ${results.map((r) => r.pageContent).join("\n")}`,
      },
    ],
  });
  console.log(
    `Answer: ${response.choices[0].message.content}\n\nSources: ${results
      .map((r) => r.metadata.source)
      .join(", ")}`
  );
};

query();
