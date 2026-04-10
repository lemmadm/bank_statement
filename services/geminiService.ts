import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Transaction } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
const genAI = new GoogleGenerativeAI(API_KEY as string);

export const analyzeStatement = async (pdfFile: File): Promise<Transaction[]> => {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY not found. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const modelName = "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  const filePart = await fileToGenerativePart(pdfFile);

  const prompt = `You are an expert financial data analyst with exceptional attention to detail. Your primary task is to meticulously extract and categorize transactional data from the provided bank statement PDF.

  **Core Extraction Task:**
  Please identify and extract the following information for each transaction:
  1.  **date**: The date of the transaction. Standardize it to 'YYYY-MM-DD' format.
  2.  **description**: The transaction description. Clean it up by removing any unnecessary characters, codes, or noise.
  3.  **debit**: The amount withdrawn or charged. This must be a positive number. If not applicable, use null.
  4.  **credit**: The amount deposited. This must be a positive number. If not applicable, use null.
  5.  **balance**: The running balance after the transaction, if available. If not available, use null.

  **Transaction Categorization Rules:**
  After extracting the data for a transaction, you MUST assign it a category based on the following rules. Analyze the description and amounts carefully.
  - **'Bank Charges'**: Assign this category if the transaction is a small debit, typically less than 50 naira.
  - **'Claims'**: Assign this if the description contains "INTERNATIONAL HEALTH MANAGMENT SERVICES LTD" and it is a debit.
  - **'Stamp Duty'**: Assign this if the transaction is a debit of exactly 50 naira.
  - **'IHMS'**: Assign this category if the transaction is a credit and the description contains "INTERNATIONAL HEALTH MANAGEMEN FRM INTERNATIONAL H".
  - **'Capitation'**: Assign this category if the transaction is a credit but the description DOES NOT contain "INTERNATIONAL HEALTH MANAGEMEN FRM INTERNATIONAL H".
  - **'Other'**: If a transaction does not fit any of the above categories, assign it this default category.

  **Data Quality and Validation Rules:**
  - **Handle Imperfections:** Bank statements can have formatting issues. Correctly associate amounts with their descriptions and dates, even if the layout is imperfect.
  - **Validate Amounts:** A single transaction should typically have a value in EITHER the debit OR the credit column, not both.
  - **Check Balances:** If a running balance is present, use it as a sanity check. The new balance should roughly equal the previous balance minus debit plus credit.
  - **Missing Information:** If data is genuinely missing from the document, correctly use \`null\` as the value. Do not invent data.

  **Exclusions:**
  Ignore any summary sections, bank advertisements, or other non-transactional text.

  Return the extracted data as a JSON array, conforming to the provided schema. Your output must be a clean, accurate, and validated representation of the financial data, with each transaction correctly categorized.`;
  
  const responseSchema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        date: { type: SchemaType.STRING, description: "Transaction date in YYYY-MM-DD format." },
        description: { type: SchemaType.STRING, description: "Cleaned transaction description." },
        debit: { type: SchemaType.NUMBER, nullable: true, description: "Debit amount as a positive number or null." },
        credit: { type: SchemaType.NUMBER, nullable: true, description: "Credit amount as a positive number or null." },
        balance: { type: SchemaType.NUMBER, nullable: true, description: "Running balance after transaction or null." },
        category: { type: SchemaType.STRING, description: "The assigned category for the transaction based on the rules." },
      },
      required: ["date", "description", "debit", "credit", "balance", "category"],
    },
  };
  
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [filePart, { text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const response = await result.response;
    const jsonString = response.text().trim();
    const parsedData = JSON.parse(jsonString);

    // Assign unique IDs to transactions
    return (parsedData as Transaction[]).map(tx => ({
        ...tx,
        id: crypto.randomUUID()
    }));

  } catch (error: any) {
    console.error("Error analyzing statement with Gemini API:", error);
    let errorMessage = "Failed to process the bank statement.";

    if (error.message?.includes("API key")) {
        errorMessage = "Invalid Gemini API key. Please check your .env.local file.";
    } else if (error.message?.includes("model")) {
        errorMessage = `The AI model (${modelName}) is currently unavailable.`;
    } else if (error.message?.includes("quota")) {
        errorMessage = "API quota exceeded. Please try again later.";
    }

    throw new Error(errorMessage);
  }
};
