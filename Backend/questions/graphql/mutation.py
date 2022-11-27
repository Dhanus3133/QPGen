from strawberry_django_plus import gql

from questions.graphql.inputs import QuestionInput
from questions.graphql.types import QuestionType


@gql.type
class Mutation:
    create_question: QuestionType = gql.django.create_mutation(QuestionInput)
    # create_question: QuestionType = gql.django.create_mutation(QuestionInput)
    # create_question: QuestionType = gql.django.create_mutation(QuestionInput)
