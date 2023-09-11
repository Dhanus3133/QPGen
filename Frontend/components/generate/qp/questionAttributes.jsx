const QuestionAttributes = (props) => {
  return (
    <td
      className={`px-1 text-center${props.isSem ? " align-top font-bold" : ""}`}
    >
      {props.isSem ? `(${props.data})` : props.data}
    </td>
  );
};

export default QuestionAttributes;
