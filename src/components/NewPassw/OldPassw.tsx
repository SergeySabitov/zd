import { useEffect, useState } from "react";
import userInfo from "../types";
import styles from "./NewPassw.module.scss";
const OldPassw: React.FC<{ nextStep: () => void; userData: userInfo }> = (
  props
) => {
  const [password, setPassword] = useState("");
  const [correctPassword, setCorrectPassword] = useState(false);

  const clickHandler = () => {
    props.nextStep();
  };

  useEffect(() => {
    if (password === props.userData.password) {
      setCorrectPassword(true);
    } else {
      if (correctPassword) setCorrectPassword(false);
    }
  }, [password]);
  return (
    <section className={styles.controls}>
      <div className={styles.control}>
        <label htmlFor="passw">Old password</label>
        <input
          placeholder="Old password"
          type="password"
          id="passw"
          className={correctPassword ? "" : styles.incorrect_data}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setPassword(e.currentTarget.value);
          }}
        />
      </div>
      {correctPassword && (
        <div>
          <button onClick={clickHandler} className={styles.button}>
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default OldPassw;
