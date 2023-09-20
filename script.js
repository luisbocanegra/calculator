// --------------- Create calculator buttons

const numpad = document.querySelector('.numpad');
let number = 1;
for (i = 0; i < 3; i++) {
  let row = document.createElement('div');
  row.classList.add('row');
  numpad.appendChild(row);
  for (j = 0; j < 3; j++) {
    let col = document.createElement('button');
    col.textContent = number;
    row.appendChild(col);
    number++;
  }
}


let bottom = document.querySelector(".bottom");
[".", "0", "x", "÷", "="].forEach((op) => {
  let btn = document.createElement('button');
  btn.textContent = op;
  bottom.appendChild(btn);
});


let right = document.querySelector(".right");
["AC", "C", "+", "-"].forEach((op) => {
  let btn = document.createElement('button');
  btn.textContent = op;
  right.appendChild(btn);
});


function add(...args) {
  return args.reduce((total, number) => total + number, 0);
}

function substract(...args) {
  return args.reduce((total, number) => {
    return (total === 0) ? number : total - number;
  }, 0);
};

function multiply(...args) {
  return args.reduce((total, number) => {
    return total *= number
  }, 1)
}

function divide(n1, n2) {
  return n1 / n2;
}

function operate(n1, operator, n2) {
  switch (operator) {
    case "+":
      return add(n1, n2);
    case "-":
      return substract(n1, n2);
    case "*":
    case "x":
      return multiply(n1, n2);
    case "/":
    case "÷":
      return divide(n1, n2)
    default:
      break;
  }
}

// receive an array of operations and solve it recursively
// returns an array of length 1 containing the final value
function doOperations(arrr) {
  let r = 0;
  for (i = 1; i < arrr.length - 1; i += 2) {

    if (arrr.length > 2) {
      // multiplication and division higher precedence
      if (arrr.includes("*") || arrr.includes("/")) {
        if (arrr[i] === "*" || arrr[i] === "/") {
          console.log(arrr[i - 1], arrr[i], arrr[i + 1])
          r = operate(parseFloat(arrr[i - 1]), arrr[i], parseFloat(arrr[i + 1]))
          arrr = doOperations([...arrr.slice(0, i - 1), r, ...arrr.slice(i + 2)])
          break;
        }
      }
      else {
        console.log(arrr[i - 1], arrr[i], arrr[i + 1])
        r = operate(parseFloat(arrr[i - 1]), arrr[i], parseFloat(arrr[i + 1]))
        arrr = doOperations([...arrr.slice(0, i - 1), r, ...arrr.slice(i + 2)])
        break;
      }
    }
    console.log("arrr", arrr);
  }
  return arrr;
}

const btnArea = document.querySelector(".buttons-area");
const inputArea = document.querySelector('#display');
const divisionByZero = document.querySelector('.zero-division-error');


function splitOperation() {
  return inputArea.value.split(/((?<=\d)[+\-*÷x\/]|[\s])/).filter(function (e) { return e.trim() !== ""; });
}

function calculate() {
  var arr = splitOperation();

  if (arr.length < 3) return;

  let result = doOperations(arr)[0];

  if (result === Infinity) {
    divisionByZero.classList.remove('hidden');
    inputArea.classList.add('input-error');
  } else {
    inputArea.value = result;
  }
}

function del() {
  let val = inputArea.value.split("");
  val.pop();
  inputArea.value = val.join("");
}

function isRepeated(btnAction) {
  if (["x", "÷", "+", "-", "."].includes(btnAction)) {
    var arr = splitOperation();
    if (arr.length > 0) {
      return (arr[arr.length - 1].split("").includes(btnAction));
    }
  }
}

btnArea.addEventListener('click', (e) => {
  let btnAction = e.target.textContent;

  if (btnAction === "=") {
    calculate()
    return
  } else {
    divisionByZero.classList.add('hidden');
    inputArea.classList.remove('input-error');
  }

  if (btnAction === "AC") {
    inputArea.value = "";
    return;
  }

  if (btnAction === "C") {
    del()
    return;
  }

  if (isRepeated(btnAction)) return;

  inputArea.value += e.target.textContent;

});

document.addEventListener('keydown', function (event) {
  var key = event.key;
  console.log(key);
  event.preventDefault();
  if (key.match(/[0-9/*+=-]/) || key === "Backspace" || key === "Enter") {
    if (key === "=" || key === "Enter") {
      calculate();
      return
    } else if (key === "Backspace") {
      del()
      return;
    }
    if (isRepeated(key)) return;
    inputArea.value += key;
  }
});
