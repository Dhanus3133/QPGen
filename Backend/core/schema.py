import strawberry
from strawberry.tools import merge_types
from strawberry_django.optimizer import Schema
from strawberry_django.optimizer import DjangoOptimizerExtension
from users.graphql.query import Query as UserQuery
from users.graphql.mutation import Mutation as UserMutation
from questions.graphql.query import Query as QuestionsQuery
from questions.graphql.mutation import Mutation as QuestionsMutation
from coe.graphql.query import Query as COEQuery

Queries = merge_types(
    "Queries",
    (
        UserQuery,
        QuestionsQuery,
        COEQuery,
    ),
)

Mutations = merge_types(
    "Mutations",
    (
        UserMutation,
        QuestionsMutation,
    ),
)

schema = Schema(
    query=Queries,
    mutation=Mutations,
    extensions=[
        # AsyncJSONWebTokenMiddle,
        # SchemaDirectiveExtension,
        DjangoOptimizerExtension,
        # ApolloTracingExtension,
    ],
)
