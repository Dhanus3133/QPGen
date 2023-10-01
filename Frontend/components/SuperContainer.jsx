import { BsFillCaretRightFill } from "react-icons/bs";
import Link from "next/link";
import styles from "styles/SuperContainer.module.css";

const SuperContainer = ({ data, currentPath }) => {
  return (
    <>
      <div
        className={`${styles.containerSelf} rounded-md mt-10 divide-y divide-slate-400`}
      >
        {data.map((item) => (
          <div key={item["id"]} className="flex items-center w-full font-bold">
            <Link href={`${currentPath}/${item["href"]}`}>
              <button
                className={`pl-3 text-center ${styles.buttonSelf} basis-5/6 ${styles.selfWidth} my-3 font-semibold tracking-wider`}
              >
                {item["text"]}
              </button>
            </Link>
            <Link href={`${currentPath}/${item["href"]}`}>
              <BsFillCaretRightFill className="basis-auto ml-5 cursor-pointer" />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
//

export default SuperContainer;
