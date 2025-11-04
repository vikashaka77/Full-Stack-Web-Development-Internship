let inputBox = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
let expression = '';

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.innerText;

        if (value === '=') {
            try {
                inputBox.value = Function('"use strict"; return (' + expression + ')')();
                expression = inputBox.value;
            } catch {
                inputBox.value = 'Error';
                expression = '';
            }
        } else if (value === 'AC') {
            expression = '';
            inputBox.value = '';
        } else if (value === 'DEL') {
            expression = expression.slice(0, -1);
            inputBox.value = expression;
        } else {
            expression += value;
            inputBox.value = expression;
        }
    });
});
