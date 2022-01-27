let formula = '',
  formulaView,
  resultRoll,
  resultWithoutDice = '';
let dataDice,
  splitDice,
  countDice = [],
  countKeepDice = [],
  final = [],
  bonusKeep;
let hasResult = true;
let checkMacro = false;
console.log(formula);
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
document
  .querySelectorAll('#diceRoll')
  .forEach(diceRoll => diceRoll.addEventListener('click', () => rollDice()));

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
  if (formula == '') {
    throw undefined;
  }
  if (formula.includes('kH')) {
    if (formula.match(/[\(]|(\d+d\d+kH\d+d)|(kH\d+\W\d+d)/)) {
      throw alert(
        'Invalid Syntax! Keep Dice expression require a correct syntax. Example: 4d6k3 or 2d20k1+5'
      );
    } else {
      keepDiceRoll();
    }
  } else {
    if (formula.match(/d\d+d\d+/)) {
      throw alert('You need to add operators to the dice roll!');
    } else if (formula.match(/\)\d?d/)) {
      throw alert('You need to add operators to the dice roll!');
    }
    if (formula.match(/(?<=\s)\(/)) {
    } else if (formula.match(/\d\(/g) && /\)\(/g) {
      formula = formula.replaceAll(/\b\(/g, '*(');
      formula = formula.replaceAll(')(', ')*(');
    } else {
      formula = formula.replaceAll(')(', ')*(');
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
}

function keepDiceRoll() {
  let getKeepClean = formula.match(/\d+d\d+kH\d+/);
  bonusKeep = formula.match(/\W\d+/g);
  let keepDice = getKeepClean[0].split('kH');
  let keepSides = parseInt(keepDice[1]);
  let numDice = keepDice[0].split('d');
  if (keepSides >= parseInt(numDice[0])) {
    throw alert(
      'Invalid Syntax! The number of dices to keep needs to be lower than the number of dices to roll.'
    );
  }
  for (let i = 1; i <= numDice[0]; i++) {
    let count = Math.floor(Math.random() * numDice[1] + 1);
    countKeepDice.push(count);
  }
  const drop = parseInt(numDice[0] - keepSides);
  countKeepDice = countKeepDice.sort((a, b) => b - a);
  final = countKeepDice.slice(0, -drop);
  bonusKeep == null ? (bonusKeep = '+0') : bonusKeep;

  final = final.join('+');

  historyLog();
  countKeepDice = [];
  hasResult = true;
  formula = formulaView;
  document.getElementById('memory').textContent = formulaView;
}

//Function to log the detailed dice roll
function historyLog() {
  if (formulaView.includes('kH')) {
    let newDiv = document.createElement('div');
    let newDiv2 = document.createElement('div');
    newDiv.id = 'historyId1';
    newDiv2.id = 'historyId';
    newDiv.textContent = `Roll: ${formulaView} [${countKeepDice.join(' ')}] `;
    newDiv2.textContent = `Total: ${eval(final + bonusKeep)}`;
    historyBox.prepend(newDiv, newDiv2);
    document.getElementById('formulaString').textContent = eval(
      final + bonusKeep
    );
    return;
  }

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

//Save macro
function saveMacro() {
  if (formula === '') {
    throw alert(`You can't save a blank macro!`);
  }
  if (formula.match(/d\d+d\d+|\)\d?d/)) {
    throw alert('You need to add operators to save this macro!');
  }

  let newBtn = document.createElement('button');

  newBtn.className = 'macroRollBtn';
  newBtn.textContent = `${formula}`;
  newBtn.value = `${formula}`;

  newBtn.onclick = function () {
    rollMacro(this.value);
  };

  macroList.prepend(newBtn);
}

function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}

function checkBrackets() {
  brackets.value == '(' ? (brackets.value = ')') : (brackets.value = '(');
}
//clear everything on the memory
function allClear() {
  document.getElementById('formulaString').textContent = '';
  document.getElementById('memory').textContent = '';
  formula = '';
  formulaView = '';
  brackets.value = '(';
  hasResult = false;
}

function eraseLast() {
  formula = formula.slice(0, formula.length - 1);
  document.getElementById('formulaString').textContent = formula;
}

function clearHistory() {
  document.getElementById('historyBox').innerHTML = '';
}

function deleteMacro() {
  const stored = document.querySelector('.macroRollBtn');
  stored.parentElement.removeChild(stored);
}

//const stored = document.querySelectorAll('.macroRollBtn');

//function to roll a macro dice roll
function rollMacro(string) {
  document.getElementById('formulaString').textContent = '';
  getFormula(string);
  rollDice();
}
