const chekingPasswValid = (password: string, anyPassword: boolean) => {
  if (!anyPassword) {
    const isKyr = function (str: string) {
      return /[а-я]/i.test(str);
    };
    let numberWas = false;
    let kyrWas = false;
    let secondNumberWas = false;
    for (let i = 0; i < password.length; i++) {
      let char = password[i];

      if (isKyr(char)) {
        if (numberWas) kyrWas = true;
        else {
          return false;
        }
      } else {
        if (!!Number(char)) {
          if (!numberWas) {
            numberWas = true;
          } else {
            if (kyrWas) secondNumberWas = true;
          }
        }
      }

      // if (isKyr(char)) {
      //   if (next === "empty" || next === "kyr") {
      //     next = "number1";
      //   } else {
      //     setCorrectPassword(false);
      //     return false;
      //   }
      // } else {
      //   if (!!Number(char)) {
      //     if (next === "empty" || next === "number1") {
      //       next = "number2";
      //     } else {
      //       if (next === "number2") {
      //         next = "kyr";
      //       } else {
      //         setCorrectPassword(false);
      //         return false;
      //       }
      //     }
      //   }
      // }
    }
    if (!numberWas || !kyrWas || !secondNumberWas) {
      return false;
    }
  }
  return true;
};
export default chekingPasswValid;
