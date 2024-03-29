const Option = (props) => {
  return (
    <td
      rowSpan={props.rs}
      className={`style-2 text-center${props.isSem ? " align-top" : ""}`}
    >
      {props.isSem ? props.data.toLowerCase() : props.data}
      {props.isSem ? ")" : ""}
    </td>
  );
};

export default Option;
