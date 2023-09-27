from strawberry.tools import merge_types
from strawberry_django.optimizer import Schema
from strawberry_django.optimizer import DjangoOptimizerExtension
from strawberry.extensions.tracing import ApolloTracingExtension
from users.graphql.query import Query as UserQuery
from users.graphql.mutation import Mutation as UserMutation
from questions.graphql.query import Query as QuestionsQuery
from questions.graphql.mutation import Mutation as QuestionsMutation
from coe.graphql.query import Query as COEQuery
from endsem.graphql.query import Query as EndSemQuery
from endsem.graphql.mutation import Mutation as EndSemMutation

Queries = merge_types(
    "Queries",
    (
        UserQuery,
        QuestionsQuery,
        COEQuery,
        EndSemQuery,
    ),
)

Mutations = merge_types(
    "Mutations",
    (
        UserMutation,
        QuestionsMutation,
        EndSemMutation,
    ),
)

schema = Schema(
    query=Queries,
    mutation=Mutations,
    extensions=[
        DjangoOptimizerExtension,
        ApolloTracingExtension,
    ],
)
