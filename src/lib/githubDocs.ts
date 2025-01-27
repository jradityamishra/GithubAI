import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { vectorStore } from "./vectorStore";
import { connectToDatabase } from "./pincoin";
import axios from "axios";
import { Document } from "langchain/document"; // Import Document type

// Define a type for the GitHub branch API response
interface GitHubBranch {
  name: string;
}

// Function to fetch all branches from a GitHub repository
const fetchAllBranches = async (repoUrl: string): Promise<string[]> => {
  const repoPath = new URL(repoUrl).pathname.slice(1); // Remove the leading '/'
  const apiUrl = `https://api.github.com/repos/${repoPath}/branches`;

  try {
    const response = await axios.get<GitHubBranch[]>(apiUrl);
    return response.data.map((branch) => branch.name);
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};

export const gitHubUrlToDocs = async (url: string): Promise<void> => {
  const branches = await fetchAllBranches(url);

  if (branches.length === 0) {
    console.warn("No branches found for the repository.");
    return;
  }

  await connectToDatabase();

  for (const branch of branches) {
    const loader = new GithubRepoLoader(url, {
      branch: branch,
      recursive: false,
      unknown: "warn" as "warn", // Ensure correct type
      maxConcurrency: 5,
    });

    const docs: Document[] = await loader.load(); // Explicitly define docs type
    await vectorStore.addDocuments(docs);
    console.log(`Processed ${docs.length} documents from branch: ${branch}`);
  }
};

export default gitHubUrlToDocs;
