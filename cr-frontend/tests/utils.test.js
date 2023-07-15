import { handleSubmitClick, handleBackClick, handleNextClick } from "../app/review/utils/decisions";
import {
    noAnswer,
    noPastViolator,
    yesAnswer,
    yesAnswerEscalate,
    escalationQuestion,
    userPastViolatorQuestion,
    violatingQuestion,
    violatingQuestionWithEscalate, 
    basicDecisionTree,
    escDecisionTree,
    pastViolatorDecisionTree,
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

    it('submission call with multiple answers', async () => {
        await handleSubmitClick(
            "15",
            [{ questionTag: violatingQuestionWithEscalate.tag, answerTag: yesAnswerEscalate.tag }],
            escalationQuestion,
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

    it('includes previous questions', () => {
        const { updatedQuestionsWithAnswers, nextQuestion } = handleNextClick(
            [{ questionTag: userPastViolatorQuestion.tag, answerTag: noPastViolator.tag }],
            pastViolatorDecisionTree,
            violatingQuestionWithEscalate,
            yesAnswerEscalate
        );

        expect(updatedQuestionsWithAnswers).toStrictEqual([
            { 
                questionTag: userPastViolatorQuestion.tag,  
                answerTag: noPastViolator.tag
            },
            { 
                questionTag: violatingQuestionWithEscalate.tag,  
                answerTag: yesAnswerEscalate.tag
            },
        ]);
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

describe('back click handler', () => {
    it('basic call', () => {
        const { updatedQuestionsWithAnswers, prevQuestion } = handleBackClick(
            [
                { 
                    questionTag: violatingQuestionWithEscalate.tag,
                    answerTag: yesAnswerEscalate.tag 
                },
            ],
            escDecisionTree,
        );

        expect(updatedQuestionsWithAnswers).toStrictEqual([]);
        expect(prevQuestion).toStrictEqual(violatingQuestionWithEscalate);
    })

    it('includes multiple previous questions', () => {
        const { updatedQuestionsWithAnswers, prevQuestion } = handleBackClick(
            [
                { 
                    questionTag: userPastViolatorQuestion.tag,
                    answerTag: noPastViolator.tag 
                },
                { 
                    questionTag: violatingQuestionWithEscalate.tag,
                    answerTag: yesAnswerEscalate.tag 
                },
            ],
            pastViolatorDecisionTree,
        );

        expect(updatedQuestionsWithAnswers).toStrictEqual([
            { 
                questionTag: userPastViolatorQuestion.tag,  
                answerTag: noPastViolator.tag
            },
        ]);
        expect(prevQuestion).toStrictEqual(violatingQuestionWithEscalate);
    })

    it('no previous question - should throw', () => {
        expect(() => {
            handleBackClick(
                [],
                basicDecisionTree,
            )}
        ).toThrow()
    })

    it('previous question does not exist in tree - should throw', () => {
        expect(() => {
            handleBackClick(
                [{ questionTag: userPastViolatorQuestion.tag, answerTag: noPastViolator.tag }],
                escDecisionTree,
            )}
        ).toThrow()
    })
});