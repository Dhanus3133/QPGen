from typing import List
from strawberry_django.fields.types import JSON
from strawberry_django_plus import gql
from questions.models import BloomsTaxonomyLevel, Course, Degree, Department, FacultiesHandling, Lesson, MarkRange, PreviousYearsQP, Programme, Question, Regulation, Subject, Syllabus

from users.graphql.types import UserType


@gql.type
class HelloType:
    message: JSON


@gql.django.type(BloomsTaxonomyLevel)
class BloomsTaxonomyLevelType(gql.Node):
    id: gql.auto
    name: gql.auto
    description: gql.auto


@gql.django.type(PreviousYearsQP)
class PreviousYearsQPType(gql.Node):
    id: gql.auto
    month: gql.auto
    year: gql.auto


@gql.django.type(Programme)
class ProgrammeType(gql.Node):
    id: gql.auto
    name: gql.auto


@gql.django.type(Degree)
class DegreeType(gql.Node):
    id: gql.auto
    name: gql.auto
    full_form: gql.auto


@gql.django.type(Regulation)
class RegulationType(gql.Node):
    id: gql.auto
    year: gql.auto


@gql.django.type(Department)
class DepartmentType(gql.Node):
    id: gql.auto
    programme: ProgrammeType
    degree: DegreeType
    branch: gql.auto
    branch_code: gql.auto
    hod: UserType


@gql.django.type(Subject)
class SubjectType(gql.Node):
    id: gql.auto
    code: gql.auto
    subject_name: gql.auto
    co: gql.auto
    co_description: gql.auto
    course_outcome: gql.auto
    coe: List[UserType]


@gql.django.type(Lesson)
class LessonType(gql.Node):
    id: gql.auto
    name: gql.auto
    subject: SubjectType


@gql.django.type(Course)
class CourseType(gql.Node):
    id: gql.auto
    regulation: RegulationType
    semester: gql.auto
    department: DepartmentType
    active: gql.auto


@gql.django.type(Syllabus)
class SyllabusType(gql.Node):
    id: gql.auto
    course: CourseType
    unit: gql.auto
    lesson: LessonType


@gql.django.type(MarkRange)
class MarkRangeType(gql.Node):
    id: gql.auto
    start: gql.auto
    end: gql.auto


@gql.django.type(FacultiesHandling)
class FacultiesHandlingType(gql.Node):
    id: gql.auto
    course: CourseType
    subject: SubjectType
    faculties: List[UserType]


@gql.django.type(Question)
class QuestionType(gql.Node):
    id: gql.auto
    slug: gql.auto
    lesson: LessonType
    question: gql.auto
    answer: gql.auto
    mark: MarkRangeType
    start_mark: gql.auto
    end_mark: gql.auto
    btl: BloomsTaxonomyLevelType
    difficulty: gql.auto
    created_by: UserType
    previous_years: List[PreviousYearsQPType]
    created_at: gql.auto
    updated_at: gql.auto
