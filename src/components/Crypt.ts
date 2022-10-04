const alphabet =
  "IХ>JБЛML2ш|УШ}Rё]у[CЧг#6!Д№с8+gGО=pхZhdэ0лNпФT4Bk($яднЭЙaЯов^KЮSЦsежvамnъЬИw`5чтX;-/uыГ'DАtAфWcЪПi_Щj@*Еmбю:eцHСКOРр~QE{и9ТUYщй3oqЫyз.lPFН7fVbr)ькЖЁ%1xЗ<,В&?zМ";

const getKeyFromUserName = (userName: string) => {
  return userName
    .split("")
    .map((el) => String(el.charCodeAt(0)))
    .join("")
    .split("")
    .reverse();
};
const Encryption: any = (userName: string, passw: string) => {
  let key = getKeyFromUserName(userName);
  let cryptedPassw = [];
  let indexForPush;
  for (let i = 0; i < passw.length; i++) {
    let alphabetIndex = alphabet.indexOf(passw[i]);
    if (alphabetIndex === -1) {
      return { error: "symbol_not_found" };
    }
    indexForPush =
      (alphabet.indexOf(key[i % key.length]) + alphabetIndex) % alphabet.length;
    cryptedPassw.push(alphabet[indexForPush]);
  }
  return cryptedPassw.join("");
};

const Decryption: any = (userName: string, cryptedPassw: string) => {
  let key = getKeyFromUserName(userName);
  let passw = [];
  let indexForPush;
  for (let i = 0; i < cryptedPassw.length; i++) {
    let alphabetIndex = alphabet.indexOf(cryptedPassw[i]);
    let keyIndex = alphabet.indexOf(key[i % key.length]);
    if (keyIndex <= alphabetIndex) {
      indexForPush = alphabetIndex - keyIndex;
    } else {
      indexForPush = alphabet.length - (keyIndex - alphabetIndex);
    }
    passw.push(alphabet[indexForPush]);
  }
  return passw.join("");
};

export { Encryption, Decryption };

// function shuffle(array: string[]) { // c ее помощью исходный алфавит был перемешан
//     for (let i = array.length - 1; i > 0; i--) {
//       let j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//   }

// abc1234def5678
// 1234def5678abc
// 234def5678abc1
// 34def5678abc12
// 4def5678abc123
// let passw = "defabc";
