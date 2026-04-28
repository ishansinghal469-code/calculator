let numbers = document.querySelectorAll(".numbers");
let operators = document.querySelectorAll(".op");
let ac = document.querySelector("#ac");
let display = document.querySelector("#display");
let equals = document.querySelector("#equals");

let op = "";
let first = "";
let second = "";
let resultShown = false;

// ─── Helper: Update Display ───────────────────────────────
function updateDisplay(value) {
    display.innerText = value;
}

// ─── AC Button ────────────────────────────────────────────
ac.addEventListener("click", () => {
    op = "";
    first = "";
    second = "";
    resultShown = false;
    updateDisplay("0");
});

// ─── Number Buttons ───────────────────────────────────────
numbers.forEach(number => {
    number.addEventListener('click', (e) => {
        const val = e.target.value;

        // Prevent multiple decimals
        if (val === ".") {
            if (op === "" && first.includes(".")) return;
            if (op !== "" && second.includes(".")) return;
        }

        // If result was just shown, start fresh
        if (resultShown && op === "") {
            first = "";
            resultShown = false;
        }

        if (op === "") {
            first += val;
            updateDisplay(first);
        } else {
            second += val;
            updateDisplay(first + " " + op + " " + second);
        }
    });
});

// ─── Operator Buttons ─────────────────────────────────────
operators.forEach(operator => {
    operator.addEventListener('click', (e) => {
        const val = e.target.value;

        // Chain calculations
        if (first !== "" && second !== "" && op !== "") {
            calculate();
        }

        if (first !== "") {
            op = val;
            resultShown = false;
            updateDisplay(first + " " + op);
        }
    });
});

// ─── Equals Button ────────────────────────────────────────
equals.addEventListener("click", () => {
    if (first === "" || second === "" || op === "") return;
    calculate();
});

// ─── Core Calculate Function ──────────────────────────────
function calculate() {
    let fn = Number(first);
    let sn = Number(second);
    let result;

    if (op === "+") result = fn + sn;
    else if (op === "-") result = fn - sn;
    else if (op === "x") result = fn * sn;
    else if (op === "/") {
        if (sn === 0) {
            updateDisplay("Can't divide by 0");
            resetAll();
            return;
        }
        result = fn / sn;
    }

    result = parseFloat(result.toFixed(10));
    updateDisplay(result);

    first = result.toString();
    second = "";
    op = "";
    resultShown = true;
}

// ─── Reset All ────────────────────────────────────────────
function resetAll() {
    first = "";
    second = "";
    op = "";
    resultShown = false;
}

// ─── Keyboard Support ─────────────────────────────────────
document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (!isNaN(key) || key === ".") {
        numbers.forEach(btn => {
            if (btn.value === key) btn.click();
        });
    }
    else if (["+", "-", "/", "x", "*"].includes(key)) {
        const opValue = key === "*" ? "x" : key;
        operators.forEach(btn => {
            if (btn.value === opValue) btn.click();
        });
    }
    else if (key === "Enter" || key === "=") equals.click();
    else if (key === "Backspace") handleBackspace();
    else if (key === "Escape") ac.click();
});

// ─── Backspace