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
    document.getElementById('formulaString').value = '';
    formula = '';
  }
  document.getElementById('formulaString').value += string;
  formula = document.getElementById('formulaString').value;

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
    showToast('Please enter a formula to roll.');
    return;
  }
  if (formula.match(/kh|kl/i)) {
    if (formula.match(/[\(]|(\d+d\d+(kh|kl)\d+d)|((kh|kl)\d+\W\d+d)/i)) {
      showToast(
        'Invalid Syntax! Keep Dice expression require a correct syntax. Example: 4d6k3 or 2d20k1+5'
      );
      return;
    } else {
      keepDiceRoll();
    }
  } else {
    if (formula.match(/d\d+d\d+/)) {
      showToast('You need to add operators to the dice roll!');
      return;
    } else if (formula.match(/\)\d?d/)) {
      showToast('You need to add operators to the dice roll!');
      return;
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
  let getKeepClean = formula.match(/\d+d\d+(kh|kl)\d+/i);
  bonusKeep = formula.match(/\W\d+/g);
  let keepDice = getKeepClean[0].split(/kh|kl/i);
  let keepSides = parseInt(keepDice[1]);
  let numDice = keepDice[0].split('d');
  if (keepSides >= parseInt(numDice[0])) {
    showToast(
      'Invalid Syntax! The number of dices to keep needs to be lower than the number of dices to roll.'
    );
    return;
  }
  for (let i = 1; i <= numDice[0]; i++) {
    let count = Math.floor(Math.random() * numDice[1] + 1);
    countKeepDice.push(count);
  }
  const drop = parseInt(numDice[0] - keepSides);
  countKeepDice = formula.match(/kh/i)
    ? countKeepDice.sort((a, b) => b - a)
    : countKeepDice.sort((a, b) => a - b);
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
  if (formulaView.match(/kh|kl/i)) {
    let newDiv = document.createElement('div');
    let newDiv2 = document.createElement('div');
    newDiv.id = 'historyId1';
    newDiv2.id = 'historyId';
    newDiv.textContent = `Roll: ${formulaView} [${countKeepDice.join(' ')}] `;
    newDiv2.textContent = `Total: ${eval(final + bonusKeep)}`;
    historyBox.prepend(newDiv, newDiv2);
    document.getElementById('formulaString').value = eval(final + bonusKeep);
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
    document.getElementById('formulaString').value = roundToTwo(
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
    document.getElementById('formulaString').value = resultWithoutDice;
  }
}

//Save macro
function saveMacro() {
  if (formula === '') {
    showToast(`You can't save a blank macro!`);
    return;
  }
  if (formula.match(/d\d+d\d+|\)\d?d/)) {
    showToast('You need to add operators to save this macro!');
    return;
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
  document.getElementById('formulaString').value = '';
  document.getElementById('memory').textContent = '';
  formula = '';
  formulaView = '';
  brackets.value = '(';
  hasResult = false;
}

function eraseLast() {
  formula = formula.slice(0, formula.length - 1);
  document.getElementById('formulaString').value = formula;
}

function clearHistory() {
  document.getElementById('historyBox').innerHTML = '';
}

function deleteMacro() {
  const stored = document.querySelector('.macroRollBtn');
  stored.parentElement.removeChild(stored);
}
function showDiv() {
  const divTag = document.getElementById('showTag');
  if (divTag.style.display == 'block') {
    divTag.style.display = 'none';
  } else {
    divTag.style.display = 'block';
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show';
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

//const stored = document.querySelectorAll('.macroRollBtn');

//function to roll a macro dice roll
function rollMacro(string) {
  document.getElementById('formulaString').value = '';
  getFormula(string);
  rollDice();
}
