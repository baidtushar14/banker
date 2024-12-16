'use strict';
// BANKIST APP

// Data
const account1 = {
    owner: 'Tushar Baid',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Neeraj Sanyal',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Sam',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Marry Smith',
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

const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__value">${mov.toFixed(2)}</div>
            </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html)
    })
}

const calcDisplaySummary = function (acc) {
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}`

    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}`

    const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter((int, i, arr) => {
        return int >= 1;
    }).reduce((acc, int) => acc + int, 0)
    labelSumInterest.textContent = `${interest.toFixed(2)}`
}

const createUserName = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    })

}
const updateUI = function (acc) {
    displayMovements(acc)
    calcDisplayBalance(acc)
    calcDisplaySummary(acc)

}
const startLogOutTimer = function () {
    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = "Log in to get started";
            containerApp.style.opacity = 0;
        }
        time--;
    }
    let time = 300;
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
}
createUserName(accounts);
console.log(accounts)
let currentAccount, timer;
const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
    labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`
}
btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    console.log(currentAccount)
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`
    }
    containerApp.style.opacity = 100;
    const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = now.getHours();
    // const minutes = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;
    // labelDate.textContent = new Intl.DateTimeFormat(en - GB).format(now);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
})
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
    inputTransferAmount.value = inputTransferTo.value = '';
    if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username) {
        currentAccount.movements.push(-amount);
        recieverAcc.movements.push(amount);
        updateUI(currentAccount);
        clearInterval(timer);
        timer = startLogOutTimer();

    }
})
btnClose.addEventListener('click', function (e) {
    e.preventDefault()

    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username)
        accounts.splice(index, 1)
        containerApp.style.opacity = 0;
        labelWelcome.textContent = "Log in to get started";
    }
    inputCloseUsername.value = inputClosePin.value = '';
})
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        currentAccount.movements.push(amount);
        updateUI(currentAccount)
        clearInterval(timer);
        timer = startLogOutTimer();
    }
    inputLoanAmount.value = ''
})
let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const eurtoUsd = 1.1;
const movementsUsd = movements.map(mov => mov * eurtoUsd)
const movementsUsdfor = [];
for (const mov of movements) movementsUsdfor.push(mov * eurtoUsd);

const movementsDescription = movements.map((mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(mov)} `
)
console.log(movementsDescription)

const deposits = movements.filter(function (mov) {
    return mov > 0;
})
const withdrawals = movements.filter(function (mov) {
    return mov < 0;
})

const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * eurtoUsd).reduce((acc, mov) => acc + mov, 0)
// console.log(totalDepositsUSD);
