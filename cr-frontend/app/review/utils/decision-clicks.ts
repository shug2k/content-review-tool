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

export async function handleSubmitClick({
  params: { questionsWithAnswers, decisionTree, currQuestion, currAnswer },
}: {
  params: {
    questionsWithAnswers: QuestionWithAnswer[];
    decisionTree: DecisionTree;
    currQuestion: Question;
    currAnswer: Answer;
  };
}): Promise<void> {
  const updatedQuestionsWithAnswers = [
    ...questionsWithAnswers,
    { questionTag: currQuestion.tag, answerTag: currAnswer.tag },
  ];

  // insert call to backend here

  return;
}

export function handleBackClick({
  params: { questionsWithAnswers, decisionTree },
}: {
  params: {
    questionsWithAnswers: QuestionWithAnswer[];
    decisionTree: DecisionTree;
  };
}): {
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

export function handleNextClick({
  params: { questionsWithAnswers, decisionTree, currQuestion, currAnswer },
}: {
  params: {
    questionsWithAnswers: QuestionWithAnswer[];
    decisionTree: DecisionTree;
    currQuestion: Question;
    currAnswer: Answer;
  };
}): {
  updatedQuestionsWithAnswers: QuestionWithAnswer[];
  nextQuestion: Question;
} {
  if (currAnswer.next_question_tag === undefined) {
    throw new Error(
      "answer does not have a next question! This should have gone to submit"
    );
  }

  const updatedQuestionsWithAnswers = [
    ...questionsWithAnswers,
    { questionTag: currQuestion.tag, answerTag: currAnswer.tag },
  ];

  const nextQuestion = decisionTree.questions.find(
    (elem) => elem.tag === currAnswer.next_question_tag
  );

  if (nextQuestion === undefined) {
    throw new Error("Could not find next question!");
  }

  return {
    updatedQuestionsWithAnswers,
    nextQuestion,
  };
}
