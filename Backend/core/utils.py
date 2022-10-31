import base64
from typing import List
from asgiref.sync import sync_to_async
from django.db.models import QuerySet
from strawberry_django_plus import gql

from users.models import User


@sync_to_async
def get_current_user_from_info(info) -> User:
    if not info.context.request.user.is_authenticated:
        return None
    return info.context.request.user


async def get_lazy_query_set_as_list(query_set: QuerySet) -> List:
    list_coroutine = sync_to_async(list)
    return await list_coroutine(query_set)


def decode_id_from_gql_id(gql_id: gql.ID):
    return int(base64.b64decode(gql_id).decode().split(":")[1])
