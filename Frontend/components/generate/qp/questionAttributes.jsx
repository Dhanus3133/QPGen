const QuestionAttributes = (props) => {
  return (
    <td
      className={`px-1 text-center ${
        props?.isBold ? " font-bold" : ""
      }`}
    >
      {props.isSem
        ? props?.isBold
          ? `(${props.data})`
          : `${props.data}`
        : props.data}
    </td>
  );
};

export default QuestionAttributes;
