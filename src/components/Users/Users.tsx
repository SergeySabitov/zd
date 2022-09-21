import { useRef, useState } from "react";
import userInfo from "../types";
import User from "./User";
import styles from "./Users.module.scss";
const Users: React.FC<{
  users: userInfo[];
  addUser: (user: string) => void;
  setUser: (user: userInfo) => void;
}> = (props) => {
  const [adding, setAdding] = useState(false);
  const [userName, setUserName] = useState("");
  let content = (
    <ul>
      {props.users.map((el) => (
        <li key={el.name}>
          <User
            user={el}
            setUserSettings={(user: userInfo) => {
              props.setUser(user);
            }}
          />
        </li>
      ))}
    </ul>
  );

  const clickHandler = () => {
    setAdding((prev) => !prev);
    // const un = userName.current?.value;
    if (userName && userName.length > 0) props.addUser(userName);
    setUserName("");
  };

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    let name = e.currentTarget.value;
    setUserName(name);
  };
  return (
    <>
      <section className={styles.ul_container}>
        <div className={styles.head}>
          <p>Name</p>
          <p>Strong password</p>
          <p>Ban</p>
        </div>
        {content}
      </section>
      <div className={styles.adding}>
        <div className={adding ? styles.input__show : styles.input__hide}>
          <label htmlFor="nun">New user name</label>
          <input
            className={styles.new_user}
            type="text"
            id="nun"
            // ref={userName}
            value={userName}
            onChange={changeHandler}
          ></input>
        </div>
        <button className={styles.button} onClick={clickHandler}>
          +
        </button>
      </div>
    </>
  );
};

export default Users;
