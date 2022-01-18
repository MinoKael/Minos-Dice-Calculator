let formula = '';
let dataDice = [];
let dataMod = [];
let resultRoll = '';
let mod = '';
let resultOper = '';
let resultWithoutDice = '';
let splitDice = [];
let final;
let hasResult = false

document
  .querySelectorAll('.dice')
  .forEach(dice =>
    dice.addEventListener('click', () => getFormula(dice.value))
  );
document
  .querySelectorAll('#num')
  .forEach(num => num.addEventListener('click', () => getFormula(num.value)));
document
  .querySelectorAll('.ops')
  .forEach(ops => ops.addEventListener('click', () => getFormula(ops.value)));

//function to get the string, send to preview and to the variable formula| Match dices without the first digit and join a digit
function getFormula(string) {
if (hasResult==true) {
hasResult = false 
document.getElementById('formulaString').textContent=''
formula = '' 
} 
  document.getElementById('formulaString').append(string);
  formula = document.getElementById('formulaString').textContent;

  const regex3 = /\bd\d+/g;
  let array = formula.match(regex3);
  if (array == null) {
  } else { array.forEach(() => (formula = formula.split(/\bd/).join('1d')));
    }
  }


//split the string to match dices and modifiers separately
function formulaSplit() {
  const regexDice = /\W?\d+(d)\d+/g;
  const regexMod = /\W\d+(?!d)/g;
  dataDice = Array.from(formula.matchAll(regexDice), m => m[0]);
  dataMod = Array.from(formula.matchAll(regexMod), m => m[0]);
}

//loop to get dice values, loop to roll dice and output rolled values
function loopRoll() {
  for (const dice of dataDice) {
    splitDice = dice.split('d');
    for (let i = 1; i <= splitDice[0].match(/\d+/); i++) {
      let count = Math.floor(Math.random() * splitDice[1] + 1);
      if (splitDice[0].includes('-')) {
        resultRoll += '-' + count;
      } else if (splitDice[0].includes('/')) {
        resultOper += '+' + count;
      } else if (splitDice[0].includes('*')) {
        resultOper += '+' + count;
        console.log(resultOper);
      } else {
        resultRoll += '+' + count;
      }
    }
  }
}

//core function to calculate everything
function rollDice() {
  if (formula.includes('d')) {
    formulaSplit();

    loopRoll();

    //aplly the parenthesis in the correct place
    if (splitDice[0].includes('/')) {
      resultRoll = '(' + resultRoll + ')/' + eval(resultOper);
    } else if (splitDice[0].includes('*')) {
      resultRoll = '(' + resultRoll + ')*' + eval(resultOper);
    }
  } else {
    resultWithoutDice = roundToTwo(eval(formula));
  }
  //check if it has any modifiers and evaluate it
  if (dataMod.length == 0) {
    final = resultRoll + dataMod;
  } else {
    let dataMod1 = dataMod.reduce((a, b) => a + b, 0);
    final = resultRoll + '+' + eval(dataMod1);
  }

  resultRoll = '';
  resultOper = '';

  historyLog();
  splitDice = '';
  hasResult = true
  document.getElementById('memory').textContent = formula;
}

//Função para registrar as rolagens na div de historico
function historyLog() {
  if (formula.includes('d')) {
    let newDiv = document.createElement('div');
    let newDiv2 = document.createElement('div');
    newDiv.id = 'historyId1';
    newDiv2.id = 'historyId';
    newDiv.textContent = `Roll: ${formula} [${final.replace(/\+/, '')}] `;
    newDiv2.textContent = `Total: ${roundToTwo(eval(final))}`;
    historyBox.prepend(newDiv, newDiv2);
document.getElementById('formulaString').textContent=roundToTwo(eval(final))
  } else {
    let newDiv = document.createElement('div');
    let newDiv2 = document.createElement('div');
    newDiv.id = 'historyId1';
    newDiv2.id = 'historyId';
    newDiv.textContent = `Roll: [${formula}]`;
    newDiv2.textContent = `Total: ${resultWithoutDice}`;
    historyBox.prepend(newDiv, newDiv2);
document.getElementById('formulaString').textContent=roundToTwo(eval(final))
  }
}
function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}

//apagar tudo na calculadora
function allClear() {
  document.getElementById('formulaString').textContent = '';
  document.getElementById('memory').textContent = '';
  formula = '';
}

//Função para o backspace apagar o último caractere.
function eraseLast() {
  formula = formula.slice(0, formula.length - 1);
  document.getElementById('formulaString').textContent = formula;
}

function clearHistory() {
  document.getElementById('historyBox').innerHTML = '';
}
