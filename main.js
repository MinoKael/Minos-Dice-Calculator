let formula,
  formulaView,
  resultRoll,
  resultWithoutDice = '';
let dataDice,
  splitDice,
  countDice = [];
let hasResult = true;

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

brackets.addEventListener('click', () => {
  checkBrackets();
});

//function to get the string, send to preview and to the variable formula| Match dices without the first digit and join a digit
function getFormula(string) {
  if (hasResult == true) {
    hasResult = false;
    document.getElementById('formulaString').textContent = '';
    formula = '';
  }
  document.getElementById('formulaString').append(string);
  formula = document.getElementById('formulaString').textContent;

  const regex3 = /\bd\d+/g;
  let array = formula.match(regex3);
  if (array != null) {
    array.forEach(() => (formula = formula.split(/\bd/).join('1d')));
  }
  formulaView = formula;
}

//split the string to match dices and modifiers separately
function formulaSplit() {
  const regexDice = /\d+(d)\d+/g;
  dataDice = Array.from(formula.matchAll(regexDice), m => m[0]);
}

//loop to get dice values, loop to roll dice and output rolled values
function loopRoll() {
  for (const dice of dataDice) {
    splitDice = dice.split('d');
    for (let i = 1; i <= splitDice[0]; i++) {
      let count = Math.floor(Math.random() * splitDice[1] + 1);
      countDice += '+' + count;
    }
    countDice = countDice.substring(1);
    formula = formula.replace(/\d+d\d+/, countDice);
    countDice = [];
  }
  resultRoll = formula;
}

//core function to calculate everything
function rollDice() {
  if (formula.match(/d\d+d\d+/)) {
    throw alert('You need to add operators to the dice roll!');
  } else if (formula.match(/\)\d?d/) ){
  	throw alert('You need to add operators to the dice roll!');
  }
  if (formula.match(/(?<=\s)\(/)) {
  } else if (formula.match(/\d\(/g)&&/\)\(/g ) {
    formula = formula.replaceAll(/\b\(/g, '*(');
    formula =formula.replaceAll(')(', ')*(')
  } else{
  	formula =formula.replaceAll(')(', ')*(')
  }
  if (formula.includes('d')) {
    formulaSplit();

    loopRoll();
  } else {
    resultWithoutDice = roundToTwo(eval(formula));
  }

  historyLog();
  splitDice = '';
  hasResult = true;
  formula = formulaView;
  document.getElementById('memory').textContent = formulaView;
}

//Função para registrar as rolagens na div de historico
function historyLog() {
  if (formulaView.includes('d')) {
    let newDiv = document.createElement('div');
    let newDiv2 = document.createElement('div');
    newDiv.id = 'historyId1';
    newDiv2.id = 'historyId';
    newDiv.textContent = `Roll: ${formulaView} [${resultRoll}] `;
    newDiv2.textContent = `Total: ${roundToTwo(eval(resultRoll))}`;
    historyBox.prepend(newDiv, newDiv2);
    document.getElementById('formulaString').textContent = roundToTwo(
      eval(resultRoll)
    );
  } else {
    let newDiv = document.createElement('div');
    let newDiv2 = document.createElement('div');
    newDiv.id = 'historyId1';
    newDiv2.id = 'historyId';
    newDiv.textContent = `Roll: [${formula}]`;
    newDiv2.textContent = `Total: ${resultWithoutDice}`;
    historyBox.prepend(newDiv, newDiv2);
    document.getElementById('formulaString').textContent = resultWithoutDice;
  }
}

function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}

function checkBrackets() {
  brackets.value == '(' ? (brackets.value = ')') : (brackets.value = '(');
}
//apagar tudo na calculadora
function allClear() {
  document.getElementById('formulaString').textContent = '';
  document.getElementById('memory').textContent = '';
  formula = '';
  formulaView='' 
  brackets.value = '(';
  hasResult = false;
}

//Função para o backspace apagar o último caractere.
function eraseLast() {
  formula = formula.slice(0, formula.length - 1);
  document.getElementById('formulaString').textContent = formula;
}

function clearHistory() {
  document.getElementById('historyBox').innerHTML = '';
}
