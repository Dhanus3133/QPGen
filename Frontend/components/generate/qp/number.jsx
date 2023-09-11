const Number = (props) => {
  return (
    <td
      className={`style-2 text-center${props.isSem ? " align-top" : ""}`}
      rowSpan={props.rs}
    >
      {props.data}
      {props.isSem ? "." : ""}
    </td>
  );
};

export default Number;
