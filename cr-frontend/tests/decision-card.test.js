import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import mockRouter from 'next-router-mock';
import { act } from 'react-dom/test-utils';

import DecisionCard from '../app/review/components/decision-card';
import { 
  noAnswer,
  noPastViolator,
  yesAnswerEscalate,
  escalationQuestion,
  userPastViolatorQuestion,
  violatingQuestion,
  violatingQuestionWithEscalate,
  basicDecisionTree,
  pastViolatorDecisionTree,
} from "./test-objects";

// test setup
jest.mock('../app/review/utils/decisions', () => {
  const originalModule = jest.requireActual('../app/review/utils/decisions');

  return {
    handleBackClick: originalModule.handleBackClick,
    handleNextClick: originalModule.handleNextClick,
    handleSubmitClick: jest.fn((reviewId, questionsWithAnswers, currentQuestion, currentAnswer) => {
      originalModule.handleSubmitClick(reviewId, questionsWithAnswers, currentQuestion, currentAnswer);
    }),
  };
});

global.fetch = jest.fn(() => Promise.resolve("OK"));
const mockHandleSubmitClick = require('../app/review/utils/decisions').handleSubmitClick;

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

    // click submit, expect redirect to '/'
    const submit = screen.getByText("Submit");
    act(() => {
      fireEvent.click(submit);
      expect(mockHandleSubmitClick).toHaveBeenCalledWith(
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

  it('testing more complex decision trees', async () => {
    mockRouter.push("/review/15");
    render(
      <DecisionCard
        reviewId="15"
        decisionTree={pastViolatorDecisionTree}
      />
    );

    expect(screen.getByText("Has this user violated in the past?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click no, expect next to show up, back and submit to be hidden
    const noRadio = screen.getByLabelText("No");
    act(() => fireEvent.click(noRadio));

    const next1 = await screen.findByText("Next");
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click next, expect back to show up, next and submit to be hidden
    act(() => fireEvent.click(next1));

    await screen.findByText("Is this content violating?");
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click yes, expect next to show up, submit to be hidden
    const yesRadio = screen.getByLabelText("Yes");
    act(() => fireEvent.click(yesRadio));

    const next2 = await screen.findByText("Next");
    expect(screen.queryByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Submit")).toBeNull();

    // click next, expect back to stay, next and submit to be hidden
    act(() => fireEvent.click(next2));

    await screen.findByText("Should this content be escalated?");
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click no, expect next to submit up, next to be hidden
    const noRadio2 = screen.getByLabelText("No");
    act(() => fireEvent.click(noRadio2));

    await screen.findByText("Submit");
    expect(screen.queryByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Next")).toBeNull();

    expect(mockRouter).toMatchObject({ 
        pathname: "/review/15",
    });

    // click submit, expect redirect to '/'
    const submit = screen.getByText("Submit");
    act(() => {
      fireEvent.click(submit);
      expect(mockHandleSubmitClick).toHaveBeenCalledWith(
        "15",
        [
          {
            questionTag: userPastViolatorQuestion.tag,
            answerTag: noPastViolator.tag,
          },
          {
            questionTag: violatingQuestionWithEscalate.tag,
            answerTag: yesAnswerEscalate.tag,
          },
        ],
        escalationQuestion,
        noAnswer
      );
    });

    await waitFor(() => expect(mockRouter).toMatchObject({ 
        pathname: "/",
    }));
  });

  it('testing back and forth', async () => {
    mockRouter.push("/review/30");
    render(
      <DecisionCard
        reviewId="30"
        decisionTree={pastViolatorDecisionTree}
      />
    );

    expect(screen.getByText("Has this user violated in the past?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click yes, expect next to show up, back and submit to be hidden
    const yesRadio = screen.getByLabelText("Yes");
    act(() => fireEvent.click(yesRadio));

    const next = await screen.findByText("Next");
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click next, expect back to show up, next and submit to be hidden
    act(() => fireEvent.click(next));

    await screen.findByText("Is this content violating?");
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click yes, expect next to show up, submit to be hidden
    const yesRadio2 = screen.getByLabelText("Yes");
    act(() => fireEvent.click(yesRadio2));

    await screen.findByText("Next");
    expect(screen.queryByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Submit")).toBeNull();

    // click back, expect next and submit to be hidden
    const back = screen.getByText("Back");
    act(() => fireEvent.click(back));

    await screen.findByText("Has this user violated in the past?");
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click no, expect next to show up, back and submit to be hidden
    const noRadio = screen.getByLabelText("No");
    act(() => fireEvent.click(noRadio));

    const next2 = await screen.findByText("Next");
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click next, expect back to show up, next and submit to be hidden
    act(() => fireEvent.click(next2));

    await screen.findByText("Is this content violating?");
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();

    // click no, expect back and submit to show up, next to be hidden
    const noRadio2 = screen.getByLabelText("No");
    act(() => fireEvent.click(noRadio2));

    await screen.findByText("Submit");
    expect(screen.queryByText("Back")).toBeInTheDocument();
    expect(screen.queryByText("Next")).toBeNull();

    expect(mockRouter).toMatchObject({ 
        pathname: "/review/30",
    });

    // click submit, expect redirect to '/'
    const submit = screen.getByText("Submit");
    act(() => {
      fireEvent.click(submit);
      expect(mockHandleSubmitClick).toHaveBeenCalledWith(
        "30",
        [
          {
            questionTag: userPastViolatorQuestion.tag,
            answerTag: noPastViolator.tag,
          },
        ],
        violatingQuestionWithEscalate,
        noAnswer
      );
    });

    await waitFor(() => expect(mockRouter).toMatchObject({ 
        pathname: "/",
    }));
  });
});