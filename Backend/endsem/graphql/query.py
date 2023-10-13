import json
from typing import List
from strawberry.types import Info
import strawberry_django
from strawberry_django.filters import strawberry
from strawberry_django.permissions import IsAuthenticated
from strawberry_django.relay import sync_to_async
from endsem.graphql.permission import IsAEndSemFaculty, IsTheEndSemFaculty
from endsem.graphql.types import EndSemQuestionType, EndSemSubjectType
from endsem.models import EndSemQuestion, EndSemSubject
from questions.models import Course, Subject, Syllabus


@strawberry.type
class Query:
    @strawberry_django.field(extensions=[IsAuthenticated()])
    async def is_end_sem_faculty(self, info: Info) -> bool:
        return info.context.request.user.is_superuser or await EndSemSubject.objects.filter(faculties=info.context.request.user).aexists()

    @strawberry_django.field(extensions=[IsAEndSemFaculty()])
    async def get_end_sem_subjects(self, info: Info) -> List[EndSemSubjectType]:
        if info.context.request.user.is_superuser:
            return await sync_to_async(list)(EndSemSubject.objects.all())
        return await sync_to_async(list)(EndSemSubject.objects.filter(faculties=info.context.request.user))

    @strawberry_django.field(permission_classes=[IsTheEndSemFaculty])
    async def end_sem_questions(self, info: Info, subject: str) -> List[EndSemQuestionType]:
        return await sync_to_async(list)(EndSemQuestion.objects.filter(subject__subject__code=subject))

    @strawberry_django.field(permission_classes=[IsTheEndSemFaculty])
    async def end_sem_questions(self, info: Info, subject: str) -> List[EndSemQuestionType]:
        return await sync_to_async(list)(EndSemQuestion.objects.filter(subject__subject__code=subject))

    @strawberry_django.field(permission_classes=[IsTheEndSemFaculty])
    def generate_end_sem_questions(self, info: Info, subject: str) -> str:
        sub = Subject.objects.get(code=subject)
        questions = EndSemQuestion.objects.filter(
            subject__subject__code=subject
        )
        end_sem_subject = EndSemSubject.objects.get(subject=sub)

        data = {}
        question_counts = {'A': 0, 'B': 10, 'C': 15}

        get_roman = {
            1: "i",
            2: "ii",
            3: "iii",
        }

        for question in questions:
            part = chr(64 + question.part)

            # if part not in question_counts:
            #     vals = sum(question_counts.values())
            #     print("-------------------")
            #     print(question_counts.values())
            #     print(vals)
            #     print(end_sem_subject.counts[question.part - 1])
            #     print("-------------------")
            #     question_counts[part] = vals + end_sem_subject.counts[question.part - 1]

            number = question.number - question_counts[part]
            # number = question.number if part == 'A' else question.number - \
            #     question_counts[part]
            # sum(end_sem_subject.counts[:ord(part)-2])
            roman = question.roman

            if part not in data:
                data[part] = []

            try:
                if not data[part][number - 1]:
                    data[part].append([])
            except:
                data[part].append([])

            try:
                if not data[part][number - 1][roman - 1]:
                    data[part][number - 1].append([])
            except:
                data[part][number - 1].append([])

            data[part][number - 1][roman - 1].append({
                "number": question.number,
                "option": chr(64+question.roman) if end_sem_subject.choices[question.part-1] else None,
                "roman": get_roman[question.option] if end_sem_subject.choices[question.part-1] else None,
                "question": question.question,
                "answer": "",
                "btl": "",
                "co": "",
                "MarkAllocated": question.mark,
                "QPRef": []
            })

        syllabuses = Syllabus.objects.filter(
            course__semester=end_sem_subject.semester, lesson__subject=sub
        ).distinct("course", "lesson__subject")

        depts = syllabuses.values_list(
            "course__department__branch_code", flat=True
        )

        dept = syllabuses[0].course.department.branch

        regulation = Course.objects.filter(
            semester=end_sem_subject.semester
        ).first().regulation

        options = {
            "marks": end_sem_subject.marks,
            "counts": end_sem_subject.counts,
            "choices": end_sem_subject.choices,
            "subjectName": sub.subject_name,
            "subjectCode": sub.code,
            "subjectCO": sub.co,
            "objectives": [],
            "outcomes": [],
            "branch": "/".join(depts),
            "regulation": str(regulation),
            "dept": f"{'Common to ' + ' / '.join(depts) if len(depts) > 1 else dept}",
            "choosenQuestionIds": []
        }

        questionsData = {
            "questions": data,
            "options": options,
            "analytics": {}
        }

        return json.dumps(questionsData)
