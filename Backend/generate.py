from questions.models import (
    BloomsTaxonomyLevel,
    Course,
    Lesson,
    Question,
    Subject,
    Syllabus,
)
from django.db.models import F, Q
import json
import random

# from django.db.models.query import sync_to_async
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
# django.setup()


def int_to_roman(number):
    num = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000]
    sym = ["i", "iv", "v", "ix", "x", "xl", "l", "xc", "c", "cd", "d", "cm", "m"]
    i = 12
    roman = ""
    while number:
        div = number // num[i]
        number %= num[i]
        while div:
            roman += sym[i]
            div -= 1
        i -= 1
    return roman


class Generate:
    def __init__(self, course, lids, marks, count, choices):
        self.course = Course.objects.get(id=course)
        self.lids = lids
        self.marks = marks
        self.count = count
        self.choices = choices
        self.questions = questions = (
            Question.objects.filter(lesson__in=lids)
            .select_related("lesson", "mark", "btl", "lesson__subject")
            .prefetch_related("topics")
        )
        self.choosen_questions = []
        self.co_analytics = {}
        self.btl_analytics = {}
        for btl in BloomsTaxonomyLevel.objects.all():
            self.btl_analytics[btl.name] = 0

    def find_a_question_with_exact_mark(self, lesson, mark, add_to_list):
        questions = (
            self.questions.filter(lesson=lesson)
            .exclude(id__in=self.choosen_questions)
            .filter(Q(start_mark__lte=mark) & Q(end_mark__gte=mark))
            .order_by("?")
        )
        if random.choice([True, False, False]):
            questions.order_by("-priority")

        question = questions.first()

        if question == None:
            return None
        if add_to_list:
            self.choosen_questions.append(question.id)
        return {"q": question, "m": mark}

    def find_a_question_with_exact_mark2(
        self, lesson, mark, add_to_list, tags, avoid_ids, difficulties
    ):
        questions = (
            self.questions.filter(lesson=lesson)
            .exclude(id__in=self.choosen_questions)
            .exclude(id__in=avoid_ids)
            .filter(Q(start_mark__lte=mark) & Q(end_mark__gte=mark))
            .order_by("?")
        )

        if random.choice([True, False, False]):
            questions.order_by("-priority")

        question = (
            questions.exclude(topics__in=tags)
            .exclude(difficulty__in=difficulties)
            .first()
        )
        if question == None:
            question = questions.first()
        if question == None:
            return None, None, tags, difficulties

        difficulties.append(question.difficulty.value)

        for topic in question.topics.all():
            if topic.id not in tags:
                tags.append(topic.id)

        return {"q": question, "m": mark}, question.id, tags, difficulties

    def get_different_questions(
        self, lesson, mark, start_mark_range, question_number, part, option=None
    ):
        selected = []
        start = start_mark_range
        end = mark - start_mark_range

        # difficulty_enum = {"E": 1, "M": 2, "H": 3}

        while start <= end:
            avoid_ids = []
            another = []
            difficulties = []

            res, id, t, difficulties = self.find_a_question_with_exact_mark2(
                lesson, start, False, [], avoid_ids, difficulties
            )
            another.append(res)
            avoid_ids.append(id)

            res, id, t, difficulties = self.find_a_question_with_exact_mark2(
                lesson, end, False, t, avoid_ids, difficulties
            )
            another.append(res)
            # avoid_ids.append(id)

            selected.append(another)
            start += 1
            end -= 1
        selected.append([self.find_a_question_with_exact_mark(lesson, mark, False)])
        selected.append([self.find_a_question_with_exact_mark(lesson, mark, False)])
        selected.append([self.find_a_question_with_exact_mark(lesson, mark, False)])
        question = random.choice(selected)
        # print(selected)
        while None in question and len(selected) > 0:
            # print(question)

            # while None in question and len(selected) > 0:
            #     for s in selected:
            #         if s != question:
            #             for q in s:
            #                 if q != None:
            #                     try:
            #                         self.choosen_questions.remove(q.id)
            #                     except:
            #                         pass
            selected.remove(question)
            question = random.choice(selected)

        for arr in question:
            self.choosen_questions.append(arr["q"].id)
            co = f"CO{Syllabus.objects.filter(course=self.course).get(lesson=lesson).unit}"
            if co not in self.co_analytics[part]:
                self.co_analytics[part][co] = 1
            else:
                self.co_analytics[part][co] += 1
            self.btl_analytics[arr["q"].btl.name] += 1
        if len(selected) == 0:
            # print(selected)
            print("No questions")
            return
        if option != None:
            option += 65

        questions = []
        for i in range(len(question)):
            dataQuestion = {}
            # print(f'\t{question_number}{chr(option) if option!=None else ""}. ', end='')
            # print(f'({int_to_roman(1+i)})' if option else '', end='')
            # print(question[i]['q'].question)
            dataQuestion["number"] = question_number
            dataQuestion["option"] = chr(option) if option != None else None
            dataQuestion["roman"] = int_to_roman(1 + i) if mark > 2 else None
            dataQuestion["question"] = question[i]["q"].question
            dataQuestion["btl"] = question[i]["q"].btl.name
            dataQuestion["co"] = (
                question[i]["q"].lesson.subject.co
                + "."
                + str(question[i]["q"].lesson.syllabuses.first().unit)
            )
            dataQuestion["MarkAllocated"] = question[i]["m"]
            prev = []
            # print("=====================")
            for i in question[i]["q"].previous_years.all():
                prev.append(f"{i.month} {i.year} ")
                # print(i.year)
            dataQuestion["QPRef"] = prev

            # print("=====================")
            # for i in question[i]['q'].previous_years.values('month', 'year'):
            #     print(i)
            # print("Previous Year: ", i)
            questions.append(dataQuestion)

        return questions

    def generate_questions(self):
        subject = Subject.objects.get(lessons=self.lids[0])
        question_number = 1
        data = {}
        for i in range(len(self.marks)):
            total_count = self.count[i]
            total_mark = self.marks[i]
            has_choice = self.choices[i]
            if has_choice:
                total_count *= 2
            part = chr(65 + i)
            data[part] = []
            questions = []
            self.co_analytics[part] = {}

            # print(f'================= Part {part} =================')
            current_count = 0
            for current_lesson in self.lids:
                for i in range(total_count // len(self.lids)):
                    questions.append(
                        self.get_different_questions(
                            current_lesson,
                            total_mark,
                            2 if total_mark == 2 else 3,
                            question_number,
                            part,
                            current_count % 2 if has_choice else None,
                        )
                    )
                    current_count += 1
                    if has_choice and current_count % 2 != 0:
                        question_number -= 1
                        # print("====== OR ======")
                    else:
                        data[part].append(questions)
                        questions = []
                    question_number += 1

            if current_count != total_count:
                for i in range(total_count - current_count):
                    questions.append(
                        self.get_different_questions(
                            random.choice(self.lids),
                            total_mark,
                            2 if total_mark == 2 else 3,
                            question_number,
                            part,
                            current_count % 2 if has_choice else None,
                        )
                    )
                    current_count += 1
                    if has_choice and current_count % 2 != 0:
                        question_number -= 1
                        # print("====== OR ======")
                    else:
                        data[part].append(questions)
                        questions = []
                    question_number += 1

                # print()

        objectives = list(
            Syllabus.objects.filter(course=self.course)
            .filter(lesson__in=self.lids)
            .order_by("unit")
            .values_list("lesson__objective", flat=True)
        )

        outcomes = list(
            list(
                Syllabus.objects.filter(course=1)
                .filter(lesson__in=self.lids)
                .order_by("unit")
                .values_list("lesson__outcome", "lesson__outcome_btl__name")
            )
        )

        depts = (
            Syllabus.objects.filter(
                course__semester=self.course.semester, lesson__subject=subject
            )
            .distinct("course", "lesson__subject")
            .values_list("course__department__branch_code", flat=True)
        )

        options = {
            "marks": self.marks,
            "counts": self.count,
            "choices": self.choices,
            "date": "21-02-2004",
            "subjectName": subject.subject_name,
            "subjectCode": subject.code,
            "subjectCO": subject.co,
            "objectives": objectives,
            "outcomes": outcomes,
            "branch": "/".join(depts),
        }
        analytics = {"co": self.co_analytics, "btl": self.btl_analytics}
        questionsData = {"questions": data, "options": options, "analytics": analytics}
        j = json.dumps(questionsData)
        return j


# generate_questions(lids, marks, count, choices)
