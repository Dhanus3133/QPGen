questions = [
  {
    id: "133",
    part: 1,
    number: 1,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 1",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "134",
    part: 1,
    number: 2,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 2",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "135",
    part: 1,
    number: 3,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 3",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "136",
    part: 1,
    number: 4,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 4",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "137",
    part: 1,
    number: 5,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 5",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "138",
    part: 1,
    number: 6,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 6",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "139",
    part: 1,
    number: 7,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 7",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "140",
    part: 1,
    number: 8,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 8",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "141",
    part: 1,
    number: 9,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 9",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "142",
    part: 1,
    number: 10,
    roman: 1,
    option: null,
    mark: 2,
    question: "Question 10",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "143",
    part: 2,
    number: 11,
    roman: 1,
    option: null,
    mark: 13,
    question: "Question 11",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "144",
    part: 2,
    number: 11,
    roman: 2,
    option: null,
    mark: 13,
    question: "Question 11",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "145",
    part: 2,
    number: 12,
    roman: 1,
    option: null,
    mark: 13,
    question: "Question 12",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "146",
    part: 2,
    number: 12,
    roman: 2,
    option: null,
    mark: 13,
    question: "Question 12",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "147",
    part: 2,
    number: 13,
    roman: 1,
    option: null,
    mark: 13,
    question: "Question 13",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "148",
    part: 2,
    number: 13,
    roman: 2,
    option: null,
    mark: 13,
    question: "Question 13",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "149",
    part: 2,
    number: 14,
    roman: 1,
    option: null,
    mark: 13,
    question: "Question 14",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "150",
    part: 2,
    number: 14,
    roman: 2,
    option: null,
    mark: 13,
    question: "Question 14",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "151",
    part: 2,
    number: 15,
    roman: 1,
    option: null,
    mark: 13,
    question: "Question 15",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "152",
    part: 2,
    number: 15,
    roman: 2,
    option: null,
    mark: 13,
    question: "Question 15",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "153",
    part: 3,
    number: 16,
    roman: 1,
    option: null,
    mark: 15,
    question: "Question 16",
    answer: null,
    __typename: "EndSemQuestionType",
  },
  {
    id: "154",
    part: 3,
    number: 16,
    roman: 2,
    option: null,
    mark: 15,
    question: "Question 16",
    answer: null,
    __typename: "EndSemQuestionType",
  },
];

const organizedQuestions = [];

questions.forEach((question) => {
  const { part, roman, option } = question;

  if (!organizedQuestions[part]) {
    organizedQuestions[part] = [];
  }

  if (roman !== null) {
    if (!organizedQuestions[part][roman]) {
      organizedQuestions[part][roman] = [];
    }

    if (option !== null) {
      if (!organizedQuestions[part][roman][option]) {
        organizedQuestions[part][roman][option] = [];
      }
      organizedQuestions[part][roman][option].push(question);
    } else {
      if (!organizedQuestions[part][roman][0]) {
        organizedQuestions[part][roman][0] = [];
      }
      organizedQuestions[part][roman][0].push(question);
    }
  } else {
    if (!organizedQuestions[part][0]) {
      organizedQuestions[part][0] = [];
    }

    if (option !== null) {
      if (!organizedQuestions[part][0][option]) {
        organizedQuestions[part][0][option] = [];
      }
      organizedQuestions[part][0][option].push(question);
    } else {
      if (!organizedQuestions[part][0][0]) {
        organizedQuestions[part][0][0] = [];
      }
      organizedQuestions[part][0][0].push(question);
    }
  }
});

console.log(organizedQuestions);
