import { GoogleGenAI, Type } from "@google/genai";
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

// Use process.env which is injected by Vite via the define option in vite.config.ts
const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey as string });

export const analyzeStatement = async (pdfFile: File): Promise<Transaction[]> => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set. Please add it to your .env file following the .env.example.");
  }

  const model = "gemini-2.5-pro";

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
  After extracting the data for a transaction, you MUST assign it a category based on the following rules. Analyze the description and amounts carefully:
  - **'Bank Charges'**: Assign this category if the transaction is a small debit/fee, typically under a nominal amount (e.g., under 50 units of local currency).
  - **'Claims'**: Assign this if the description contains text related to insurance or health claims.
  - **'Stamp Duty'**: Assign this if the transaction is a government tax/fee (often a fixed amount like 50 units).
  - **'IHMS'**: Assign this category if the transaction is a credit and the description contains "International Health Management Services" or similar health insurance indicators.
  - **'Capitation'**: Assign this category if the transaction is a credit but does NOT contain health insurance indicators.
  - **'Other'**: If a transaction does not fit any of the above categories, assign it this default category.

  **Important:** These categories are configurable. You may adjust them based on the specific bank and region the statement originates from.

  **Data Quality and Validation Rules:**
  - **Handle Imperfections:** Bank statements can have formatting issues. Correctly associate amounts with their descriptions and dates, even if the layout is imperfect.
  - **Validate Amounts:** A single transaction should typically have a value in EITHER the debit OR the credit column, not both.
  - **Check Balances:** If a running balance is present, use it as a sanity check. The new balance should roughly equal the previous balance minus debit plus credit.
  - **Missing Information:** If data is genuinely missing from the document, correctly use \`null\` as the value. Do not invent data.

  **Exclusions:**
  Ignore any summary sections, bank advertisements, or other non-transactional text.

  Return the extracted data as a JSON array, conforming to the provided schema. Your output must be a clean, accurate, and validated representation of the financial data, with each transaction correctly categorized.`;
  
  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING, description: "Transaction date in YYYY-MM-DD format." },
        description: { type: Type.STRING, description: "Cleaned transaction description." },
        debit: { type: Type.NUMBER, nullable: true, description: "Debit amount as a positive number or null." },
        credit: { type: Type.NUMBER, nullable: true, description: "Credit amount as a positive number or null." },
        balance: { type: Type.NUMBER, nullable: true, description: "Running balance after transaction or null." },
        category: { type: Type.STRING, description: "The assigned category for the transaction based on the rules." },
      },
      required: ["date", "description", "debit", "credit", "balance", "category"],
    },
  };
  
  try {
    const result = await ai.models.generateContent({
      model,
      contents: { parts: [filePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = result.text.trim();
    const parsedData = JSON.parse(jsonString);
    return parsedData as Transaction[];

  } catch (error) {
    console.error("Error analyzing statement with Gemini API:", error);
    throw new Error("Failed to process the bank statement. The AI model could not extract the data.");
  }
};
