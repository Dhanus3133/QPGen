import SuperContainer from "./SuperContainer";
import SuperHeading from "./SuperHeading";

export default function SuperCard({ data, currentPath, type }) {
  return (
    <>
      <div className="flex justify-center items-center bgcolor mt-14 mb-14 text-white">
        <div className="flex flex-col justify-center items-start">
          <SuperHeading head={type} />
          <SuperContainer data={data} currentPath={currentPath} />
        </div>
      </div>
    </>
  );
}
