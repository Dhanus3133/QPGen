const Number = (props) => {
  return (
    <td className="style-2 text-center" rowSpan={props.rs}>
      {props.data}
    </td>
  );
};

export default Number;
