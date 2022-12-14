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

    def find_a_question_with_exact_mark2(self, lesson, mark, add_to_list, avoid_ids):
        question = self.questions.filter(lesson=lesson).exclude(id__in=self.choosen_questions).exclude(id__in=avoid_ids).filter(Q(start_mark__lte=mark) & Q(end_mark__gte=mark)
        ).order_by('?').first()
        if question == None:
            return None, None
        # if add_to_list:
        #     self.choosen_questions.append(question.id)
        return {"q": question, "m": mark}, question.id


    def get_different_questions(self, lesson, mark, start_mark_range, question_number, option=None):
        selected = []
        start = start_mark_range
        end = mark - start_mark_range

        while(start <= end):
            avoid_ids = []
            another = []

            res, id = self.find_a_question_with_exact_mark2(lesson, start, False, avoid_ids)
            another.append(res)
            avoid_ids.append(id)

            res, id = self.find_a_question_with_exact_mark2(lesson, end, False, avoid_ids)
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
            # print("==Start==")
            # print(arr)
            # print("==End==")
            # for q in arr['q']:
                self.choosen_questions.append(arr['q'].id)

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
            # print(f'\t{question_number}{chr(option) if option!=None else ""}. ', end='')
            # print(f'({int_to_roman(1+i)})' if option else '', end='')
            # print(question[i]['q'].question)
            dataQuestion['number'] = question_number
            dataQuestion['option'] = chr(option) if option != None else None
            dataQuestion['roman'] = int_to_roman(1+i) if mark > 2 else None
            dataQuestion['question'] = question[i]['q'].question
            dataQuestion['btl'] = question[i]['q'].btl.name
            dataQuestion['co'] = question[i]['q'].lesson.subject.co + \
                '.' + str(question[i]['q'].lesson.syllabuses.first().unit)
            dataQuestion['MarkAllocated'] = question[i]['m']
            prev = []
            # print("=====================")
            for i in question[i]['q'].previous_years.all():
                prev.append(f"{i.month} {i.year} ")
                # print(i.year)
            dataQuestion['QPRef'] = prev

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
            part = chr(65+i)
            data[part] = []
            questions = []
            # print(f'================= Part {part} =================')
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
                        # print("====== OR ======")
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
                        # print("====== OR ======")
                    else:
                        data[part].append(questions)
                        questions = []
                    question_number += 1

            # print()
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
        # print(len(questions))
        return j


# generate_questions(lids, marks, count, choices)
