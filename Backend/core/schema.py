import strawberry
from strawberry_django_jwt.middleware import (
    JSONWebTokenMiddleware,
    AsyncJSONWebTokenMiddleware,
)
from strawberry.tools import merge_types
from strawberry_django_plus.directives import SchemaDirectiveExtension
from strawberry_django_plus.optimizer import DjangoOptimizerExtension
from strawberry.extensions.tracing import ApolloTracingExtension
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

schema = strawberry.Schema(
    query=Queries,
    mutation=Mutations,
    extensions=[
        AsyncJSONWebTokenMiddleware,
        SchemaDirectiveExtension,
        DjangoOptimizerExtension,
        ApolloTracingExtension,
    ],
)
