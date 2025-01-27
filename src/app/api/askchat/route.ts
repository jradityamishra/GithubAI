import query from "@/src/lib/queryApi";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { Message } from "@/type";
import { adminDB } from "@/firabaseAdmin";
import extractGitHubURL from "@/lib/github";
import gitHubUrlToDocs from "@/lib/githubDocs";
import retrieveRelevantDocs from "@/lib/retriveData";
import { PromptTemplate } from "@langchain/core/prompts";

const promptData = PromptTemplate.fromTemplate(
  `Your name is GithubAI. You are a proficient software developer specializing in GitHub and Git. Respond with syntactically correct code or information related to GitHub and Git.Anthing asked to provide the repository link . Make sure you follow these rules:
  1. Use context to understand the code and how to use it & apply.
  2. Do not add license information to the output code.
  3. Always provide the code in the markdown format.
  4. Ensure all the requirements in the question are met.
  5. If the question is not related to GitHub or Git, respond with: "I'm sorry, I can only assist with GitHub and Git-related questions. Please contact support for other queries."

  user previous history:
  {hostory}

  User Prompt Question:
  {question}

  Context:
  {context}

  Helpful answer in markdown:`
);

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  const { prompt, id, session } = reqBody;

  // Input validation
  if (!prompt) {
    return NextResponse.json(
      { message: "Please provide a prompt!" },
      { status: 400 }
    );
  }
  if (!id) {
    return NextResponse.json(
      { message: "Please provide a valid chat ID!" },
      { status: 400 }
    );
  }

  // Use the vector store as a retriever that returns a single document


  // Extract GitHub URL (if present)
  const url = extractGitHubURL(prompt);
  if (url) {
    const docs = await gitHubUrlToDocs(url);
    if (docs) {
      console.log("GitHub repo data stored successfully in vector store!");
    }
  }

  const p = await retrieveRelevantDocs(prompt);

  let chatHistory = "";
  try {
    const messagesSnapshot = await adminDB
      .collection("users")
      .doc(session)
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("createdAt", "desc") // Order by timestamp in descending order
      .limit(5) // Limit to the last 5 messages
      .get();

    // Reverse the messages to maintain chronological order
    const messages = messagesSnapshot.docs.reverse();

    messages.forEach((doc) => {
      const message = doc.data();
      chatHistory += `${message.user.name}: ${message.text}\n`; // Format the chat history
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }

  const Formattedprompt = await promptData.format({
    hostory: chatHistory,
    question: prompt,
    context: p
  })



  const responseText = await query(Formattedprompt);
  const messageText = Array.isArray(responseText) ? responseText.join(', ') : responseText;
  // Construct message object
  const message: Message = {
    text: messageText || "GithubAI was unable to find an answer for that!",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "GithubAI",
      name: "GithubAI",
      avatar: "https://res.cloudinary.com/duehd78sl/image/upload/v1729227742/logoLight_amxdpz.png",
    },
  };

  // Save message to Firebase
  try {
    await adminDB
      .collection("users")
      .doc(session)
      .collection("chats")
      .doc(id)
      .collection("messages")
      .add(message);

    return NextResponse.json(
      {
        answer: message.text,
        message: "GithubAI has responded!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    const e = error as Error
    console.error("Error saving message to Firebase:", error);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};




