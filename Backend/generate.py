from questions.models import Lesson, Question, Subject
from django.db.models import F, Q
import json
import yaml
import os
import django
import random

# from django.db.models.query import sync_to_async
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
# django.setup()


# choosen_questions = []

# lids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
# questions = Question.objects.filter(lesson__in=lids).select_related(
#     'lesson', 'mark', 'btl', 'lesson__subject')
# questions = Question.objects.all().select_related(
#     'lesson', 'mark', 'btl', 'lesson__subject'
# )


# @sync_to_async
def int_to_roman(number):
    num = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000]
    sym = ["i", "iv", "v", "ix", "x", "xl",
           "l", "xc", "c", "cd", "d", "cm", "m"]
    i = 12
    roman = ''
    while number:
        div = number // num[i]
        number %= num[i]
        while div:
            roman += sym[i]
            div -= 1
        i -= 1
    return roman


class Generate:
    def __init__(self, lids, marks, count, choices):
        self.lids = lids
        self.marks = marks
        self.count = count
        self.choices = choices
        self.questions = questions = Question.objects.filter(lesson__in=lids).select_related(
            'lesson', 'mark', 'btl', 'lesson__subject'
        )
        self.choosen_questions = []

    def find_a_question_with_exact_mark(self, lesson, mark, add_to_list):
        question = self.questions.filter(lesson=lesson).exclude(id__in=self.choosen_questions).filter(
            Q(start_mark__lte=mark) & Q(end_mark__gte=mark)
        ).order_by('?').first()
        if question == None:
            return None
        if add_to_list:
            self.choosen_questions.append(question.id)
        return {"q": question, "m": mark}

    def get_different_questions(self, lesson, mark, start_mark_range, question_number, option=None):
        selected = []
        start = start_mark_range
        end = mark - start_mark_range

        while(start <= end):
            another = []
            another.append(
                self.find_a_question_with_exact_mark(lesson, end, True))
            another.append(
                self.find_a_question_with_exact_mark(lesson, start, True))
            selected.append(another)
            start += 1
            end -= 1
        selected.append(
            [self.find_a_question_with_exact_mark(lesson, mark, True)])
        selected.append(
            [self.find_a_question_with_exact_mark(lesson, mark, True)])
        selected.append(
            [self.find_a_question_with_exact_mark(lesson, mark, True)])
        question = random.choice(selected)
        while None in question and len(selected) > 0:
            for s in selected:
                if s != question:
                    for q in s:
                        if q != None:
                            try:
                                self.choosen_questions.remove(q.id)
                            except:
                                pass
            selected.remove(question)
            question = random.choice(selected)

        if len(selected) == 0:
            print(selected)
            print("No questions")
            return
        if option != None:
            option += 65
        # if len(question) > 1:

        questions = []
        for i in range(len(question)):
            dataQuestion = {}
            print(
                f'\t{question_number}{chr(option) if option!=None else ""}. ', end='')
            print(f'({int_to_roman(1+i)})' if option else '', end='')
            print(question[i]['q'].question)
            dataQuestion['number'] = question_number
            dataQuestion['option'] = chr(option) if option != None else None
            dataQuestion['roman'] = int_to_roman(1+i) if mark > 2 else None
            dataQuestion['question'] = question[i]['q'].question
            dataQuestion['btl'] = question[i]['q'].btl.name
            dataQuestion['co'] = question[i]['q'].lesson.subject.co + \
                '.' + str(question[i]['q'].lesson.syllabuses.first().unit)
            prev = []
            for i in question[i]['q'].previous_years.all():
                prev.append(str(i))
            dataQuestion['QPRef'] = prev
            dataQuestion['MarkAllocated'] = question[i]['m']
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
            part = chr(65+i)
            data[part] = []
            questions = []
            print(f'================= Part {part} =================')
            current_count = 0
            for current_lesson in self.lids:
                for i in range(total_count//len(self.lids)):
                    questions.append(self.get_different_questions(
                        current_lesson,
                        total_mark,
                        2 if total_mark == 2 else 3,
                        question_number,
                        current_count % 2 if has_choice else None
                    ))
                    current_count += 1
                    if (has_choice and current_count % 2 != 0):
                        question_number -= 1
                        print("====== OR ======")
                    else:
                        data[part].append(questions)
                        questions = []
                    question_number += 1

            if current_count != total_count:
                for i in range(total_count-current_count):
                    questions.append(self.get_different_questions(
                        random.choice(self.lids),
                        total_mark,
                        2 if total_mark == 2 else 3,
                        question_number,
                        current_count % 2 if has_choice else None
                    ))
                    current_count += 1
                    if (has_choice and current_count % 2 != 0):
                        question_number -= 1
                        print("====== OR ======")
                    else:
                        data[part].append(questions)
                        questions = []
                    question_number += 1

            print()
        options = {
            "marks": self.marks,
            "counts": self.count,
            "choices": self.choices,
            "date": "21-02-2004",
            "subjectName": subject.subject_name,
            "subjectCode": subject.code,
        }
        questionsData = {"questions": data, "options": options}
        j = json.dumps(questionsData)
        print(j)
        print(len(questions))
        return j


# generate_questions(lids, marks, count, choices)

# def get_different_questions(lesson, mark, start_mark_range):
# filtered_questions = questions.filter(lesson=lesson).filter(
#     Q(start_mark__gte=start_mark_range) | Q(end_mark__lte=start_mark_range)
# ).filter(end_mark__lte=mark+1)

# filtered_questions_lesson = questions.filter(lesson=lesson)
# filtered_questions = filtered_questions_lesson.filter(start_mark__gte=start_mark_range).filter(end_mark__lte=mark+1)
# filtered_questions.union(filtered_questions_lesson.filter(end_mark=start_mark_range))
#
# filtered_questions.union(filtered_questions_lesson.filter(end_mark=start_mark_range))

# print(filtered_questions)
# lst = []
# for q in filtered_questions:
#     ans = f'{q.start_mark, q.end_mark}'
#     if ans not in lst:
#         print(ans)
#         lst.append(ans)


# get_different_questions(4, 15, 11)

# def get_different_questions_with_start_mark_end_range(lesson, start_range, end_mark):
#     return questions.filter(lesson=lesson).exclude(id__in=choosen_questions).exclude(start_mark=start_range).filter(start_mark__gte=start_range+1)#.filter(end_mark__lte=end_mark+1)
#
#
#
# def get_different_questions_with_exact_mark(lesson, mark, mark_start_range):
#     filtered_questions = get_different_questions_with_start_mark_end_range(lesson, mark_start_range, mark)
#
#     lst = []
#     for q in filtered_questions:
#         ans = f'{q.start_mark, q.end_mark}'
#         if ans not in lst:
#             print(ans)
#             lst.append(ans)
#
# get_different_questions_with_exact_mark(1, 15, 11);
# print("==============================================")
# get_different_questions_with_exact_mark(1, 3, 2);


# def find_a_question_with_less_mark(lesson, mark,exclude_marks):
#     question = questions.filter(lesson=lesson).exclude(id__in=choosen_questions)
#     question = question.filter(end_mark__lte=mark+1)
#
#     for excluded_mark in exclude_marks:
#     # BUG: Still buggy
#         question = question.exclude(
#             Q(start_mark__lte=excluded_mark) & Q(end_mark__gte=excluded_mark)
#         )
#
#     for q in question:
#         print(q.start_mark, q.end_mark)

# question = question.filter(end_mark__lte=mark+1).order_by('?')

# print(question)
# choosen_questions.append(question.id)

# if question.end_mark >= mark: # TODO: Bug here for the exclude_marks not considering for the list, implemented by int only for now
# return question.id, random.choice(range(question.start_mark, mark+1))
# return question.id, random.choice(range(question.start_mark, question.end_mark+1))

# print(find_a_question_with_less_mark(1, 8, [2, 5, 6, 7]))
# def get_(lesson, mark, 8):


# def generate_12_m(lesson, count, choice):
#     print(
#         Question.objects
#         .filter(lesson=lesson, start_mark=[0], end_mark=marks[0])
#         .order_by('?')  # .count()
#         [:count[0]]
#     )


# generate_12_m(1, 3, True)

    # for i in range(len(marks)):
    # print(
    #     Question.objects
    #     .filter(lesson=lids[0], start_mark=marks[0], end_mark=marks[0])
    #     .order_by('?')#.count()
    #     [:count[0]]
    # )
    # print(Question.objects.filter())


# generate_questions(lids, marks, count, choices)
