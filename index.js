function getTime() {
  const now = new Date().toLocaleTimeString("en-us", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = now.split(",")[0].split(" ");
  const time = now.split(",")[1];
  return `${date[1]} ${date[0]},${time}`;
}

// 25 Feb, 06:45 PM

document.querySelector("#ewallet-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.querySelector(".add__type").value;
  const desc = document.querySelector(".add__description").value;
  const value = document.querySelector(".add__value").value;

  if (desc.length > 0 && value.length > 0) {
    addItem(type, desc, value);
    resetForm();
  }
});

showItemsToLS();

function showItemsToLS() {
  let items = getItemToLS();

  const collection = document.querySelector(".collection");

  for (let item of items) {
    const newHtml = `
      <div class="item">
        <div class="item-description-time">
          <div class="item-description">
            <p>${item.desc}</p>
          </div>
          <div class="item-time">
            <p>${item.time}</p>
          </div>
        </div>
        <div class="item-amount ${
          item.type === "+" ? "income-amount" : "expense-amount"
        }">
          <p>${item.type}$${sep(item.value)}</p>
        </div>
      </div>
      `;
    collection.insertAdjacentHTML("afterbegin", newHtml);
  }
}

function addItem(type, desc, value) {
  const time = getTime();
  const newHtml = `
  <div class="item">
    <div class="item-description-time">
      <div class="item-description">
        <p>${desc}</p>
      </div>
      <div class="item-time">
        <p>${time}</p>
      </div>
    </div>
    <div class="item-amount ${
      type === "+" ? "income-amount" : "expense-amount"
    }">
      <p>${type}$${sep(value)}</p>
    </div>
  </div>
  `;
  const collection = document.querySelector(".collection");
  collection.insertAdjacentHTML("afterbegin", newHtml);

  addItemsToLS(type, desc, value, time);
  showExpense();
  showIncome();
  showTotalBalance();
}

function resetForm() {
  document.querySelector(".add__type").value = "+";
  document.querySelector(".add__description").value = "";
  document.querySelector(".add__value").value = "";
}

function getItemToLS() {
  let items = localStorage.getItem("items");

  if (items) {
    items = JSON.parse(items);
  } else {
    items = [];
  }

  return items;
}

function addItemsToLS(type, desc, value, time) {
  let items = getItemToLS();
  items.push({ type, desc, value, time });
  localStorage.setItem("items", JSON.stringify(items));
}

showIncome();
function showIncome() {
  let items = getItemToLS();

  let totalIncome = 0;
  for (let item of items) {
    if (item.type === "+") {
      totalIncome += parseInt(item.value);
    }
  }
  document.querySelector(".income__amount p").innerText = `$${sep(
    totalIncome
  )}`;
}

showExpense();
function showExpense() {
  let items = getItemToLS();

  let totalExpense = 0;
  for (let item of items) {
    if (item.type === "-") {
      totalExpense += parseInt(item.value);
    }
  }
  document.querySelector(".expense__amount p").innerText = `$${sep(
    totalExpense
  )}`;
}

showTotalBalance();
function showTotalBalance() {
  let items = getItemToLS();

  let balance = 0;
  for (let item of items) {
    if (item.type === "+") {
      balance += parseInt(item.value);
    } else {
      balance -= parseInt(item.value);
    }
  }
  document.querySelector(".balance__amount p").innerText = `$${sep(balance)}`;

  // if (balance >= 0) {
  //   document.querySelector("header").className = "green";
  // } else {
  //   document.querySelector("header").className = "red";
  // }
  document.querySelector("header").className = balance >= 0 ? "green" : "red";
}

function sep(amount) {
  amount = parseInt(amount);
  return amount.toLocaleString();
}
