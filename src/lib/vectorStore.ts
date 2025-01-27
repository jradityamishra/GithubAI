import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import collection from "./pincoin";

export const vectorStore = new MongoDBAtlasVectorSearch(
    new GoogleGenerativeAIEmbeddings(),{
    collection: collection,
    indexName: "vector_index",
    textKey: "pageContent",
    embeddingKey: "metadata"
});
