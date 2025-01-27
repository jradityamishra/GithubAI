import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import {vectorStore} from "./vectorStore";
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

