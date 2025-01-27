import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import {vectorStore} from "./vectorStore";
import type { Document } from "@langchain/core/documents";
 import {connectToDatabase} from "./pincoin";

export const gitHubUrlToDocs = async (url:string) => {
  const loader = new GithubRepoLoader(
    url,
    {
      branch: "master",
      recursive: false,
      unknown: "warn",
      maxConcurrency: 5, // Defaults to 2
    }
  );
  const docs = await loader.load();
   await connectToDatabase();
;
  await vectorStore.addDocuments(docs);
  return docs;
};

export default gitHubUrlToDocs;

// import type { Document } from "@langchain/core/documents";
// import { vectorStore } from "./vectorStore";
// const document1: Document = {
//   pageContent: "The powerhouse of the cell is the mitochondria",
//   metadata: { source: "https://example.com" },
// };

// const document2: Document = {
//   pageContent: "Buildings are made out of brick",
//   metadata: { source: "https://example.com" },
// };

// const document3: Document = {
//   pageContent: "Mitochondria are made out of lipids",
//   metadata: { source: "https://example.com" },
// };

// const document4: Document = {
//   pageContent: "The 2024 Olympics are in Paris",
//   metadata: { source: "https://example.com" },
// };

// const documents = [document1, document2, document3, document4];

// const gitHubUrlToDocs = async () => {
// await connectToDatabase();
//  const result = await vectorStore.addDocuments(documents, { ids: ["1", "2", "3", "4"] });
//  console.log("this is result===",result);
// }

// export default gitHubUrlToDocs;
