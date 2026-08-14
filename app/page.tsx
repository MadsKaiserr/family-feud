import Game from "@/components/Game";
import questionsData from "@/data/questions.json";
import type { Question } from "@/lib/types";

export default function Home() {
  return <Game questions={questionsData as Question[]} />;
}
