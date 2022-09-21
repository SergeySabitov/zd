import styles from "./Header.module.scss";

const Header: React.FC<{
  isAuth: boolean;
  setPassword: () => void;
  isAdmin: boolean;
  openList: () => void;
  SignOut: () => void;
}> = (props) => {
  return (
    <header className={styles.header_container}>
      <ul>
        <li>
          <a
            onClick={() => {
              alert("ФИО: Сабитов Сергей Николаевич, группа: А-13а-19, л/р №1");
            }}
          >
            About
          </a>
        </li>
        {props.isAdmin && (
          <li>
            <a
              onClick={() => {
                props.openList();
              }}
            >
              Users
            </a>
          </li>
        )}
        {props.isAuth && (
          <li>
            <a onClick={() => props.setPassword()}>Change password</a>
          </li>
        )}
        {!props.isAuth && (
          <li>
            <a>Sign in</a>
          </li>
        )}
        {props.isAuth && (
          <li>
            <a
              onClick={() => {
                props.SignOut();
              }}
            >
              Sign out
            </a>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;
