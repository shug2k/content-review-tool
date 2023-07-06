/*
Copyright 2023, Sagnik Ghosh

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export interface Answer {
  tag: string;
  text: string;
  next_question_tag: string | undefined;
}

export interface Question {
  tag: string;
  text: string;
  answers: Answer[];
}

export interface DecisionTree {
  start_question_tag: string;
  questions: Question[];
}

export interface QuestionWithAnswer {
  questionTag: string;
  answerTag: string;
}

export async function handleSubmitClick(
  reviewId: string,
  questionsWithAnswers: QuestionWithAnswer[],
  currentQuestion: Question,
  currentAnswer: Answer
): Promise<void> {
  const updatedQuestionsWithAnswers = [
    ...questionsWithAnswers,
    { questionTag: currentQuestion.tag, answerTag: currentAnswer.tag },
  ];

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questions_with_answers: updatedQuestionsWithAnswers,
    }),
  };
  const res = await fetch(
    "http://localhost:8000/review/" + reviewId + "/store-result",
    requestOptions
  );

  return;
}

export function handleBackClick(
  questionsWithAnswers: QuestionWithAnswer[],
  decisionTree: DecisionTree
): {
  updatedQuestionsWithAnswers: QuestionWithAnswer[];
  prevQuestion: Question;
} {
  const prevQuestionWithAnswer = questionsWithAnswers.pop();

  if (prevQuestionWithAnswer === undefined) {
    throw new Error(
      "No previous questions! Should not have been able to reach here"
    );
  }

  const prevQuestion = decisionTree.questions.find(
    (elem) => elem.tag === prevQuestionWithAnswer.questionTag
  );

  if (prevQuestion === undefined) {
    throw new Error("Could not find previous question!");
  }

  return {
    updatedQuestionsWithAnswers: questionsWithAnswers,
    prevQuestion,
  };
}

export function handleNextClick(
  questionsWithAnswers: QuestionWithAnswer[],
  decisionTree: DecisionTree,
  currentQuestion: Question,
  currentAnswer: Answer
): {
  updatedQuestionsWithAnswers: QuestionWithAnswer[];
  nextQuestion: Question;
} {
  if (currentAnswer.next_question_tag === undefined) {
    throw new Error(
      "answer does not have a next question! This should have gone to submit"
    );
  }

  const updatedQuestionsWithAnswers = [
    ...questionsWithAnswers,
    { questionTag: currentQuestion.tag, answerTag: currentAnswer.tag },
  ];

  const nextQuestion = decisionTree.questions.find(
    (elem) => elem.tag === currentAnswer.next_question_tag
  );

  if (nextQuestion === undefined) {
    throw new Error("Could not find next question!");
  }

  return {
    updatedQuestionsWithAnswers,
    nextQuestion,
  };
}
