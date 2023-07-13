import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import mockRouter from 'next-router-mock';
import { act } from 'react-dom/test-utils';

import DecisionCard from '../app/review/components/decision-card';
import * as decisions from '../app/review/utils/decisions';

jest.mock('../app/review/utils/decisions');

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
  it('answers basic question', async () => {
    mockRouter.push("/review/1");
    render(
      <DecisionCard
        reviewId="1"
        decisionTree={basicDecisionTree}
      />
    );

    expect(screen.getByText("Is this content violating?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click yes, expect submit to show up, back and next to be hidden
    const yesRadio = screen.getByLabelText("Yes");
    act(() => fireEvent.click(yesRadio));

    await screen.findByText("Submit");
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();

    // click no, expect submit to stay up, back and next to be hidden
    const noRadio = screen.getByLabelText("No");
    act(() => fireEvent.click(noRadio));

    await screen.findByText("Submit");
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();

    expect(mockRouter).toMatchObject({ 
        pathname: "/review/1",
    });

    global.fetch = jest.fn(() => Promise.resolve("OK"));

    // click submit, expect redirect to '/'
    const submit = screen.getByText("Submit");
    act(() => {
      fireEvent.click(submit);
      expect(decisions.handleSubmitClick).toHaveBeenCalledWith(
        "1",
        [],
        violatingQuestion,
        noAnswer
      );
    });

    await waitFor(() => expect(mockRouter).toMatchObject({ 
        pathname: "/",
    }));
  });
});