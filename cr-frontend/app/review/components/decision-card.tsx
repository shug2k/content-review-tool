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

"use client"

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation'
import * as DecisionUtils from '../utils/decisions';

type DecisionCardProps = {
    reviewId: string;
    nextReviewId?: string;
    decisionTree: DecisionUtils.DecisionTree;
}

const DecisionCard: FC<DecisionCardProps> = ({reviewId, nextReviewId, decisionTree}) => {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(decisionTree.questions.find(
    (elem) => elem.tag === decisionTree.start_question_tag
  ));
  const [currentAnswer, setCurrentAnswer] = useState<DecisionUtils.Answer | undefined>();
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<DecisionUtils.QuestionWithAnswer[]>([]);

  const [showBack, setShowBack] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);


  const handleRadioClick = (answer: DecisionUtils.Answer) => {
    setCurrentAnswer(answer);
    if (answer.next_question_tag !== undefined) {
      setShowNext(true);
      setShowSubmit(false);
    } else {
      setShowNext(false);
      setShowSubmit(true);
    }
  }

  const handleBackClick = () => {
    const {updatedQuestionsWithAnswers, prevQuestion} = DecisionUtils.handleBackClick(
      questionsWithAnswers, decisionTree
    );

    setQuestionsWithAnswers(updatedQuestionsWithAnswers);
    setCurrentQuestion(prevQuestion);
    setCurrentAnswer(undefined);

    setShowBack(questionsWithAnswers.length > 0);
    setShowNext(false);
    setShowSubmit(false);
  }

  const handleNextClick = () => {
    if (currentQuestion === undefined) {
      throw new Error("Current question is not set!");
    }

    if (currentAnswer === undefined) {
      throw new Error("Current answer is not set!");
    }

    const {updatedQuestionsWithAnswers, nextQuestion} = DecisionUtils.handleNextClick(
      questionsWithAnswers, decisionTree, currentQuestion, currentAnswer
    );

    setQuestionsWithAnswers(updatedQuestionsWithAnswers);
    setCurrentQuestion(nextQuestion);
    setCurrentAnswer(undefined);

    setShowBack(true);
    setShowNext(false);
    setShowSubmit(false);
  }

  const handleSubmitClick = async () => {
    if (currentQuestion === undefined) {
      throw new Error("Current question is not set!");
    }

    if (currentAnswer === undefined) {
      throw new Error("Current answer is not set!");
    }

    await DecisionUtils.handleSubmitClick(reviewId, questionsWithAnswers, currentQuestion, currentAnswer);
    
    if (nextReviewId !== undefined && nextReviewId !== null) {
      router.push('/review/' + nextReviewId);
    } else {
      router.push('/');
    }
  }

  if (currentQuestion === undefined) {
    throw new Error("Could not find start question in decision tree!");
  }

  return (
    <div className="w-96 h-96 bg-white shadow rounded-lg mt-5 relative">
      <div className="flex w-96 h-14 bg-blue-950 rounded-md items-center justify-center">
        <h1 className="text-2xl text-white text-center">Decision</h1>
      </div>

      <div className="my-4">
        <h1 className="w-80 h-10 text-xl mx-2">{currentQuestion.text}</h1>
        {currentQuestion.answers.map((item: DecisionUtils.Answer) => {
          return (
            <div key={currentQuestion.tag + '_' + item.tag}>
              <input 
                className="mx-4"
                id={currentQuestion.tag + '_' + item.tag}
                type="radio"
                name={currentQuestion.tag}
                value={item.tag}
                onClick={() => {handleRadioClick(item)}}
              />
              <label htmlFor={item.tag}>{item.text}</label>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 right-0">
        {showBack && <button className="flex w-24 h-11 bg-white border rounded-lg hover:bg-gray-200
          border-black items-center justify-center float-left text-xl font-bold mx-2 my-4" onClick={() => {handleBackClick()}}>
          Back
        </button>}
        {showNext && <button className="flex w-24 h-11 bg-white border rounded-lg hover:bg-gray-200
          border-black items-center justify-center float-left text-xl font-bold mx-2 my-4" onClick={() => {handleNextClick()}}>
          Next
        </button>}
        {showSubmit && <button className="flex w-24 h-11 bg-orange-600 rounded-lg hover:bg-orange-700
          items-center justify-center float-right text-xl font-bold text-white mx-2 my-4" onClick={() => {handleSubmitClick()}}>
          Submit
        </button>}
      </div>
    </div>
  );
}

export default DecisionCard;
