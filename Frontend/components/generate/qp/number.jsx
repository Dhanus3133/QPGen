const Number = (props) => {
  return (
    <td
      className={`style-2 text-center${props.isSem ? " align-top pb-3" : ""}`}
      rowSpan={props.rs}
    >
      {props.data}
      {props.isSem ? "." : ""}
    </td>
  );
};

export default Number;
