import { MultipleChoiceOptionModel } from "./multipleChoiceOption";

export type QuestionModel = {
  id: number;
  text: string;
  type: "multiple_choice" | "free_response";
  attempted: boolean;
  multipleChoiceOptions: MultipleChoiceOptionModel[];
};
