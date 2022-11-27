const Option = (props) => {
  return (
    <td rowSpan={props.rs} className="style-2 text-center">
      {props.data}
    </td>
  );
};

export default Option;
