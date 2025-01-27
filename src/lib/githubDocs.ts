import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { vectorStore } from "./vectorStore";
import { connectToDatabase } from "./pincoin";
import axios from "axios"; // You'll need axios to fetch branches from GitHub

// Function to fetch all branches from a GitHub repository
const fetchAllBranches = async (repoUrl: string): Promise<string[]> => {
  const repoPath = new URL(repoUrl).pathname.slice(1); // Remove the leading '/'
  const apiUrl = `https://api.github.com/repos/${repoPath}/branches`;

  try {
    const response = await axios.get(apiUrl);
    return response.data.map((branch: any) => branch.name);
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};

export const gitHubUrlToDocs = async (url: string) => {
  const branches = await fetchAllBranches(url);

  if (branches.length === 0) {
    console.warn("No branches found for the repository.");
    return [];
  }

  await connectToDatabase();

  for (const branch of branches) {
    const loader = new GithubRepoLoader(url, {
      branch: branch,
      recursive: false,
      unknown: "warn",
      maxConcurrency: 5,
    });

    const docs = await loader.load();
    await vectorStore.addDocuments(docs);
    console.log(`Processed ${docs.length} documents from branch: ${branch}`);
  }

  return; // You can return something meaningful if needed
};

export default gitHubUrlToDocs;