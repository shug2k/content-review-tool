import { handleSubmitClick, handleBackClick, handleNextClick } from "../app/review/utils/decisions";
import {
    yesAnswer,
    noAnswer,
    violatingQuestion,
    basicDecisionTree,
    escDecisionTree,
    yesAnswerEscalate,
    violatingQuestionWithEscalate, 
    escalationQuestion
} from "./test-objects";

global.fetch = jest.fn(() => Promise.resolve("OK"));

describe('submit click handler', () => {
    it('basic submission call', async () => {
        await handleSubmitClick(
            "1",
            [],
            violatingQuestion,
            noAnswer
        );

        expect(fetch).toBeCalled();
    });
});

describe('next click handler', () => {
    it('basic call', () => {
        const { updatedQuestionsWithAnswers, nextQuestion } = handleNextClick(
            [],
            escDecisionTree,
            violatingQuestionWithEscalate,
            yesAnswerEscalate
        );

        expect(updatedQuestionsWithAnswers).toStrictEqual([{ 
            questionTag: violatingQuestionWithEscalate.tag,  
            answerTag: yesAnswerEscalate.tag
        }]);
        expect(nextQuestion).toStrictEqual(escalationQuestion);
    })

    it('no next_question_tag - should throw', () => {
        expect(() => {
            handleNextClick(
                [],
                basicDecisionTree,
                violatingQuestion,
                yesAnswer
            )}
        ).toThrow()
    })

    it('next_question_tag does not exist in tree - should throw', () => {
        expect(() => {
            handleNextClick(
                [],
                basicDecisionTree,
                violatingQuestionWithEscalate,
                yesAnswerEscalate
            )}
        ).toThrow()
    })
});