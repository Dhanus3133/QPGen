import Question from "./question";
import QuestionAttributes from "./questionAttributes";
import Roman from "./roman";
import Number from "./number";
import Option from "./option";
import NoChoice from "./noChoice";
import Choice from "./choice";
import { romanize } from "@/src/utils";
import { useState } from "react";
import RenderVditor from "components/renderVditor";

const QuestionPaperGen = (props) => {
  // QUESTION PAPER
  const [vd, setVd] = useState(null);
  let b = props.data;
  let isAnswer = props.isAnswer;
  let isSem = props.isSem;
  let isRetest = props.isRetest;
  let courseObjectives = props.options.objectives;
  let courseOutcomes = props.options.outcomes;
  let subjectCO = props.options.subjectCO;
  let options = props.options;
  let semester = props.semester;
  let total = props.total;
  let time = props.time;
  let exam = props.exam;
  let set = props.set;
  let dateTime = props.dateTime;
  const numberToString = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
    6: "Sixth",
    7: "Seventh",
    8: "Eighth",
    9: "Ninth",
    10: "Tenth",
    11: "Eleventh",
    12: "Twelfth",
  };

  //------------------------------------

  //------------------------------------COURSE OBJECTIVES

  let co = [];
  let cout = [];
  let a;

  if (!isSem) {
    courseObjectives.forEach(function (value, i) {
      a = (
        <tr>
          <td className="text-center">{i + 1}</td>
          <td className="pl-2">{value}</td>
        </tr>
      );
      co.push(a);
    });

    //------------------------------------
    //------------------------------------COURSE OUTCOMES

    courseOutcomes.forEach(function (value, i) {
      a = (
        <tr>
          <td className="text-center">
            {subjectCO}.{i + 1}
          </td>
          <td className="pl-2">{value[0]}</td>
          <td className="pl-2 text-center">{value[1].join(", ")}</td>
        </tr>
      );
      cout.push(a);
    });
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
                    <Number rs={r[null]} data={l["number"]} isSem={isSem} />
                    <Question
                      data={isAnswer ? l["answer"] : l["question"]}
                      isSem={isSem}
                      isAnswer={isAnswer}
                      vd={vd}
                      setVd={setVd}
                    />
                    {!isAnswer && !isSem && (
                      <>
                        <QuestionAttributes data={l["co"]} />
                        <QuestionAttributes data={l["btl"]} />
                        {/*<QuestionAttributes data={l["QPRef"]} />*/}
                      </>
                    )}
                  </tr>
                );
                store.push(q);
              } else {
                q = (
                  <tr>
                    <Number rs={r[null]} data={l["number"]} isSem={isSem} />
                    <Question
                      data={isAnswer ? l["answer"] : l["question"]}
                      isSem={isSem}
                      isAnswer={isAnswer}
                      vd={vd}
                      setVd={setVd}
                    />

                    {!isAnswer && !isSem && (
                      <>
                        <QuestionAttributes data={l["co"]} />
                        <QuestionAttributes data={l["btl"]} />
                        {/*<QuestionAttributes data={l["QPRef"]} />*/}
                      </>
                    )}
                    <QuestionAttributes
                      data={l["MarkAllocated"]}
                      isSem={isSem}
                    />
                  </tr>
                );
                store.push(q);
              }
            } else if (r[null] > 1) {
              subdivsel = 1;
              if (l["roman"] === "i") {
                q = (
                  <tr>
                    <Number rs={r[null]} data={l["number"]} isSem={isSem} />
                    {k.length > 1 && <Roman data={l["roman"]} isSem={isSem} />}
                    <Question
                      data={isAnswer ? l["answer"] : l["question"]}
                      isSem={isSem}
                      isAnswer={isAnswer}
                      vd={vd}
                      setVd={setVd}
                      span={k.length > 1 ? 1 : 2}
                    />
                    {!isAnswer && !isSem && (
                      <>
                        <QuestionAttributes data={l["co"]} />
                        <QuestionAttributes data={l["btl"]} />
                        {/*<QuestionAttributes data={l["QPRef"]} />*/}
                      </>
                    )}
                    <QuestionAttributes
                      data={l["MarkAllocated"]}
                      isSem={isSem}
                    />
                  </tr>
                );
                store.push(q);
              } else {
                q = (
                  <tr>
                    {k.length > 1 && <Roman data={l["roman"]} isSem={isSem} />}
                    <Question
                      data={isAnswer ? l["answer"] : l["question"]}
                      isSem={isSem}
                      isAnswer={isAnswer}
                      vd={vd}
                      setVd={setVd}
                      span={k.length > 1 ? 1 : 2}
                    />
                    {!isAnswer && !isSem && (
                      <>
                        <QuestionAttributes data={l["co"]} />
                        <QuestionAttributes data={l["btl"]} />
                        {/*<QuestionAttributes data={l["QPRef"]} />*/}
                      </>
                    )}
                    <QuestionAttributes
                      data={l["MarkAllocated"]}
                      isSem={isSem}
                    />
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
                    <Number rs={arrlen + 1} data={l["number"]} isSem={isSem} />
                    <Option
                      rs={r[l["option"]]}
                      data={l["option"]}
                      isSem={isSem}
                    />
                    {k.length > 1 && <Roman data={l["roman"]} isSem={isSem} />}
                    <Question
                      data={isAnswer ? l["answer"] : l["question"]}
                      isSem={isSem}
                      isAnswer={isAnswer}
                      vd={vd}
                      setVd={setVd}
                      span={k.length > 1 ? 1 : 2}
                    />
                    {!isAnswer && !isSem && (
                      <>
                        <QuestionAttributes data={l["co"]} />
                        <QuestionAttributes data={l["btl"]} />
                        {/*<QuestionAttributes data={l["QPRef"]} />*/}
                      </>
                    )}
                    <QuestionAttributes
                      data={l["MarkAllocated"]}
                      isSem={isSem}
                    />
                  </tr>
                );
                store.push(opt);
                option = l["option"];
              } else {
                opt = (
                  <tr>
                    <Roman data={l["roman"]} isSem={isSem} />
                    <Question
                      data={isAnswer ? l["answer"] : l["question"]}
                      isSem={isSem}
                      isAnswer={isAnswer}
                      vd={vd}
                      setVd={setVd}
                      span={k.length > 1 ? 1 : 2}
                    />
                    {!isAnswer && !isSem && (
                      <>
                        <QuestionAttributes data={l["co"]} />
                        <QuestionAttributes data={l["btl"]} />
                        {/*<QuestionAttributes data={l["QPRef"]} />*/}
                      </>
                    )}
                    <QuestionAttributes
                      data={l["MarkAllocated"]}
                      isSem={isSem}
                    />
                  </tr>
                );
                store.push(opt);
                option = l["option"];
              }
            } else {
              opt = (
                <tr>
                  <td
                    rowSpan={r[l["option"]]}
                    className={`style-2 text-center${
                      isSem ? " align-top" : ""
                    }`}
                  >
                    {l["option"]}
                    {isSem ? ")" : ""}
                  </td>
                  {k.length > 1 && <Roman data={l["roman"]} isSem={isSem} />}
                  <Question
                    data={isAnswer ? l["answer"] : l["question"]}
                    isSem={isSem}
                    isAnswer={isAnswer}
                    vd={vd}
                    setVd={setVd}
                    span={k.length > 1 ? 1 : 2}
                  />
                  {!isAnswer && !isSem && (
                    <>
                      <QuestionAttributes data={l["co"]} />
                      <QuestionAttributes data={l["btl"]} />
                      {/*<QuestionAttributes data={l["QPRef"]} />*/}
                    </>
                  )}
                  <QuestionAttributes data={l["MarkAllocated"]} isSem={isSem} />
                </tr>
              );
              let brl = (
                <tr>
                  <td
                    colSpan="9"
                    className={`${
                      !isSem || isAnswer ? "font-bold" : "pb-3"
                    } text-center`}
                  >
                    {isSem && !isAnswer ? "(OR)" : "OR"}
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
      // console.log(subdivsel, optsel);
      final = (
        <NoChoice
          part={i}
          count={count}
          mark={mark}
          subdivsel={subdivsel}
          optsel={optsel}
          store={store}
          isAnswer={isAnswer}
          isSem={isSem}
        />
      );
    } else {
      // console.log(subdivsel, optsel);
      final = (
        <Choice
          part={i}
          count={count}
          mark={mark}
          subdivsel={subdivsel}
          optsel={optsel}
          store={store}
          isAnswer={isAnswer}
          isSem={isSem}
        />
      );
    }
    questions.push(final);
    questions.push(<br />);
    final = "";
    store = [];
    optsel = 0;
    subdivsel = 0;
  }

  const tableElements = document.querySelectorAll("table, th, td, tr");
  if (isSem && !isAnswer) {
    tableElements.forEach((element) => {
      element.style.border = "0";
    });
  } else {
    tableElements.forEach((element) => {
      element.style.border = "1px solid black";
    });
  }

  return (
    <>
      <div className="flex flex-col bg-white style-1 mx-auto text-sm style-3">
        {/*TABLE FOR PAPER HEADER */}
        {(!isSem && (
          <table className="w-full">
            <tbody>
              {!isAnswer && (
                <tr>
                  <td colSpan="2" className="text-right pr-4">
                    Reg. No.
                  </td>
                  <td colSpan="2"></td>
                </tr>
              )}
              <tr>
                <td className="text-center">
                  <img
                    className="py-0 pl-0.5 m-0"
                    src="https://www.citchennai.edu.in/wp-content/themes/cit/images/logo.png"
                    alt="Logo"
                    width="240"
                    height="200"
                  />
                </td>
                <td colSpan="3" className="text-center">
                  CHENNAI INSTITUTE OF TECHNOLOGY
                  <br />
                  Autonomous Institution, Affiliated to Anna University, Chennai
                  <br />
                  <b>
                    {isRetest && "Retest - "}
                    {exam} {isAnswer && "Answer Key"}
                  </b>
                </td>
              </tr>
              <tr>
                <td className="pl-2">Date/Time</td>
                <td className="pl-2">
                  {dateTime
                    ? `${dateTime.format("DD")}-${dateTime.format("MM")}-${
                        dateTime.format("YYYY") % 100
                      } / ${dateTime.format("hh")}:${dateTime.format("mm")}`
                    : "Date/Time"}
                </td>
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
                <td className="pl-2">
                  {options["branch"]}
                  {set ? ` Set ${set}` : ""}
                </td>
                <td className="pl-2">Year/Semester</td>
                <td className="pl-2">
                  {romanize(Math.ceil(semester / 2))}/{romanize(semester)}
                </td>
              </tr>
            </tbody>
          </table>
        )) || (
          <div className="text-center">
            {!isAnswer && (
              <div className="w-full flex justify-end items-center mb-3">
                <p>Reg No.: </p>
                <div className="grid grid-cols-12 pl-2 w-56 mr-2 h-7">
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                  <div className="border border-black">&nbsp;</div>
                </div>
              </div>
            )}
            <div className="font-bold leading-4">
              <h2 className="text-xl">CHENNAI INSTITUTE OF TECHNOLOGY</h2>
              <p>
                (An Autonomous Institution, Affiliated to Anna University,
                Chennai)
              </p>
              <h2 className="text-md pb-1.5">CHENNAI - 600 069</h2>
            </div>
            <p className="text-lg leading-5">
              {isRetest && "Retest - "}
              {exam} {isAnswer && "Answer Key"}
              <br />
              {numberToString[semester]} Semester
              <br />
              {options["subjectCode"]} - {options["subjectName"].toUpperCase()}
              <br />({options["dept"]})
              <br />
              (Regulation - {options["regulation"]})
              <div class="flex justify-between pt-3">
                <div class="mr-4">Time: {time} Hours</div>
                <div>Maximum Marks: {total}</div>
              </div>
              {!isAnswer && (
                <p className="text-center pt-4">Answer ALL Questions</p>
              )}
            </p>
          </div>
        )}

        <br />
        {/*TABLE FOR COURSE OBJECTIVES*/}
        {!isAnswer && !isSem && (
          <>
            <b>Course Objectives:</b>
            <p>The Student should be able</p>
            <table className="w-full">
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
            <b>Course Outcomes:</b>
            <p>On completion of the course the students will be able to</p>
            <table className="w-full">
              <thead>
                <tr>
                  <th>SlNO.</th>
                  <th>Course Outcomes</th>
                  <th>RBT level</th>
                </tr>
              </thead>
              <tbody>{cout}</tbody>
            </table>
            <br />
          </>
        )}
        <div>
          <div id="generated-questions" className="text-base leading-tight">
            {questions}
          </div>
          {!isAnswer && !isSem && (
            <p className="text-center">~*All the Best*~</p>
          )}
        </div>
        {!isAnswer && !isSem && (
          <div className="flex justify-around pt-10">
            <div>Prepared by</div>
            <div>Verfied by</div>
            <div>IQAC</div>
            <div>Approved by</div>
          </div>
        )}
      </div>
      <RenderVditor id="generated-questions" />
    </>
  );
};

export default QuestionPaperGen;
