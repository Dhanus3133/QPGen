import requests
from endsem.models import EndSemQuestion, EndSemSubject
from questions.models import (
    Analysis,
    AnalysisBTL,
    BloomsTaxonomyLevel,
    Course,
    Exam,
    Lesson,
    Question,
    Subject,
    Syllabus,
)
from django.db.models import Count, F, Q, Value
from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models.functions import Concat
from django.conf import settings
import json
import random
import time

API_BASE_URL = f"https://api.cloudflare.com/client/v4/accounts/{settings.CLOUDFLARE_USER_ID }/ai/run/"
headers = {"Authorization": "Bearer " + settings.API_TOKEN, }


def run(model, inputs):
    input = {"messages": inputs}
    response = requests.post(
        f"{API_BASE_URL}{model}", headers=headers, json=input
    )
    return response.json()


def int_to_roman(number):
    num = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000]
    sym = ["i", "iv", "v", "ix", "x", "xl",
           "l", "xc", "c", "cd", "d", "cm", "m"]
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


def convert_to_percentage(data):
    result = {}

    for category, values in data.items():
        total = sum(values.values())
        percentages = {key: round((value / total) * 100, 2)
                       for key, value in values.items()}
        result[category] = percentages

    return result


def strip_options_from_question(question):
    lines = question.strip().split('\n')
    filtered_lines = []

    for line in lines:
        if not line.strip().lower().startswith(('a)', 'b)', 'c)', 'd)', 'a.', 'b.', 'c.', 'd.', '(a', '(b', '(c', '(d')):
            filtered_lines.append(line)
    while filtered_lines and not filtered_lines[-1].strip():
        filtered_lines.pop()
    return '\n'.join(filtered_lines)


get_topic_for_question = {
    1: "MCQ",
    2: "MCQ",
    3: "MCQ",
    4: "MCQ",
    5: "MCQ",
    6: "MCQ",
    7: "MSQ",
    8: "MSQ",
    9: "MSQ",
    10: "MSQ",
    11: "MSQ",
    12: "MSQ",
    13: "NAT",
    14: "NAT",
    15: "NAT",
    16: "NAT",
}


class Generate:
    def __init__(self, course, lids, marks, count, choices, exam, save_analysis, use_ai, avoid_question_ids, end_sem_sub=None):
        self.course = Course.objects.get(id=course)
        self.subject = Lesson.objects.get(id=lids[0]).subject
        self.lids = lids
        self.marks = marks
        count[0] = 16
        self.count = count
        self.choices = choices
        self.exam = exam
        self.save_analysis = save_analysis
        self.use_ai = use_ai
        self.end_sem_sub = EndSemSubject.objects.get(
            id=end_sem_sub) if end_sem_sub else None
        self.questions = (
            Question.objects.filter(lesson__in=lids)
            .exclude(id__in=avoid_question_ids)
            .select_related("lesson", "mark", "btl", "lesson__subject")
            .prefetch_related("topics")
        )
        self.choosen_questions = []
        self.choosen_topics = []
        self.co_analytics = {}
        self.btl_analytics = {}
        self.scenarios = []
        self.endsem_questions = []

        for btl in BloomsTaxonomyLevel.objects.all():
            self.btl_analytics[btl.name] = 0

        for mark in marks:
            if mark >= 15:
                self.scenarios.append([True])
            else:
                self.scenarios.append([True, False])

    def find_a_question_with_exact_mark(self, lesson, mark, is_scenario, add_to_list, is_avoid_topics):
        questions = (
            self.questions.filter(lesson=lesson)
            .exclude(id__in=self.choosen_questions)
            .exclude(topics__in=self.choosen_topics if is_avoid_topics else [])
            .filter(Q(start_mark__lte=mark) & Q(end_mark__gte=mark))
            .filter(scenario_based__in=is_scenario)
            .order_by("?")
        )

        if random.choice([True, False, False]):
            questions = questions.annotate(
                total=(F("priority") * 2) + Count("previous_years")
            ).order_by("-total", "-priority")
        question = questions.first()

        if question == None:
            return None
        if add_to_list:
            self.choosen_questions.append(question.id)
        return {"q": question, "m": mark}

    def find_a_question_with_exact_mark2(
        self, lesson, mark, is_scenario, add_to_list, tags, avoid_ids, difficulties, is_avoid_topics
    ):
        questions = (
            self.questions.filter(lesson=lesson)
            .exclude(id__in=self.choosen_questions)
            .exclude(id__in=avoid_ids)
            .filter(Q(start_mark__lte=mark) & Q(end_mark__gte=mark))
            .exclude(topics__in=self.choosen_topics if is_avoid_topics else [])
            .filter(Q(start_mark__lte=mark) & Q(end_mark__gte=mark))
            .filter(scenario_based__in=is_scenario)
            .order_by("?")
        )

        if random.choice([True, False, False]):
            questions = questions.annotate(
                total=(F("priority") * 2) + Count("previous_years")
            ).order_by("-total", "-priority")

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
        self, lesson, mark, start_mark_range, question_number, part, is_avoid_topics, option=None, scenario_retry=False
    ):
        selected = []
        start = start_mark_range
        end = mark - start_mark_range
        is_scenario = self.scenarios[ord(part) - 65]
        question = []

        if question_number <= 16:
            q = (
                self.questions.exclude(id__in=self.choosen_questions)
                .filter(topics__name__iexact=get_topic_for_question[question_number])
                .order_by("?")
                .first()
            )
            if q == None:
                raise Exception(
                    f"Questions are too less to generarte for the question number {question_number}: {get_topic_for_question[question_number]}"
                )
            question = [{"q": q, "m": 2}]
        else:
            if scenario_retry:
                is_scenario = [True, False]

            while start <= end:
                avoid_ids = []
                another = []
                difficulties = []

                res, id, t, difficulties = self.find_a_question_with_exact_mark2(
                    lesson, start, is_scenario, False, [], avoid_ids, difficulties, is_avoid_topics,
                )
                another.append(res)
                avoid_ids.append(id)

                res, id, t, difficulties = self.find_a_question_with_exact_mark2(
                    lesson, end, is_scenario, False, t, avoid_ids, difficulties, is_avoid_topics
                )
                another.append(res)

                selected.append(another)
                start += 1
                end -= 1
            selected.append([
                self.find_a_question_with_exact_mark(
                    lesson, mark, is_scenario, False, is_avoid_topics
                )
            ])
            selected.append([
                self.find_a_question_with_exact_mark(
                    lesson, mark, is_scenario, False, is_avoid_topics
                )
            ])
            selected.append([
                self.find_a_question_with_exact_mark(
                    lesson, mark, is_scenario, False, is_avoid_topics
                )
            ])
            question = random.choice(selected)
            # print(selected)
            while None in question and len(selected) > 0:
                selected.remove(question)

                if len(selected) == 0:
                    if is_avoid_topics:
                        return self.get_different_questions(
                            lesson, mark, start_mark_range, question_number, part, False, option, scenario_retry
                        )
                    if not scenario_retry:
                        return self.get_different_questions(
                            lesson, mark, start_mark_range, question_number, part, is_avoid_topics, option, True
                        )
                    raise Exception(
                        f"Questions are too less to generarte for {Subject.objects.get(lessons=self.lids[0]).subject_name} - {Lesson.objects.get(id=lesson).name}"
                    )
                question = random.choice(selected)

            if self.use_ai:
                for i in range(len(question)):
                    if question[i]['q'].mark.start != 2:
                        inputs = [
                            {
                                "role": "system",
                                "content": "Enhance the depth of thinking in the following question without introducing scenarios unless the original question was scenario-based. Maintain a similar size. Avoid providing answers or hints. If the question is mathematical in nature, please retain the original question without any modifications."
                            },
                            {"role": "user", "content": json.dumps(
                                question[i]["q"].question
                            )},
                            {"role": "assistant",
                             "content": "The output should be a single rewritten question and there should no further conversation. Question should be"}
                        ]
                        output = run("@cf/meta/llama-2-7b-chat-int8", inputs)
                        try:
                            question[i]["q"].question = json.loads(
                                output['result']['response']
                            )
                            time.sleep(5)
                        except Exception as e:
                            print(f"AIERROR: {output}")
                            print(f"Error message: {str(e)}")

        for arr in question:
            self.choosen_questions.append(arr["q"].id)

            if arr['q'].mark.start != 2:
                for t in arr['q'].topics.all():
                    if t.id not in self.choosen_topics:
                        self.choosen_topics.append(t.id)

            co = ""
            try:
                co = f"CO{Syllabus.objects.filter(course=self.course).get(lesson=lesson).unit}" if not self.end_sem_sub else ""
            except:
                pass
            if co not in self.co_analytics:
                self.co_analytics[co] = 0
            else:
                self.co_analytics[co] += 1
            self.btl_analytics[arr["q"].btl.name] += 1

        if option != None:
            option += 65

        questions = []
        for i in range(len(question)):
            if self.end_sem_sub:
                self.endsem_questions.append(
                    EndSemQuestion(
                        subject=self.end_sem_sub,
                        part=ord(part) - 64,
                        number=question_number,
                        roman=option-64 if option != None else 1,
                        option=1+i,
                        question=question[i]["q"].question,
                        answer=question[i]["q"].answer,
                        mark=question[i]["m"]
                    )
                )
            dataQuestion = {}
            # print(f'\t{question_number}{chr(option) if option!=None else ""}. ', end='')
            # print(f'({int_to_roman(1+i)})' if option else '', end='') print(question[i]['q'].question)
            dataQuestion["number"] = question_number
            dataQuestion["option"] = chr(option) if option != None else None
            dataQuestion["roman"] = int_to_roman(1 + i) if mark > 2 else None
            dataQuestion["question"] = question[i]["q"].question
            dataQuestion["answer"] = question[i]["q"].answer
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
                prev.append(f"{i.month} {i.year % 100} ")
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

            # print(f'================= Part {part} =================')
            current_count = 0
            for current_lesson in self.lids:
                for i in range(total_count // len(self.lids)):
                    questions.append(
                        self.get_different_questions(
                            current_lesson,
                            total_mark,
                            total_mark if total_mark <= 2 else 3,
                            question_number,
                            part,
                            [True],
                            current_count % 2 if has_choice else None,
                            False
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
                            total_mark if total_mark <= 2 else 3,
                            question_number,
                            part,
                            [True],
                            current_count % 2 if has_choice else None,
                            False
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
            .filter(lesson__subject=self.subject)
            .order_by("unit")
            .values_list("lesson__objective", flat=True)
        )

        outcomes = list(
            Syllabus.objects.filter(course=self.course).filter(
                lesson__subject=self.subject
            ).order_by("unit")
            .values("lesson__outcome").annotate(
                all_btl_names=ArrayAgg(
                    Concat("lesson__outcome_btl__name", Value("")), distinct=True
                )
            ).values_list("lesson__outcome", "all_btl_names")
        )

        syllabuses = Syllabus.objects.filter(
            course__semester=self.course.semester, lesson__subject=subject
        ).distinct("course", "lesson__subject")

        depts = syllabuses.values_list(
            "course__department__branch_code", flat=True
        )

        dept = syllabuses[0].course.department.branch if len(
            depts) > 0 else self.course.department.branch

        options = {
            "marks": self.marks,
            "counts": self.count,
            "choices": self.choices,
            "subjectName": subject.subject_name,
            "subjectCode": subject.code,
            "subjectCO": subject.co,
            "objectives": objectives,
            "outcomes": outcomes,
            "branch": "/".join(depts),
            "regulation": self.course.regulation.year,
            "dept": f"{'Common to ' + ' / '.join(depts) if len(depts) > 1 else dept}",
            "choosenQuestionIds": self.choosen_questions,
        }

        try:
            analytics = convert_to_percentage(
                {"co": self.co_analytics, "btl": self.btl_analytics}
            )
        except:
            analytics = {"co": self.co_analytics, "btl": self.btl_analytics}
        questionsData = {"questions": data,
                         "options": options, "analytics": analytics}
        j = json.dumps(questionsData)
        if self.end_sem_sub:
            EndSemQuestion.objects.bulk_create(self.endsem_questions)
        if self.save_analysis:
            analysis, _ = Analysis.objects.update_or_create(
                subject=subject,
                exam=Exam.objects.get(id=self.exam)
            )
            analysis.courses.set(syllabuses.values_list("course", flat=True))
            analysis_btls = []
            for btl in BloomsTaxonomyLevel.objects.all():
                analysis_btls.append(
                    AnalysisBTL(
                        analysis=analysis,
                        btl=btl,
                        percentage=analytics['btl'][btl.name]
                    )
                )
            AnalysisBTL.objects.bulk_create(objs=analysis_btls)

        return j
