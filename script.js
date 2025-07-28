const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const date = document.getElementById('date');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransaction(e) {
  e.preventDefault();

  if (
    text.value.trim() === '' ||
    amount.value.trim() === '' ||
    category.value === '' ||
    date.value === '' ||
    +amount.value === 0
  ) {
    alert('Please fill all fields correctly (Amount ≠ 0)');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    category: category.value,
    date: date.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = '';
  amount.value = '';
  category.value = '';
  date.value = '';
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    <div>
      <strong>${transaction.text}</strong><br />
      <small>${transaction.category} | ${transaction.date}</small>
    </div>
    <div>
      <span>${sign}$${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </div>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((a, b) => a + b, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

function removeTransaction(id) {
  const confirmDelete = confirm("Are you sure you want to delete this transaction?");
  if (!confirmDelete) return;

  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener('submit', addTransaction);
init();
