'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sorted = false) {
    containerMovements.innerHTML = '';

  const mov = sorted ? movements.slice().sort((a, b) => a - b) : movements;
  mov.forEach((el, i) => {
    const type = el > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${el}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const blanceSummary = function (user) {
  const balanceIn = user.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.innerHTML = `${balanceIn}€`;
  const balanceOut = user.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.innerHTML = `${Math.abs(balanceOut)}€`;
  const interest = user.movements
    .filter(mov => mov > 0)
    .map(interest => (interest * user.interestRate) / 100)
    .reduce((acc, int) => acc + int);
  labelSumInterest.innerHTML = `${interest}€`;
};

const balancePrint = function (user) {
  user.balance = user.movements.reduce((acc, mov) => acc + mov);
  labelBalance.innerHTML = `${user.balance}€`;
};

const userName = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};
userName(accounts);

let user;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  user = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (user.pin === Number(inputLoginPin.value)) {
    labelWelcome.innerHTML = `Welcome back, ${user.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;
    balancePrint(user);
    displayMovements(user.movements);
    blanceSummary(user);
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur();
    console.log(user.movements);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(acc => acc.username == inputTransferTo.value);
  if (
    amount > 0 &&
    user.balance > amount &&
    reciever &&
    reciever.username !== user.username
  ) {
    user.movements.push(-amount);
    reciever.movements.push(amount);
    balancePrint(user);
    displayMovements(user.movements);
    blanceSummary(user);
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    inputTransferAmount.blur();
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && user.movements.some(e => e >= amount * 0.1)) {
    setTimeout(() => {
      user.movements.push(amount);

      balancePrint(user);
      displayMovements(user.movements);
      blanceSummary(user);
    }, 2000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    user.username === inputCloseUsername.value &&
    user.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(acc => acc.username === user.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(user.movements, !sorted);
  sorted = !sorted;
});
