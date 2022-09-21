import { useEffect, useRef, useState } from "react";
import userInfo from "../types";
import styles from "./NewPassw.module.scss";

import chekingPasswValid from "../../checkPassw";

const NewPassw: React.FC<{
  newPasswIsSet: (userData: userInfo) => void;
  userData: userInfo;
}> = (props) => {
  const [newPassw, setNewPassw] = useState("");
  const [repeatedNP, setRepeatedNP] = useState("");
  const [correctPassword, setCorrectPassword] = useState(true);
  const [isRepeatRigth, setIsRepeatRigth] = useState(false);

  useEffect(() => {
    if (newPassw) {
      if (chekingPasswValid(newPassw, props.userData.anyPassword)) {
        if (newPassw === repeatedNP) setIsRepeatRigth(true);
        else if (isRepeatRigth) setIsRepeatRigth(false);
        setCorrectPassword(true);
      } else {
        if (correctPassword) setCorrectPassword(false);
        if (isRepeatRigth) setIsRepeatRigth(false);
      }
    }
  }, [newPassw, repeatedNP]);
  const clickHandler = () => {
    props.newPasswIsSet({ ...props.userData, password: newPassw });
  };
  return (
    <section className={styles.controls}>
      <div className={styles.control}>
        <label htmlFor="newpassw">New password</label>
        <input
          placeholder="new passw"
          type="text"
          id="newpassw"
          className={correctPassword ? "" : styles.incorrect_data}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setNewPassw(e.currentTarget.value);
          }}
          minLength={2}
        />
      </div>
      <div className={styles.control}>
        <label htmlFor="rnp">Repeat</label>
        <input
          placeholder="repeat new passw"
          type="password"
          id="rnp"
          className={isRepeatRigth ? "" : styles.incorrect_data}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setRepeatedNP(e.currentTarget.value);
          }}
          minLength={2}
        />
      </div>
      {isRepeatRigth && (
        <div>
          <button onClick={clickHandler} className={styles.button}>
            Ok
          </button>
        </div>
      )}
    </section>
  );
};

export default NewPassw;
