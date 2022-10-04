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
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const [user, setUser] = useState<userInfo | null>(null);
  const [changingPassword, setChangingPassword] = useState<null | number>(null); //null - ничего не делаем; 1 - oldPassw; 2 - newPassw; 3 - updated

  useEffect(() => {
    // const dataFromDB = new Promise((resolve, reject) => )
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
    try {
      fetchingData(url);
    } catch (error) {
      console.log("error!");
    }
  }, []);

  // console.log(user, "this is user");

  useEffect(() => {
    if (!init) {
      try {
        fetch(url, {
          method: "PUT",
          body: JSON.stringify([...state]),
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
