import { useEffect, useState } from "react";
import userInfo from "../types";
import styles from "./User.module.scss";
const User: React.FC<{
  user: userInfo;
  setUserSettings: (newUser: userInfo) => void;
}> = (props) => {
  const [b1, setB1] = useState(!props.user.anyPassword);
  const [b2, setB2] = useState(props.user.banned);

  useEffect(() => {
    props.setUserSettings({ ...props.user, anyPassword: !b1, banned: b2 });
  }, [b1, b2]);

  return (
    <div className={styles.element}>
      <p>{props.user.name}</p>

      <div>
        <div
          onClick={() => {
            setB1((prev) => !prev);
          }}
        >
          <div className={b1 ? styles.toggled : ""}></div>
        </div>
      </div>
      <div>
        <div
          onClick={() => {
            setB2((prev) => !prev);
          }}
        >
          <div className={b2 ? styles.toggled : ""}></div>
        </div>
      </div>
    </div>
  );
};

export default User;
