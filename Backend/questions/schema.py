from typing import List
from asgiref.sync import sync_to_async
import strawberry
from strawberry_django_plus import gql
from strawberry_django_plus.gql.django import mutation
from strawberry_django_plus.optimizer import DjangoOptimizerExtension
from strawberry_django_jwt.middleware import JSONWebTokenMiddleware, AsyncJSONWebTokenMiddleware
import strawberry_django_jwt.mutations as jwt_mutations
from strawberry_django_jwt.decorators import login_required
from questions import types

@gql.type
class Query:
    questions: List[types.Question] = gql.django.field()


@strawberry.type
# @gql.type
class Mutation:
    token_auth = jwt_mutations.ObtainJSONWebToken.obtain
    verify_token = jwt_mutations.Verify.verify
    refresh_token = jwt_mutations.Refresh.refresh
    delete_token_cookie = jwt_mutations.DeleteJSONWebTokenCookie.delete_cookie
    # token_auth = jwt_mutations.ObtainJSONWebTokenAsync.obtain
    # verify_token = jwt_mutations.VerifyAsync.verify
    # refresh_token = jwt_mutations.RefreshAsync.refresh
    # delete_token_cookie = jwt_mutations.DeleteJSONWebTokenCookieAsync.delete_cookie


schema = strawberry.Schema(
    query=Query, mutation=Mutation, extensions=[
        DjangoOptimizerExtension #, JSONWebTokenMiddleware, AsyncJSONWebTokenMiddleware
    ]
)
