import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { vectorStore } from "./vectorStore";
import { connectToDatabase } from "./pincoin";

// Function to fetch all branches from a GitHub repository
const fetchBranches = async (repoUrl: string): Promise<string[]> => {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  const owner = match[1];
  const repo = match[2];
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches`;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Ensure you have a valid token
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch branches: ${response.statusText}`);
  }

  const branches = await response.json();
  return branches.map((branch: { name: string }) => branch.name);
};

export const gitHubUrlToDocs = async (url: string) => {
  await connectToDatabase();

  try {
    const branches = await fetchBranches(url);
    console.log("Fetched branches:", branches);

    for (const branch of branches) {
      console.log(`Processing branch: ${branch}`);
      const loader = new GithubRepoLoader(url, {
        branch,
        recursive: false,
        unknown: "warn",
        maxConcurrency: 5,
      });

      const data=await vectorStore.addDocuments(await loader.load());
      return data;
    }
  } catch (error) {
    console.error("Error fetching branches:", error);
  }
};

export default gitHubUrlToDocs;
