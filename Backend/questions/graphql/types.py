from strawberry_django.fields.types import JSON
from strawberry_django_plus import gql

@gql.type
class HelloType:
    message: JSON
