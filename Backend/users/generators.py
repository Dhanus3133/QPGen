from django.contrib.auth.hashers import make_password
import factory
import random
from .models import User

factory.Faker._DEFAULT_LOCALE = 'en_IN'

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    # username = factory.LazyAttributeSequence(
    #     lambda x, n: f'{x.first_name.lower()}{x.last_name.lower()}{n+random.randrange(1,100)}'
    # )
    email = factory.LazyAttributeSequence(
        lambda x, n: f'{x.first_name.lower()}{x.last_name.lower()}{n+random.randrange(1,100)}@gmail.com'
    )
    password = make_password('123')
