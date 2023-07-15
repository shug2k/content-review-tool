
export const yesAnswer = {
    tag: "yes",
    text: "Yes",
}

export const noAnswer = {
    tag: "no",
    text: "No",
}

export const violatingQuestion = {
    tag: "is_violating",
    text: "Is this content violating?",
    answers: [yesAnswer, noAnswer],
}

export const basicDecisionTree = {
    start_question_tag: "is_violating",
    questions: [violatingQuestion],
}