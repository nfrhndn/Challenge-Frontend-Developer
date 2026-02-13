import axios from "axios";

export interface Question {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[]; // Shuffled answers
}

interface ApiResponse {
  response_code: number;
  results: Question[];
}

const API_URL = "https://opentdb.com/api.php";

export const fetchQuizQuestions = async (
  amount: number = 10,
  difficulty: "easy" | "medium" | "hard" = "medium",
  type: "multiple" | "boolean" = "multiple",
): Promise<Question[]> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL, {
      params: {
        amount,
        difficulty,
        type,
      },
    });

    if (response.data.response_code !== 0) {
       // If we get a rate limit (code 5) or no results (code 1), strictly we should fallback or wait.
       // For this challenge, if we fail, let's try a generic fetch (no difficulty) as fallback
       if (response.data.response_code === 1 && difficulty) {
           console.log("No results for difficulty, trying any difficulty...");
           return fetchQuizQuestions(amount, undefined, type);
       }
       
       throw new Error(`Failed to fetch questions. Code: ${response.data.response_code}`);
    }

    return response.data.results.map((question) => ({
      ...question,
      all_answers: [
        ...question.incorrect_answers,
        question.correct_answer,
      ].sort(() => Math.random() - 0.5),
    }));
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
};
