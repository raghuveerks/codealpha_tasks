let display = document.getElementById('display');

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = 'Error';
    }
}

// Scientific functions
function sin(value) {
    return Math.sin(value);
}

function cos(value) {
    return Math.cos(value);
}

function tan(value) {
    return Math.tan(value);
}

function log(value) {
    return Math.log10(value);
}

function exp(value) {
    return Math.exp(value);
}

function sqrt(value) {
    return Math.sqrt(value);
} 