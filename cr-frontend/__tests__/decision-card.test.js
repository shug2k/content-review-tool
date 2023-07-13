import '@testing-library/jest-dom';
import { render } from "@testing-library/react";
import DecisionCard from '../app/review/components/decision-card';

const yesAnswer = {
    tag: "yes",
    text: "Yes",
}

const noAnswer = {
    tag: "no",
    text: "No",
}

const violatingQuestion = {
    tag: "is_violating",
    text:"Is this content violating?",
    answers: [yesAnswer, noAnswer],
}

const basicDecisionTree = {
    start_question_tag: "is_violating",
    questions: [violatingQuestion],
};

describe('Decision card rendering', () => {
  it('renders basic question', () => {
    const { getByText } = render(
      <DecisionCard
        reviewId="1"
        decisionTree={basicDecisionTree}
      />
    );

    expect(getByText("Is this content violating?")).toBeInTheDocument();
  });
});