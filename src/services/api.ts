import axios from "axios";
import type { Question } from "../store/quizStore";

interface ApiResponse {
  response_code: number;
  results: Omit<Question, 'all_answers'>[];
}

const API_URL = "https://opentdb.com/api.php";

export const fetchQuizQuestions = async (
  amount: number = 10,
  difficulty: "easy" | "medium" | "hard" | "" = "",
  type: "multiple" | "boolean" | "" = "multiple",
): Promise<Question[]> => {
  try {
    // Buat params, kosongkan jika ingin campuran
    const params: Record<string, string | number> = { amount };
    if (difficulty) params.difficulty = difficulty;
    if (type) params.type = type;

    const response = await axios.get<ApiResponse>(API_URL, { params });

    if (response.data.response_code !== 0) {
      // Fallback: coba tanpa filter kesulitan
      if (response.data.response_code === 1 && difficulty) {
        return fetchQuizQuestions(amount, "", type);
      }
      throw new Error(`API Error Code: ${response.data.response_code}`);
    }

    return response.data.results.map((question) => ({
      ...question,
      all_answers: [
        ...question.incorrect_answers,
        question.correct_answer,
      ].sort(() => Math.random() - 0.5),
    }));
  } catch (error) {
    console.error("Gagal mengambil soal:", error);
    throw error;
  }
};
