const Roman = (props) => {
  return (
    <td className={`style-2 text-center${props.isSem ? " align-top" : ""}`}>
      {props.data}
      {props.isSem ? ")" : ""}
    </td>
  );
};

export default Roman;
