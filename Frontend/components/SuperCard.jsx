import SuperContainer from "./SuperContainer";
import SuperHeading from "./SuperHeading";

export default function SuperCard({ data, currentPath, type }) {
  if (data.length == 0) return <h3>You don't have the permission yet!</h3>;
  return (
    <>
      <div className="flex justify-center items-center bgcolor mt-14 mb-14">
        <div className="flex flex-col justify-center items-start">
          <SuperHeading head={type} />
          <SuperContainer data={data} currentPath={currentPath} />
        </div>
      </div>
    </>
  );
}
