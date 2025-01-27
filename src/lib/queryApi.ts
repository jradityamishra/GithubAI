 import openai from "./chatgpt";



const query = async (prompt: string, id: string, model: string) => {
  
  // const models=openai.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const result = await openai.invoke(prompt);
console.log(result)
  return result.content;
};

export default query;
