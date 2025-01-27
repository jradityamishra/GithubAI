import {vectorStore} from "./vectorStore";
import {connectToDatabase} from "./pincoin";
 const retrieveRelevantDocs = async (prompt :string) => {
    try {
       await connectToDatabase();

       const formattedPrompt = typeof prompt === "string" ? prompt : JSON.stringify(prompt);


        // Perform the retrieval
        const  retriever=await vectorStore.similaritySearch(formattedPrompt,2); // Explicitly pass options
       return retriever;
    } catch (error) {
      console.error("Error retrieving relevant documents:", error);
      return [];
    }
  };

  export default retrieveRelevantDocs;