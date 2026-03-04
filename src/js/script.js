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
  const transactionListContainer = document.getElementById(
    "transaction-list-container",
  );

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

      // hand off to render
      this._renderTransaction(tx);

      this._toggleModal();
    }

    _renderTransaction(tx) {
      const html = `
                <div data-id="${tx.id}" class="flex items-center gap-4 mt-8">
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
                </div>
      `;

      transactionListContainer.insertAdjacentHTML("afterbegin", html);
    }
  }

  const app = new App();
};

export default mainScript;
