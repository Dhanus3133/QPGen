import factory
import factory.fuzzy
from faker import Faker

from users.models import User
from .models import BloomsTaxonomyLevel, Question, Lesson, MarkRange, Topic

faker = Faker()


def generate_question():
    return faker.sentence(nb_words=20)


class TopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Topic

    name = factory.Faker('sentence', nb_words=3)
    lesson = factory.fuzzy.FuzzyChoice(Lesson.objects.all())
    active = True


class QuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Question

    lesson = factory.fuzzy.FuzzyChoice(Lesson.objects.all())
    answer = factory.Faker('sentence', nb_words=50)
    mark = factory.fuzzy.FuzzyChoice(MarkRange.objects.all())
    question = factory.LazyAttribute(
        lambda x: f"({x.lesson.name}) = {x.mark.start} - {x.mark.end} -- {generate_question()}"
    )
    btl = factory.fuzzy.FuzzyChoice(BloomsTaxonomyLevel.objects.all())
    # topics = factory.RelatedFactoryList(TopicFactory, size=3)
    difficulty = factory.fuzzy.FuzzyChoice(['E', 'M', 'H'])
    created_by = factory.fuzzy.FuzzyChoice(User.objects.all())
