function NoChoice({ part, count, mark, subdivsel, optsel, store }) {
  return (
    <table className="w-full">
      <tbody>
        {part == "A" && (
          <tr>
            <td className="text-center break-inside-avoid" colSpan={subdivsel + optsel + 5}>
              <div className="font-bold">REVISED BLOOMS TAXONOMY(RBT)</div>
              <div>
                K1-Remembering, K2-Understanding, K3-Applying, K4-Analyzing,
                K5-Evaluating, K6-Creating
              </div>
            </td>
          </tr>
        )}
        <tr>
          <td
            className="text-center font-bold"
            colSpan={subdivsel + optsel + 2}
          >
            Part-{part}-({count}x{mark}={mark * count} marks)
            <br />
            {count > 1 && "(Answer all the questions)"}
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
}

export default NoChoice;
