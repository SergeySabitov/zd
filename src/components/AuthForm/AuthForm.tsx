import { useState, useRef } from "react";
import styles from "./AuthForm.module.scss";
import userInfo from "../types";
import { Decryption } from "../Crypt";
var CryptoJS = require("crypto-js");

const AuthForm: React.FC<{
  setIsAuth: () => void;
  usersData: userInfo[];
  setUser: (user: userInfo) => void;
  keyStringIsCorrect: boolean;

  checkKeyString: (keyString: string) => void;
}> = (props) => {
  const [incorrectData, setIncorrectData] = useState<{
    status: boolean;
    type?: string;
    count?: number;
  }>({ status: false, type: "" });
  const [isLogin, setIsLogin] = useState(true);

  const userPassw = useRef<HTMLInputElement | null>(null);
  const userName = useRef<HTMLInputElement | null>(null);
  const keyString = useRef<HTMLInputElement | null>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!props.keyStringIsCorrect && keyString.current) {
      // if (
      //   CryptoJS.MD5(keyString.current.value).toString() !== props.keyString
      // ) {
      //   setIncorrectData({ status: true });
      // } else {
      //   setIncorrectData({ status: false });
      //   props.setKeyStringStatus();
      // }
      props.checkKeyString(keyString.current.value);
      return;
    }
    const checkName = (el: userInfo) => {
      return el.name === userName.current!.value;
    };

    const checkPassw = (el: userInfo) => {
      let decryptedPassw = Decryption(el.name, el.password);
      let answer = decryptedPassw === userPassw.current!.value;
      if (!answer) {
        !incorrectData.count
          ? setIncorrectData((prev) => {
              let newState = { ...prev };

              newState.status = true;
              newState.count = 1;
              newState.type = "password";
              return newState;
            })
          : setIncorrectData((prev) => {
              let cnt: number = prev.count ? prev.count + 1 : 1;
              let newState = { ...prev };

              newState.status = true;
              newState.count = cnt;
              newState.type = "password";
              return newState;
            });
      }
      return answer;
    };
    let elem;
    if (isLogin) {
      //проверка имени и пароля
      elem = props.usersData.find((el) => checkName(el));

      if (elem) {
        if (elem.banned) {
          setIncorrectData((prev) => {
            return { ...prev, status: true, type: "ban" };
          });
          elem = null;
        } else if (!checkPassw(elem)) elem = null;
      } else {
        setIncorrectData((prev) => {
          return { ...prev, status: true, type: "name" };
        });
      }
    }

    if (!isLogin) {
      elem = props.usersData.find((el) => checkName(el));
      if (elem) {
        if (elem.banned) {
          setIncorrectData((prev) => {
            return { ...prev, status: true, type: "ban" };
          });
          elem = null;
        } else {
          if (elem.password !== 0) {
            // не новый пользователь
            setIncorrectData((prev) => {
              return { ...prev, status: true, type: "name" };
            });
            elem = null;
          }
        }
      } else {
        setIncorrectData((prev) => {
          return { ...prev, status: true, type: "name" };
        });
      }
    }

    if (elem) {
      props.setIsAuth();
      props.setUser(elem);
    }
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prev) => !prev);
    setIncorrectData((prev) => {
      return { ...prev, status: false };
    });
  };

  const focusHandler = () => {
    if (incorrectData.status) {
      setIncorrectData((prev) => {
        return { ...prev, status: false };
      });
    }
  };

  const incorrectClass = incorrectData.status ? styles.incorrect_data : "";

  const formAcces =
    incorrectData.count && incorrectData.count > 2 ? false : true;

  return (
    <div className={styles.form_container}>
      <form onSubmit={submitHandler}>
        {!props.keyStringIsCorrect && (
          <>
            <div className={styles.control}>
              <label htmlFor="keyString">Key string</label>
              <input
                placeholder="batman"
                type="text"
                id="keyString"
                required
                ref={keyString}
                className={incorrectClass}
                onFocus={focusHandler}
              />
            </div>
            <button className={styles.action}>Ok</button>
          </>
        )}
        {props.keyStringIsCorrect && (
          <>
            <div className={styles.control}>
              <label htmlFor="name">Your Name</label>
              <input
                placeholder="batman"
                type="text"
                id="name"
                required
                ref={userName}
                disabled={!formAcces}
                className={incorrectClass}
                onFocus={focusHandler}
              />
            </div>
            {isLogin && (
              <div className={styles.control}>
                <label htmlFor="password">Your Password</label>
                <input
                  type="password"
                  id="password"
                  required
                  ref={userPassw}
                  disabled={!formAcces}
                  className={incorrectClass}
                  onFocus={focusHandler}
                />
              </div>
            )}
            <div className={styles.actions}>
              <button className={styles.action} disabled={!formAcces}>
                {isLogin ? "Login" : "Create Account"}
              </button>
              {/* {isLoading && <p>Loading...</p>} */}
              <button
                type="button"
                className={styles.toggle}
                onClick={switchAuthModeHandler}
              >
                {isLogin ? "I'm new here" : "Login with existing account"}
              </button>
            </div>
          </>
        )}
      </form>
      {incorrectData.status && (
        <p className={styles.error}>
          Something went wrong! {incorrectData.type}
        </p>
      )}
    </div>
  );
};

export default AuthForm;
