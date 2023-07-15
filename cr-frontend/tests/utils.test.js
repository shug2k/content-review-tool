import { handleSubmitClick, handleBackClick, handleNextClick } from "../app/review/utils/decisions";
import { yesAnswer, noAnswer, violatingQuestion, basicDecisionTree } from "./test-objects";

global.fetch = jest.fn(() => Promise.resolve("OK"));

describe('submit click handler', () => {
    it('basic update', () => {
        handleSubmitClick(
            "1",
            [],
            violatingQuestion,
            yesAnswer
        );
    });
});

/*describe('next click handler', () => {
    it('basic update', () => {
        expect(handleNextClick(
            [],
            basicDecisionTree,
            violatingQuestion,
            yesAnswer
        )).toThrow()
    })
});*/