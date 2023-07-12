import SuperContainer from "./SuperContainer";
import SuperHeading from "./SuperHeading";

export default function SuperCard({ data, currentPath, type }) {
  if (data.length == 0)
    return (
      <h1 className="font-bold">You don&apos;t have any subjects assigned!</h1>
    );
  return (
    <>
      <div className="flex justify-center items-center bgcolor mt-14">
        <div className="flex flex-col justify-center items-start">
          <SuperHeading head={type} />
          <SuperContainer data={data} currentPath={currentPath} />
        </div>
      </div>
    </>
  );
}
