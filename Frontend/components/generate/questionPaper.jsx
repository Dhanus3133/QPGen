import { generateQuestionsQuery } from "@/src/graphql/queries/generateQuestions";
import { romanize } from "@/src/utils";
import { useQuery } from "@apollo/client";

const QuestionPaper = ({
  lids,
  marks,
  counts,
  choices,
  semester,
  total,
  time,
}) => {
  const { data, loading, error } = useQuery(generateQuestionsQuery, {
    variables: { lids, marks, counts, choices },
    // variables: { lids: lids, marks: marks, counts: counts, choices: choices },
  });

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  const generatedData = JSON.parse(data["generateQuestions"]);
  const options = generatedData["options"];
  const b = generatedData["questions"];

  // console.log("Part-{i}-(x2=10 marks)");

  // return <h2>Hello world</h2>;
  let courseObjective = {
    1: {
      cono: 1,
      text: "To understand the basics of algorithmic notion",
    },
    2: {
      cono: 2,
      text: "To understand and apply the algorithm analysis techniques.",
    },
    3: {
      cono: 3,
      text: "To critically analyze the efficiency of alternative algorithmic solutions for the same",
    },
    4: {
      cono: 4,
      text: "To understand different algorithm design techniques.",
    },
    5: {
      cono: 5,
      text: "	To understand the limitations of Algorithmic power.",
    },
  };
  let co = [];
  let a;
  for (let i = 1; i <= 5; i++) {
    a = (
      <tr>
        <td className="text-center">{courseObjective[i].cono}</td>
        <td className="pl-2">{courseObjective[i].text}</td>
      </tr>
    );
    co.push(a);
  }

  //------------------------------------
  //------------------------------------COURSE OUTCOMES

  let courseOutcomes = {
    1: {
      cono: "C123.1",
      text: "To understand the basics of algorithmic notion",
    },
    2: {
      cono: "C123.2",
      text: "To understand and apply the algorithm analysis techniques.",
    },
    3: {
      cono: "C123.3",
      text: "To critically analyze the efficiency of alternative algorithmic solutions for the same",
    },
    4: {
      cono: "C123.4",
      text: "To understand different algorithm design techniques.",
    },
    5: {
      cono: "C123.5",
      text: "	To understand the limitations of Algorithmic power.",
    },
  };
  let cout = [];
  for (let i in courseOutcomes) {
    a = (
      <tr>
        <td className="text-center">{courseOutcomes[i].cono}</td>
        <td className="pl-2">{courseOutcomes[i].text}</td>
      </tr>
    );
    cout.push(a);
  }

  //------------------------------------
  //------------------------------------LOGIC FOR CHOICE CALCULATOR

  function getRoman(i) {
    let roman = {};
    for (let j of i) {
      for (let k of j) {
        if (roman.hasOwnProperty(k["option"])) {
          roman[k["option"]] += 1;
        } else {
          roman[k["option"]] = 1;
        }
      }
    }
    return roman;
  }
  function getArrayLength(i) {
    let arrlen = 0;
    for (let j of i) {
      for (let k of j) {
        arrlen++;
      }
    }
    return arrlen;
  }
  //------------------------------------
  //------------------------------------LOGIC FOR DYNAMIC QUESTION PAPER
  let store = [];
  let q;
  let final = "";
  let questions = [];
  let opt;
  let optsel = 0,
    subdivsel = 0;
  for (let i in b) {
    for (let j of b[i]) {
      let r = getRoman(j);
      let option = "A";
      let arrlen = getArrayLength(j);
      for (let k of j) {
        for (let l of k) {
          if (Object.keys(r).length == 1) {
            if (r[null] == 1) {
              if (l["roman"] === null) {
                q = (
                  <tr>
                    <td className="style-2 text-center" rowSpan={r[null]}>
                      {l["number"]}
                    </td>
                    <td className="pl-2">{l["question"]}</td>
                    <td className="px-2 text-center">{l["co"]}</td>
                    <td className="px-2 text-center">{l["btl"]}</td>
                    <td className="px-2 text-center">{l["QPRef"]}</td>
                  </tr>
                );
                store.push(q);
              } else {
                q = (
                  <tr>
                    <td className="style-2 text-center" rowSpan={r[null]}>
                      {l["number"]}
                    </td>
                    <td className="style-2 text-center">{l["roman"]}</td>
                    <td className="pl-2">{l["question"]}</td>
                    <td className="px-2 text-center">{l["co"]}</td>
                    <td className="px-2 text-center">{l["btl"]}</td>
                    <td className="px-2 text-center">{l["QPRef"]}</td>
                    <td className="px-2 text-center">{l["MarkAllocated"]}</td>
                  </tr>
                );
                store.push(q);
              }
            } else if (r[null] > 1) {
              subdivsel = 1;
              if (l["roman"] === "i") {
                q = (
                  <tr>
                    <td className="style-2 text-center" rowSpan={r[null]}>
                      {l["number"]}
                    </td>
                    <td className="style-2 text-center">{l["roman"]}</td>
                    <td className="pl-2">{l["question"]}</td>
                    <td className="px-2 text-center">{l["co"]}</td>
                    <td className="px-2 text-center">{l["btl"]}</td>
                    <td className="px-2 text-center">{l["QPRef"]}</td>
                    <td className="px-2 text-center">{l["MarkAllocated"]}</td>
                  </tr>
                );
                store.push(q);
              } else {
                q = (
                  <tr>
                    <td className="text-center">{l["roman"]}</td>
                    <td className="pl-2">{l["question"]}</td>
                    <td className="text-center">{l["co"]}</td>
                    <td className="text-center">{l["btl"]}</td>
                    <td className="text-center">{l["QPRef"]}</td>
                    <td className="px-2 text-center">{l["MarkAllocated"]}</td>
                  </tr>
                );
                store.push(q);
              }
            }
          } else {
            optsel = 1;
            if (option === l["option"]) {
              if (l["roman"] === "i") {
                subdivsel = 1;
                opt = (
                  <tr>
                    <td rowSpan={arrlen + 1} className="style-2 text-center">
                      {l["number"]}
                    </td>
                    <td
                      rowSpan={r[l["option"]]}
                      className="style-2 text-center"
                    >
                      {l["option"]}
                    </td>
                    <td className="style-2 text-center">{l["roman"]}</td>
                    <td className="pl-2">{l["question"]}</td>
                    <td className="style-2 text-center">{l["co"]}</td>
                    <td className="style-2 text-center">{l["btl"]}</td>
                    <td className="text-center">{l["QPRef"]}</td>
                    <td className="text-center">{l["MarkAllocated"]}</td>
                  </tr>
                );
                store.push(opt);
                option = l["option"];
              } else {
                opt = (
                  <tr>
                    <td className="style-2 text-center">{l["roman"]}</td>
                    <td className="pl-2">{l["question"]}</td>
                    <td className="style-2 text-center">{l["co"]}</td>
                    <td className="style-2 text-center">{l["btl"]}</td>
                    <td className="text-center">{l["QPRef"]}</td>
                    <td className="text-center">{l["MarkAllocated"]}</td>
                  </tr>
                );
                store.push(opt);
                option = l["option"];
              }
            } else {
              opt = (
                <tr>
                  <td rowSpan={r[l["option"]]} className="text-center">
                    {l["option"]}
                  </td>
                  <td className="style-2 text-center">{l["roman"]}</td>
                  <td className="pl-2">{l["question"]}</td>
                  <td className="style-2 text-center">{l["co"]}</td>
                  <td className="style-2 text-center">{l["btl"]}</td>
                  <td className="text-center">{l["QPRef"]}</td>
                  <td className="text-center">{l["MarkAllocated"]}</td>
                </tr>
              );
              let brl = (
                <tr>
                  <td colSpan="9" className="font-bold text-center">
                    OR
                  </td>
                </tr>
              );
              store.push(brl);
              store.push(opt);
              option = l["option"];
            }
          }
        }
      }
    }
    let num = i.charCodeAt() - 65;
    let mark = options["marks"][num];
    let count = options["counts"][num];
    if (b[i][0][0][0]["roman"] === null) {
      final = (
        <table>
          <tbody>
            <tr>
              <td
                className="text-center font-bold"
                colSpan={subdivsel + optsel + 2}
              >
                Part-{i} ({mark}x{count}={mark * count} marks)
                <br />
                {count > 1 ? "(Answer all the questions)" : ""}
              </td>
              <td className="text-center font-bold px-2">CO</td>
              <td className="text-center font-bold px-2">
                BT
                <br />
                Level
              </td>
              <td className="text-center font-bold px-2">
                Univ
                <br />
                QP
              </td>
            </tr>
          </tbody>
          <tbody>{store}</tbody>
        </table>
      );
    } else {
      console.log(subdivsel, optsel);
      final = (
        <table>
          <tbody>
            <tr>
              <td
                className="text-center font-bold"
                colSpan={subdivsel + optsel + 2}
              >
                Part-{i} ({mark}x{count}={mark * count} marks)
                <br />
                {count > 1 ? "(Answer all the questions)" : ""}
              </td>
              <td className="text-center font-bold px-2">CO</td>
              <td className="text-center font-bold px-2">
                BT
                <br />
                Level
              </td>
              <td className="text-center font-bold px-2">
                Univ
                <br />
                QP
              </td>
              <td className="text-center font-bold px-2">
                Mark
                <br />
                Allocated
              </td>
            </tr>
          </tbody>
          <tbody>{store}</tbody>
        </table>
      );
    }
    questions.push(final);
    questions.push(<br />);
    final = "";
    store = [];
  }

  return (
    <div className="flex flex-col bg-white style-1 mx-auto text-sm style-3 mt-10">
      {/*TABLE FOR PAPER HEADER */}
      <table>
        <tbody>
          <tr>
            <td colSpan="2" className="text-right pr-4">
              RegNO.
            </td>
            <td colSpan="2"></td>
          </tr>
          <tr>
            <td className="text-center">
              <img
                src="https://www.citchennai.edu.in/wp-content/themes/cit/images/logo.png"
                alt="Logo"
                width="150"
                height="105"
              />
            </td>
            <td colSpan="3" className="text-center">
              CHENNAI INSTITUTE OF TECHNOLOGY
              <br />
              Sarathy Nagar, Pudupedu, Chennai 600 069.
              <br />
              Internal Assessment -1 April 2022
            </td>
          </tr>
          <tr>
            <td className="pl-2">Date/Time</td>
            <td className="pl-2">Date/Time</td>
            <td className="pl-2">Max Marks</td>
            <td className="pl-2">{total} Marks</td>
          </tr>
          <tr>
            <td className="pl-2">Subject With Code</td>
            <td className="pl-2">
              {options["subjectCode"]} {options["subjectName"]}
            </td>
            <td className="pl-2">Time</td>
            <td className="pl-2">{time} Hours</td>
          </tr>
          <tr>
            <td className="pl-2">Branch</td>
            <td className="pl-2">CSE Set A</td>
            <td className="pl-2">Year/Semester</td>
            <td className="pl-2">
              {romanize((semester + 1) / 2)}/{romanize(semester)}
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      {/*TABLE FOR COURSE OBJECTIVES*/}
      <table>
        <thead>
          <tr>
            <th>SlNO.</th>
            <th>Course Objective</th>
          </tr>
        </thead>
        <tbody>{co}</tbody>
      </table>
      <br />
      {/*TABLE FOR COURSE OUTCOMES*/}
      <table>
        <thead>
          <tr>
            <th>SlNO.</th>
            <th>Course Outcomes</th>
          </tr>
        </thead>
        <tbody>{cout}</tbody>
      </table>
      <br />
      {questions}
    </div>
  );
};

export default QuestionPaper;
