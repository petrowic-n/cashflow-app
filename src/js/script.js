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

  class App {
    #transactions = [];
    #activeFilter = "all";

    constructor() {
      btnAdd.addEventListener("click", this._toggleModal.bind(this));
      btnCancel.addEventListener("click", this._toggleModal.bind(this));
    }

    _toggleModal() {
      modal.classList.toggle("hidden");
    }
  }

  const app = new App();
};

export default mainScript;
