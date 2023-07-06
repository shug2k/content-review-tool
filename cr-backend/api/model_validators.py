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

import validators

from dacite import from_dict
from django.core.exceptions import ValidationError
from .modules import DecisionTree, QuestionsWithAnswers, construct_tree_graph


class DecisionTreeValidator:
    @staticmethod
    @staticmethod
    def missing_questions(g: dict[str, list[str]]) -> list[str]:
        all_nodes = set([node for node in g.keys()])
        missing_nodes = set()

        for next_nodes in g.values():
            for next_node in next_nodes:
                if next_node not in all_nodes:
                    missing_nodes.add(next_node)

        return list(missing_nodes)

    @staticmethod
    def extra_questions(start_node: str, g: dict[str, list[str]]) -> list[str]:
        visited_nodes = set([start_node])

        for next_nodes in g.values():
            for next_node in next_nodes:
                visited_nodes.add(next_node)

        all_nodes = set([node for node in g.keys()])
        unconnected_nodes = []

        for node in all_nodes:
            if node not in visited_nodes:
                unconnected_nodes.append(node)

        return unconnected_nodes

    @staticmethod
    def topo_dfs(
        node: str, g: dict[str, list[str]], visited: set[str], stack: list[str]
    ) -> None:
        visited.add(node)
        next_nodes = g[node]

        for n in next_nodes:
            if n not in visited:
                DecisionTreeValidator.topo_dfs(n, g, visited, stack)

        stack.append(node)

    @staticmethod
    def topo_sort(start_node: str, g: dict[str, list[str]]) -> list[str]:
        visited = set()
        stack = []

        DecisionTreeValidator.topo_dfs(start_node, g, visited, stack)

        return list(reversed(stack))

    @staticmethod
    def has_cycle(start_node: str, g: dict[str, list[str]]) -> str | None:
        # check for self loops
        for node, next_nodes in g.items():
            for n_node in next_nodes:
                if n_node == node:
                    return node

        sorted_nodes = DecisionTreeValidator.topo_sort(start_node, g)

        node_set = set()
        for node in sorted_nodes:
            if node in node_set:
                return node

            node_set.add(node)

        return None

    @staticmethod
    def validate_tree(tree: dict) -> None:
        # check overall structure
        try:
            tree_obj = from_dict(data_class=DecisionTree, data=tree)
        except Exception as e:
            raise ValidationError(e)

        # check if questions have unique IDs
        question_set = set()
        for question in tree_obj.questions:
            if question.tag in question_set:
                raise ValidationError(
                    f"Question tag {question.tag} appears multiple times! Please make question tags unique in the tree"
                )

            question_set.add(question.tag)

            if len(question.answers) == 0:
                raise ValidationError(
                    f"Question {question.tag} has no answers! Please add answers to this question"
                )

            if len(question.text) == 0:
                raise ValidationError(
                    f"Question {question.tag} has no text! Please add text to this question"
                )

        # check if start question is in question set
        if tree_obj.start_question_tag not in question_set:
            raise ValidationError(
                f"Start question {tree_obj.start_question_tag} not in decision tree!"
            )

        # validate the graph for missing questions, extra questions, cycles
        question_graph = construct_tree_graph(tree_obj)

        missing_qs = DecisionTreeValidator.missing_questions(question_graph)

        if len(missing_qs) > 0:
            raise ValidationError(
                f"Questions {missing_qs} are linked in tree, but not defined!"
            )

        extra_qs = DecisionTreeValidator.extra_questions(
            tree_obj.start_question_tag, question_graph
        )

        if len(extra_qs) > 0:
            raise ValidationError(
                f"Questions f{extra_qs} are in tree, but cannot be reached!"
            )

        cycle_node = DecisionTreeValidator.has_cycle(
            tree_obj.start_question_tag, question_graph
        )
        if cycle_node is not None:
            raise ValidationError(
                f"Your decision tree has a cycle! Question {cycle_node} appears multiple times. Please remove any cycles"
            )


class ReviewValidator:
    @staticmethod
    def validate_entity_type_and_content(entity_type: str, entity_content: str) -> None:
        if entity_type == "image":
            is_url = validators.url(entity_content)
            if not is_url:
                raise ValidationError(
                    "For entity_type 'image', entity_content must be a valid URL!"
                )

    @staticmethod
    def validate_questions_with_answers(questions_with_answers: dict) -> None:
        # null or empty is valid here
        if questions_with_answers is None or len(questions_with_answers) == 0:
            return

        try:
            from_dict(data_class=QuestionsWithAnswers, data=questions_with_answers)
        except Exception as e:
            raise ValidationError(e)
