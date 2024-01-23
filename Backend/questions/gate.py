from questions.generate import Generate
import json


def combine_and_renumber_questions(data_sets):
    combined_questions = []
    question_number = 1

    for data in data_sets:
        for section in data['questions']:
            for question_list in data['questions'][section]:
                for question in question_list:
                    question[0]['number'] = question_number
                    combined_questions.append([[question[0]]])
                    question_number += 1

    return combined_questions


def generate_gate_questions(course, lids, marks, counts, choices, exam, use_ai, avoid_question_ids):
    data_sets = []
    options = {}
    for i in range(len(lids)):
        qD = Generate(
            course, lids[i], marks[i], counts[i], choices[i], exam, False, use_ai, avoid_question_ids, None
        ).generate_questions()
        qD = json.loads(qD)
        if isinstance(qD, dict):
            if i == 0 and 'options' in qD:
                options = qD.get('options')
        data_sets.append(qD)
    combined_questions = combine_and_renumber_questions(data_sets)
    questionsData = {
        "questions": {"A": combined_questions},
        "options": options,
        "analytics": {"co": {}, "btl": {}}
    }
    return json.dumps(questionsData)
