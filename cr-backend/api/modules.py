"""
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
"""

# this should probably eventually be a folder, but it only has a couple of functions
# so making a file for now

from dataclasses import dataclass


@dataclass
class Answer:
    tag: str
    text: str
    decision: str | None
    next_question_tag: str | None


@dataclass
class Question:
    tag: str
    text: str
    answers: list[Answer]


@dataclass
class DecisionTree:
    start_question_tag: str
    questions: list[Question]


@dataclass
class QuestionsWithAnswers:
    question_answer_map: dict[str, str]
    decisions: list[str]


def construct_tree_graph(tree: DecisionTree) -> dict[str, list[str]]:
    g = {}
    for question in tree.questions:
        g[question.tag] = []
        for answer in question.answers:
            if answer.next_question_tag:
                g[question.tag].append(answer.next_question_tag)

    return g


def convert_questions_with_answers(
    questions_with_answers_fe: list[dict[str, str]], tree: DecisionTree
) -> dict:
    pass
