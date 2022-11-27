import styles from "styles/SuperHeading.module.css";

const SuperHeading = ({ head }) => {
  return (
    <>
      <h1 className={styles.headingSelf}>{head}</h1>
      <p className={styles.paragraphSelf}>
        Select {head} from the list given below
      </p>
    </>
  );
};

export default SuperHeading;
