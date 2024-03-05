"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2024-02-28T14:43:26.374Z",
    "2024-03-03T18:49:59.371Z",
    "2024-03-04T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = (date, locale) => {
  const calcDayPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const datePassed = calcDayPassed(new Date(), date);
  if (datePassed === 0) return "Today";
  if (datePassed === 1) return "Yesterday";
  if (datePassed <= 7) return `${datePassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = "";
  labelDate.innerHTML = new Intl.DateTimeFormat(acc.locale).format(new Date());

  const mov = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  mov.forEach((el, i) => {
    const time = new Date(acc.movementsDates[i]);
    const displayTime = formatMovementDate(time, acc.locale);
    const formattedMov = formatCur(el, acc.locale, acc.currency);
    const type = el > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
          <div class="movements__date">${displayTime}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const blanceSummary = function (user) {
  const balanceIn = user.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.innerHTML = formatCur(balanceIn, user.locale, user.currency);
  const balanceOut = user.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.innerHTML = formatCur(balanceOut, user.locale, user.currency);
  const interest = user.movements
    .filter((mov) => mov > 0)
    .map((interest) => (interest * user.interestRate) / 100)
    .reduce((acc, int) => acc + int);
  labelSumInterest.innerHTML = formatCur(interest, user.locale, user.currency);
};

const balancePrint = function (user) {
  user.balance = user.movements.reduce((acc, mov) => acc + mov);
  labelBalance.innerHTML = formatCur(user.balance, user.locale, user.currency);
};

const userName = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((user) => user[0])
      .join("");
  });
};
userName(accounts);

let user;

let time;
function timeCountDown() {
  function tik() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) clearInterval(timer);
    time--;
  }
  time = 20;
  tik();
  const timer = setInterval(tik, 1000);
  return timer;
}
let timer;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  user = accounts.find((acc) => acc.username === inputLoginUsername.value);
  if (user.pin === +inputLoginPin.value) {
    labelWelcome.innerHTML = `Welcome back, ${user.owner.split(" ")[0]}!`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = "";
    inputLoginUsername.value = "";
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = timeCountDown();
    balancePrint(user);
    displayMovements(user);
    blanceSummary(user);
  }
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reciever = accounts.find(
    (acc) => acc.username == inputTransferTo.value
  );
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  if (
    amount > 0 &&
    user.balance > amount &&
    reciever &&
    reciever.username !== user.username
  ) {
    user.movements.push(-amount);
    reciever.movements.push(amount);
    user.movementsDates.push(new Date().toISOString());
    reciever.movementsDates.push(new Date().toISOString());
    balancePrint(user);
    displayMovements(user);
    blanceSummary(user);
    inputTransferAmount.blur();
    if (timer) clearInterval(timer);
    timer = timeCountDown();
  }
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && user.movements.some((e) => e >= amount * 0.1)) {
    setTimeout(() => {
      user.movements.push(amount);
      user.movementsDates.push(new Date().toISOString());

      balancePrint(user);
      displayMovements(user);
      blanceSummary(user);
    }, 2000);
  }
  inputLoanAmount.value = "";
  if (timer) clearInterval(timer);
  timer = timeCountDown();
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    user.username === inputCloseUsername.value &&
    user.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex((acc) => acc.username === user.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(user, !sorted);
  sorted = !sorted;
});
