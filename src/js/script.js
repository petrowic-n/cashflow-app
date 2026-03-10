"use strict";

const mainScript = () => {
  class Transactions {
    date = new Date();
    id = (Date.now() + "").slice(-10);

    constructor(amount, description) {
      this.amount = amount;
      this.description = description;
    }

    _setDescription() {
      // prettier-ignore
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
  }

  class Income extends Transactions {
    type = "income";

    constructor(amount, description, source) {
      super(amount, description);
      this.source = source;
      this._setDescription;
    }
  }

  class Expense extends Transactions {
    type = "expense";
    constructor(amount, description, category) {
      super(amount, description);
      this.category = category;
      this._setDescription;
    }
  }

  const t1 = new Income(2400, "Freelance project", "Freelance");
  const t2 = new Expense(1200, "Monthly rent", "Housing");
  console.log(t1);
  console.log(t2);

  // DOM elements
  const modal = document.getElementById("modal");
  const btnAdd = document.getElementById("add-transaction");
  const btnCancel = document.getElementById("cancel-btn");
  const form = document.getElementById("form");
  const descriptionInput = document.getElementById("desc-input");
  const amountInput = document.getElementById("amount-input");
  const sourceInput = document.getElementById("source-input");
  const categoryInput = document.getElementById("category-input");
  const categoryContainer = document.querySelector(".category-container");
  const sourceContainer = document.querySelector(".source-container");
  const categoryListContainer = document.querySelector(
    ".category-list-container",
  );
  const transactionListContainer = document.getElementById(
    "transaction-list-container",
  );
  const balanceEl = document.getElementById("balance");
  const expensesEl = document.getElementById("expenses");
  const incomeEl = document.getElementById("income");

  class App {
    #transactions = [];
    #activeFilter = "all";
    #activeType = "income";

    constructor() {
      btnAdd.addEventListener("click", this._toggleModal.bind(this));
      btnCancel.addEventListener("click", this._toggleModal.bind(this));

      form.addEventListener("submit", this._newTransaction.bind(this));

      // check type of income
      document.querySelectorAll(".type-btn").forEach((btn) => {
        btn.addEventListener("click", this._toggleTypeField.bind(this));

        transactionListContainer.addEventListener(
          "click",
          this._deleteTransaction.bind(this),
        );
      });
    }

    _toggleModal() {
      modal.classList.toggle("hidden");
    }

    _toggleTypeField(e) {
      const incomeBtn = document.querySelector('[data-type="income"]');
      const expenseBtn = document.querySelector('[data-type="expense"]');

      // default look
      incomeBtn.classList.remove("border-green", "text-green");
      incomeBtn.classList.add("border-border", "text-text-muted");

      expenseBtn.classList.remove("border-red", "text-red");
      expenseBtn.classList.add("border-border", "text-text-muted");

      if (e.target.dataset.type === "income") {
        incomeBtn.classList.add("border-green", "text-green");
        incomeBtn.classList.remove("border-border", "text-text-muted");
        categoryContainer.classList.add("hidden");
        sourceContainer.classList.remove("hidden");
      }

      if (e.target.dataset.type === "expense") {
        expenseBtn.classList.add("border-red", "text-red");
        expenseBtn.classList.remove("border-border", "text-text-muted");
        incomeBtn.classList.remove("income-btn--active");
        sourceContainer.classList.add("hidden");
        categoryContainer.classList.remove("hidden");
      }

      this.#activeType = e.target.dataset.type;
    }

    _newTransaction(e) {
      e.preventDefault();

      // read form
      const description = descriptionInput.value;
      const amount = +amountInput.value;
      const extra =
        this.#activeType == "income" ? sourceInput.value : categoryInput.value;

      // validate
      if (!description || amount <= 0 || !extra)
        return alert("Please fill in all fields");

      // create object
      let tx;
      if (this.#activeType === "income") {
        tx = new Income(amount, description, extra);
      }

      if (this.#activeType === "expense") {
        tx = new Expense(amount, description, extra);
      }

      // push to array
      this.#transactions.push(tx);

      this._renderAllTransactions();
      this._updateStats();
      this._updateBalance();
      this._renderCategories();
      this._toggleModal();
    }

    _renderTransaction(tx) {
      const html = `
                <div data-id="${tx.id}" class="transaction-item hover:bg-border-bright transition-all duration-200 ease-in py-2 px-2 rounded-sm flex items-center gap-4 mt-8">
                  <!-- Arrow -->
                  <div
                    class="${tx.type === "income" ? "bg-green-dim" : "bg-red-dim"} flex items-center px-4 py-2 rounded-2xl"
                  >
                    <span class="text-text text-xl">${tx.type === "income" ? "↑" : "↓"}</span>
                  </div>
                  <!-- Content -->
                  <div>
                    <h5 class="text-text font-bold font-jetbrains">
                      ${tx.description}
                    </h5>
                    <div class="flex items-center gap-4 pt-1">
                      <span class="text-text-muted text-sm">Feb 24</span>
                      <span
                        class="bg-surface2 border border-border px-2 text-text-muted text-sm rounded-sm"
                        >${tx.source}</span
                      >
                    </div>
                  </div>
                  <span
                    class="${tx.type === "income" ? "text-green" : "text-red"} font-jetbrains font-bold ml-auto md:mr-32 mr-16"
                    >${tx.type === "income" ? "+" : "-"}$${tx.amount}</span
                  >
                   <div class="tx-delete opacity-0 group-hover:opacity-100  transition-opacity duration-200 cursor-pointer" 
                      data-id="${tx.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="text-red" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"></path></svg>
                   </div>
                </div>
      `;

      transactionListContainer.insertAdjacentHTML("afterbegin", html);
    }

    _deleteTransaction(e) {
      const deleteBtn = e.target.closest(".tx-delete");
      // guard clause
      if (!deleteBtn) return;

      const id = deleteBtn.dataset.id;

      this.#transactions = this.#transactions.filter((t) => t.id !== id);

      this._renderAllTransactions();
      this._updateStats();
      this._updateBalance();
      this._renderCategories();
    }

    _renderAllTransactions() {
      transactionListContainer.innerHTML = "";
      const txs =
        this.#activeFilter === "all"
          ? this.#transactions
          : this.#transactions.filter((t) => t.type === this.#activeFilter);

      if (txs.length === 0) {
        transactionListContainer.innerHTML = `
         <div class="text-center text-text-muted py-12">
        No transactions yet </div>
      `;
        return;
      }

      // render each one
      txs.forEach((tx) => this._renderTransaction(tx));
    }

    _updateBalance() {
      const income = this.#transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

      const expenses = this.#transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

      const balance = income - expenses;

      balanceEl.textContent = `$${balance}`;
    }

    _updateStats() {
      const income = this.#transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

      const expenses = this.#transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

      incomeEl.textContent = `$${income}`;
      expensesEl.textContent = `$${expenses}`;
    }

    _renderCategories() {
      const expenses = this.#transactions.filter((t) => t.type === "expense");
      const total = expenses.reduce((acc, t) => acc + t.amount, 0);

      // group by category
      const catMap = {};
      expenses.forEach((t) => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });

      // render
      categoryListContainer.innerHTML = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .map(
          ([cat, amt]) => `
      <div class="category-item">
        <div class="flex justify-between items-center mb-1">
          <span class="text-text text-sm font-bold">${cat}</span>
          <span class="text-text-muted text-sm font-jetbrains">$${amt}</span>
        </div>
        <div class="h-1 bg-surface2 rounded-full">
          <div class="h-1 bg-green rounded-full" 
               style="width: ${(amt / total) * 100}%">
          </div>
        </div>
      </div>
    `,
        )
        .join("");
    }
  }

  const app = new App();
};

export default mainScript;
