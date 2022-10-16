from typing import List
from asgiref.sync import sync_to_async
from django.db.models import QuerySet

from users.models import User


@sync_to_async
def get_current_user_from_info(info) -> User:
    if not info.context.request.user.is_authenticated:
        return None
    user = info.context.request.user
    return user


async def get_lazy_query_set_as_list(query_set: QuerySet) -> List:
    list_coroutine = sync_to_async(list)
    return await list_coroutine(query_set)
