function NoChoice({
  part,
  count,
  mark,
  subdivsel,
  optsel,
  store,
  isAnswer,
  isSem,
}) {
  return (
    <table className="w-full">
      <tbody>
        {(part == "A" && !isAnswer) ||
          (!isSem && (
            <tr>
              <td
                className="text-center break-inside-avoid"
                colSpan={subdivsel + optsel + 5}
              >
                <div className="font-bold">REVISED BLOOMS TAXONOMY(RBT)</div>
                <div>
                  L1-Remembering, L2-Understanding, L3-Applying, L4-Analyzing,
                  L5-Evaluating, <br />
                  L6-Creating
                </div>
              </td>
            </tr>
          ))}
        <tr>
          <td
            className={`text-center ${
              isSem && !isAnswer ? " relative pb-3" : "relative font-bold"
            }`}
            colSpan={subdivsel + optsel + 2 + isSem}
          >
            PART - {part}{" "}
            <span className={`${isSem ? "absolute right-0 font-bold" : ""}`}>
              ({count}x{mark}={mark * count} marks)
            </span>
            {!isSem && (
              <>
                <br />
                {count > 1 &&
                  !isAnswer &&
                  !isSem &&
                  "(Answer all the questions)"}
              </>
            )}
          </td>
          {!isAnswer && !isSem && (
            <>
              <td className="text-center font-bold px-1">CO</td>
              <td className="text-center font-bold px-1">
                RBT
                <br />
                Level
              </td>
              {/* <td className="text-center font-bold px-1">
                          Univ
                          <br />
                          QP
                        </td>*/}
            </>
          )}
        </tr>
      </tbody>
      <tbody>{store}</tbody>
    </table>
  );
}

export default NoChoice;
