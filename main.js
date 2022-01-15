let formula = '';
let dataDice = [];
let dataMod = [];
let resultRoll = '';
let mod = '';
let resultOper = '';
let resultWithoutDice = '';
let splitDice = [];
let final;

//Função para pegar os valores dos botões e trazer para o preview
function getFormula(string) {
  /* const dice = document.getElementsByClassName('dice');
  dice.addEventListener(
    'click',
    () => {
      if (formula.includes(this.value)) {
        console.log(this.value);
      }
    },
    false
  ); */
  document.getElementById('formulaString').append(string);
  formula = document.getElementById('formulaString').textContent;

  // data = Object.assign(formula);
  // dataSplit = data.split(/(\W)/);
  // console.log(dataSplit);
  // console.log(formula);
}
/* const ops = document.getElementsByClassName('ops');
ops.addEventListener('click', getFormula(this.value)); */

function formulaSplit() {
  const regexDice = /\W?\d+(d)\d+/g;
  const regexMod = /\W\d+(?!d)/g;
  dataDice = Array.from(formula.matchAll(regexDice), m => m[0]);
  dataMod = Array.from(formula.matchAll(regexMod), m => m[0]);
}

function loopRoll() {
  for (const dice of dataDice) {
    splitDice = dice.split('d');
    for (let i = 1; i <= splitDice[0].match(/\d+/); i++) {
      let count = Math.floor(Math.random() * splitDice[1] + 1);
      if (splitDice[0].includes('-')) {
        resultRoll += '-' + count;
      } else if (splitDice[0].includes('/')) {
        resultOper += '+' + count;
        //console.log (resultOper)
      } else if (splitDice[0].includes('*')) {
        resultOper += '+' + count;
        console.log(resultOper);
      } else {
        resultRoll += '+' + count;
      }
    }
    //console.log(dice, resultRoll + dataMod)
  }
}

//função de rolar que inclui todo o processo de calculo e mostrar no historico
function rollDice() {
  if (formula.includes('d')) {
    //separar a string em array com os dados e modificadores
    formulaSplit();

    //loop para pegar os valores dos dados, loop para rolar os dados e saída dos valores rolados separadamente - - - - - -
    loopRoll();
    // - - - - - -

    /* console.log(dataDice);
    console.log(dataMod);
    console.log(splitDice[0]);
    console.log(resultOper); */

    //Aplicar parênteses para ser calculado na ordem correta - - - - - -
    if (splitDice[0].includes('/')) {
      resultRoll = '(' + resultRoll + ')/' + eval(resultOper);
    } else if (splitDice[0].includes('*')) {
      resultRoll = '(' + resultRoll + ')*' + eval(resultOper);
    }
    /* else if (dataMod[0].includes('*')) {
      resultRoll = '(' + resultRoll + ')';
    } else if (dataMod[0].includes('/')) {
      resultRoll = '(' + resultRoll + ')';
    } */
  } else {
    resultWithoutDice = roundToTwo(eval(formula));
  }

  // - - - - - -

 if (dataMod.length == 0) {
    final = resultRoll + dataMod;
  } else {
    let dataMod1 = dataMod.reduce((a, b) => a + b, 0);
    final = resultRoll + '+' + eval(dataMod1);
  }
  /*  console.log('Rolagem: ' + formula);
    console.log('Resultado: ' + eval(final));
    console.log('Detalhes: ' + final.replace(/\+/, '')); */
  resultRoll = '';
  resultOper = '';

  //console.log('Resultado: ' + resultWithoutDice), (resultWithoutDice = '');

  historyLog();
  splitDice = '';
  
  document.getElementById('formulaString').textContent = '';
}

function historyLog() {
  if (formula.includes('d')) {
    let newDiv = document.createElement('div');
    let newDiv2 = document.createElement('div');
    newDiv.id = 'historyId1';
    newDiv2.id = 'historyId';
    newDiv.textContent = `Roll: ${formula} [${final.replace(/\+/, '')}] `;
    newDiv2.textContent = `Total: ${roundToTwo(eval(final))}`;
    historyBox.prepend(newDiv, newDiv2);
    /*document.getElementById('formulaString').textContent =
      formula + ' = ' + roundToTwo(eval(final));*/
  } else {
    let newDiv = document.createElement('div');
    let newDiv2 = document.createElement('div');
    newDiv.id = 'historyId1';
    newDiv2.id = 'historyId';
    newDiv.textContent = `Roll: [${formula}]`;
    newDiv2.textContent = `Total: ${resultWithoutDice}`;
    historyBox.prepend(newDiv, newDiv2);
   /* document.getElementById('formulaString').textContent =
      formula + ' = ' + resultWithoutDice; */
  }
}
function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}
//função para adicionar 1 dado nos botóes pre definidos de dado

//Função para checar se os parenteses estao abertos ou fechados
/* function checkBrackets() {
  brackets.value == '(' ? (brackets.value = ')') : (brackets.value = '(');
}
brackets.addEventListener('click', () => {
  getFormula(brackets.value);
  checkBrackets();
});
 */
//apagar tudo na calculadora
function allClear() {
  document.getElementById('formulaString').textContent = '';
  resultRoll = '';
  // brackets.value = '(';
}
//Função para o backspace apagar o último caractere.
function eraseLast() {
  formula = formula.slice(0, formula.length - 1);
  document.getElementById('formulaString').textContent = formula;
  // console.log(formula);
}

//função para guardar a formula e resultado no histórico
function storeR() {
  let sRoll = document.getElementById('formulaString').textContent;
  let sNewLi = document.createElement('li');
  sNewLi.id = 'storedId';
  sNewLi.textContent = sRoll;
  storedRollsBox.appendChild(sNewLi);
}
function eraseStored() {
  document.getElementById('storedRollsBox').innerHTML = '';
}
function eraseHistory() {
  document.getElementById('historyBox').innerHTML = '';
}
