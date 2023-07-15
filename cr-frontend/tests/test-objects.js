
export const yesAnswer = {
    tag: "yes",
    text: "Yes",
}

export const noAnswer = {
    tag: "no",
    text: "No",
}

export const yesAnswerEscalate = {
    tag: "yes",
    text: "Yes",
    next_question_tag: "escalate",
}

export const yesPastViolator = {
    tag: "yes",
    text: "Yes",
    next_question_tag: "is_violating_esc",
}

export const noPastViolator = {
    tag: "no",
    text: "No",
    next_question_tag: "is_violating_esc",
}

export const userPastViolatorQuestion = {
    tag: "is_past_violator",
    text: "Has this user violated in the past?",
    answers: [yesPastViolator, noPastViolator],
}

export const violatingQuestion = {
    tag: "is_violating",
    text: "Is this content violating?",
    answers: [yesAnswer, noAnswer],
}

export const violatingQuestionWithEscalate = {
    tag: "is_violating_esc",
    text: "Is this content violating?",
    answers: [yesAnswerEscalate, noAnswer],
}

export const escalationQuestion = {
    tag: "escalate",
    text: "Should this content be escalated?",
    answers: [yesAnswer, noAnswer],
}

export const basicDecisionTree = {
    start_question_tag: "is_violating",
    questions: [violatingQuestion],
}

export const escDecisionTree = {
    start_question_tag: "is_violating_esc",
    questions: [violatingQuestionWithEscalate, escalationQuestion],
}

export const pastViolatorDecisionTree = {
    start_question_tag: "is_past_violator",
    questions: [
        violatingQuestionWithEscalate,
        escalationQuestion,
        userPastViolatorQuestion
    ],
}