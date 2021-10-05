const readline = require('readline');

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const PROMPT_MESSAGE = 'Enter a RPN expression or "q" to quit: '
const ERROR_MESSAGE = '- ERROR - Invalid Input\n'

/**
* The Demo function
*/
const Main = async () => {
  // Intitialize variables
  let stack = [];
  let input;
  let outPut;

  do {
    // Get the input from the users   
    input = await getInput(PROMPT_MESSAGE); 

    if(input){
      // Validate the input
      if(isValid(input)){
        // caculate to get the output
        outPut = RPNCalculator(stack, input);
        // show the output
        console.log(outPut);
      } else {
       // show the error message
        console.log(ERROR_MESSAGE);
      }
    }

  } while (input)

};

/**
* Rfunction that promises to ask for input and resolve to its answer
* @param  {String} message the greetings or prompt message
*/
function getInput(message) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(message, (input) => {
      if(input === 'q' || input === 'Q') {
        resolve(false);
        readlineInterface.close();
      }
      resolve(input);
    });
  });
}

/**
* RPN Calculator function
* @param   {Array}  stack  Stack to store the token
* @param   {String} newExpr  new input expression from user
* @return  {String} The ouput result
*/
function RPNCalculator(stack, newExpr) {

  let outPut = '';
  let expression = newExpr.split(" ");

  for(let i = 0; i < expression.length; i++) { 
    let OPERATORS = ['+', '-', '*', '/'];
    let token = expression[i];

    if(OPERATORS.includes(token)) {
      let a = stack.pop();
      let b = stack.pop();
      let result = operate(token, parseFloat(b), parseFloat(a))

      if(isNaN(result)){
        // empty the stack
        stack = [];
        return ERROR_MESSAGE;
      } 

      stack.push(result);
      outPut = result;

    } else {
      stack.push(token);
      outPut = token;
    }
  }
  return outPut;
}

/**
* Function that picks the operation and calculates the result
* @param   {String}  operator  the operator
* @param   {Number}   num_1    first number
* @param   {Number}   num_2    second number
* @return  {Number} the result of the calculation;
*/
function operate(operator, num_1, num_2){
  let operationHashTable = new Map();

  operationHashTable.set('+', num_1 + num_2);
  operationHashTable.set('-', num_1 - num_2);
  operationHashTable.set('*', num_1 * num_2);
  operationHashTable.set('/', (num_1 / num_2).toFixed(3));

  return operationHashTable.get(operator);
}

/**
* Function that check if the input is valid
* @param   {String}  input  the input from users
* @return  {Boolean} the result of the checking;
*/
function isValid(input){

  const expression = input.split(' '); 
  let numStr = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/;
  let opStr =  ['+', '-', '*', '/'];

  for(const token of expression){
    let isNum = numStr.test(token);
    let isOp = opStr.includes(token);
    if(!isNum && !isOp) return false;
  }

  return true;
}

// Greeting message
console.log('----------Welcome to CLI RPN Calculator ---------- ')
// Start calculating
Main();