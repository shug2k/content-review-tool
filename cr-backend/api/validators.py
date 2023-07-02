from dataclasses import dataclass

from dacite import from_dict
from django.core.exceptions import ValidationError


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


class DecisionTreeValidator:
    @staticmethod
    def construct_tree_graph(tree: DecisionTree) -> dict[str, list[str]]:
        g = {}
        for question in tree.questions:
            g[question.tag] = []
            for answer in question.answers:
                if answer.next_question_tag:
                    g[question.tag].append(answer.next_question_tag)

        return g

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
        question_graph = DecisionTreeValidator.construct_tree_graph(tree_obj)

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
