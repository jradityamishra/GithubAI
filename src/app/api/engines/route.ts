
import { NextResponse } from "next/server";
const availableModels = [
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
  { id: "gemini-1.0-pro", name: "Gemini 1.0 Pro" },
];

export const GET = async () => {
  try {
    const modelOptions = availableModels.map((model) => ({
      value: model.id,
      label: model.name,
    }));

    return NextResponse.json(
      {
        success: true,
        modelOptions,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
};
