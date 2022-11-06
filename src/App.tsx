import React, { useEffect, useReducer, useState } from "react";

import styles from "./App.module.scss";
import AuthForm from "./components/AuthForm/AuthForm";
import Header from "./components/Header/Header";
import NewPassw from "./components/NewPassw/NewPassw";
import OldPassw from "./components/NewPassw/OldPassw";
import type userInfo from "./components/types";
import Users from "./components/Users/Users";
import chekingPasswValid from "./checkPassw";
import { Decryption, Encryption } from "./components/Crypt";

var CryptoJS = require("crypto-js");

const KEYSTRING = CryptoJS.MD5("hello world").toString();

type ActionType = {
  type: string;
  payload: any;
};

const reducer = (state: userInfo[], action: ActionType) => {
  switch (action.type) {
    case "firstLoad":
      return [...action.payload];
    case "passwordUpdate":
      let index = state.findIndex((el) => {
        return el.name === action.payload.name;
      });
      let newState = [...state];
      newState[index] = action.payload;

      return [...newState];
    case "newUser":
      let newUser = {
        name: action.payload,
        password: 0,
        anyPassword: true,
        banned: false,
      };
      let users = [...state];
      users.push(newUser);
      return users;
    case "setUser":
      let userIndex = state.findIndex((el) => el.name === action.payload.name);
      let updatedState = [...state];
      updatedState[userIndex] = { ...action.payload };
      return updatedState;
    default:
      return state;
  }
};

const initialState: userInfo[] = [];

const url =
  "https://zd-lr1-default-rtdb.europe-west1.firebasedatabase.app/usersData.json";

let init = true;
let reloadData = false;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const [user, setUser] = useState<userInfo | null>(null);
  const [changingPassword, setChangingPassword] = useState<null | number>(null); //null - ничего не делаем; 1 - oldPassw; 2 - newPassw; 3 - updated
  const [keyStringIsCorrect, setKeyStringCorrect] = useState(false);

  const fetchingData = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    const responseData = await response.json();

    if (responseData) {
      dispatch({ type: "firstLoad", payload: responseData });
    }
  };

  useEffect(() => {
    console.log(
      CryptoJS.AES.encrypt("ADMIN", KEYSTRING, {
        mode: CryptoJS.mode.ECB,
      }).toString()
    );
    // const dataFromDB = new Promise((resolve, reject) => )

    try {
      fetchingData(url);
    } catch (error) {
      console.log("error!");
    }
  }, []);

  useEffect(() => {
    if (!init) {
      let cryptedState = state.map((el) => {
        let cryptedEl = {
          ...el,
          name: CryptoJS.AES.encrypt(el.name, KEYSTRING, {
            mode: CryptoJS.mode.ECB,
          }).toString(),
          password:
            el.password !== 0
              ? CryptoJS.AES.encrypt(el.password, KEYSTRING, {
                  mode: CryptoJS.mode.ECB,
                }).toString()
              : el.password,
        };
        return cryptedEl;
      });
      try {
        fetch(url, {
          method: "PUT",
          body: JSON.stringify([...cryptedState]),
        });
      } catch {}
    } else init = false;
  }, [state]);

  const newPasswIsSet = (updatedUser: userInfo) => {
    setChangingPassword(null);
    setUser(updatedUser);
    updatedUser.password = Encryption(updatedUser.name, updatedUser.password);
    dispatch({ type: "passwordUpdate", payload: updatedUser });
  };

  const outHandler = () => {
    setUser(null);
    setIsAuth(false);
    setChangingPassword(null);
    setOpenList(false);
    setKeyStringCorrect(false);
    try {
      fetchingData(url);
    } catch (error) {
      console.log("error!");
    }
  };

  let content = <></>;
  if (user) {
    let decryptedPassw = Decryption(user.name, user.password.toString());
    if (
      user.password === 0 ||
      !chekingPasswValid(decryptedPassw, user.anyPassword)
    ) {
      if (openList) setOpenList(false);
      content = <NewPassw newPasswIsSet={newPasswIsSet} userData={user} />;
    }
  }

  if (changingPassword && user) {
    if (changingPassword === 1)
      content = (
        <OldPassw
          nextStep={() => {
            setChangingPassword(2);
          }}
          userData={user}
        />
      );
    if (changingPassword === 2) {
      content = <NewPassw newPasswIsSet={newPasswIsSet} userData={user} />;
    }
  }
  const checkKeyString = (keyString: string) => {
    // получаем хеш введенной парольной фразы
    const hashKeyString = CryptoJS.MD5(keyString).toString();
    // расшифровываем
    let decryptedState = state.map((el) => {
      let decryptedEl = {
        ...el,
        name: CryptoJS.AES.decrypt(el.name, hashKeyString, {
          mode: CryptoJS.mode.ECB,
        }).toString(CryptoJS.enc.Utf8),
        password:
          el.password !== 0
            ? CryptoJS.AES.decrypt(el.password, hashKeyString, {
                mode: CryptoJS.mode.ECB,
              }).toString(CryptoJS.enc.Utf8)
            : el.password,
      };
      return decryptedEl;
    });
    // если есть ADMIN - ОК
    if (decryptedState.filter((el) => el.name === "ADMIN").length > 0) {
      setKeyStringCorrect(true);
      dispatch({ type: "firstLoad", payload: decryptedState });
    }
  };

  return (
    <div className={styles.app}>
      <Header
        isAuth={isAuth}
        setPassword={() => {
          setChangingPassword(1);
          if (openList) setOpenList(false);
        }}
        isAdmin={user?.name === "ADMIN"}
        openList={() => {
          setOpenList(true);
        }}
        SignOut={outHandler}
      />
      <div className={styles.content}>
        {!isAuth && (
          <AuthForm
            setIsAuth={() => {
              setIsAuth(true);
            }}
            usersData={state}
            setUser={(user: userInfo) => {
              setUser(user);
            }}
            keyStringIsCorrect={keyStringIsCorrect}
            checkKeyString={checkKeyString}
          />
        )}
        {isAuth && !openList && (
          <>
            <p className={styles.greetings}>Hello, {user?.name}!</p>
            {content}
          </>
        )}
        {isAuth && openList && (
          <Users
            users={state}
            addUser={(name: string) => {
              dispatch({ type: "newUser", payload: name });
            }}
            setUser={(updatedUser: userInfo) => {
              if (user && user.name === updatedUser.name) setUser(updatedUser);
              dispatch({ type: "setUser", payload: updatedUser });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
