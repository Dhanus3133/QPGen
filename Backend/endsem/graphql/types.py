from typing import List
from strawberry.relay.types import GlobalID
import strawberry_django
from strawberry import relay
from strawberry import auto
from endsem.models import EndSemQuestion, EndSemSubject
from questions.graphql.types import BloomsTaxonomyLevelType, SubjectType
from questions.models import *
from users.graphql.types import UserType


@strawberry_django.type(EndSemSubject)
class EndSemSubjectType(relay.Node):
    id: GlobalID
    regulation: auto
    semester: auto
    subject: SubjectType
    faculties: List[UserType]
    marks: auto
    counts: auto
    choices: auto
    is_internal: auto
    is_external: auto


@strawberry_django.type(EndSemQuestion)
class EndSemQuestionType(relay.Node):
    id: GlobalID
    subject: EndSemSubjectType
    part: auto
    number: auto
    roman: auto
    option: auto
    question: auto
    answer: auto
    mark: auto
    btl: BloomsTaxonomyLevelType
    co: auto
