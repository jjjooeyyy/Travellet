// Load items from local storage
let savedItems = JSON.parse(localStorage.getItem('items')) || [];
updateTable(savedItems);
selectCurrency();

// Select default currency (Display currency)
function selectCurrency() {
let selected = '';
const selectCurrency = document.getElementById('currencySelect');
selectCurrency.addEventListener('change',() => {
  console.log(selectCurrency.value)
 displayTotal(savedItems);
})
}

// Add data via submit button 
const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click',(e)=> {
  e.preventDefault();

var itemInput = document.getElementById("itemInput").value;
var dateInput = document.getElementById("date");
var selectedDate = dateInput.value;
var categoryInput = document.getElementById("inputGroupSelect01").value;
var notesInput = document.getElementById("exampleFormControlTextarea1").value;
var amountInput = document.getElementById("amount").value;
var currencyInput = document.getElementById("currency").value;
var payer = document.getElementById('payer').value;
var payMethod = document.getElementById('pay-method').value;
var errorMsg = document.getElementById('errorMsg');

  // Perform field validation
  if (
    itemInput.value === '' ||
    dateInput.value === '' ||
    categoryInput.value === '' ||
    notesInput.value === '' ||
    amountInput.value === '' ||
    currencyInput.value === '' ||
    payer.value === '' ||
    payMethod.value === ''
  ) {
   errorMsg.textContent = 'Please fill in all fields.';
    return; // Stop form submission if any required field is empty
  }


  // Add new object to store every new item
  const addExpense = {
       item: itemInput,
        date: selectedDate,
        category: categoryInput,
        notes: notesInput,
        amount: amountInput,
        currency: currencyInput,
        payer: payer,
        payMethod: payMethod,
  }
  // add the new data to the storage array
  savedItems.push(addExpense);

  // update local storage
  updateLocalStorage();
  // display
  updateTable(savedItems);
  //reset form 
  document.getElementById("expensesForm").reset();

  // Reset currency select
  var currencySelect = document.getElementById("currency");
  currencySelect.reset();

  // Reset pay method select
  var payMethodSelect = document.getElementById("pay-method");
  payMethodSelect.reset();
})

// Update items in local storage
function updateLocalStorage() {
  localStorage.setItem('items',JSON.stringify(savedItems));
  updateTable(savedItems);
  selectCurrency();
}

// What to include in the display
function updateTable(savedItems) {
  const container = document.getElementById('expenseContainer');
  container.innerHTML = ''; // Clear existing content
  let totalAmount = 0;

  for (let i = 0; i < savedItems.length; i++) {
    const item = savedItems[i];

  const getCategoryIcon = (category) => {
    if (category === 'Food') {
      return 'restaurant';
    } else if (category === 'Transport') {
      return 'directions_car';
    } else if (category === 'Activity') {
      return 'local_activity';
    } else if (category === 'Accommodation') {
      return 'hotel';
    } else {
      return 'local_mall';
    }
  };
  
     const getPayMethodIcon = (payMethod) => {
      if(payMethod === 'Cash') {
        return '💵';
      } else {
        return '💳';
      }
     }


const html = `
<section class="mt-5 rounded bg-body-tertiary mx-auto" data-expense-id="${i}">
    <div class="d-flex flex-row items-center p-5">
    <div class="text-md font-semibold mr-3">
    ${item.date}
  </div>
  <div class="rounded-full p-1 justify-center mx-auto bg-success">
    <span class="material-icons-sharp text-white" id="category">
    ${getCategoryIcon(item.category)}
        </span>
      </div>
      <div class="d-flex flex-col items-center px-3">
        <h3 id="item" class="text-md font-bold uppercase">${item.item}</h3>
        <p id="notes" class="text-sm w-28 text-center">${item.notes}</p>
      </div>
      <div class="d-flex flex-col items-center pr-3">
        <h3 id="payer" class="text-md font-bold uppercase">${item.payer}</h3>
        <p id="method" class="text-md">${getPayMethodIcon(item.payMethod)}</p>
      </div>
      <div class="d-flex flex-col items-center text-[color:var(--color-danger)]">
        <h3 id="amount" class="amount text-md font-bold px-3">${item.amount}</h3><p id="currency" class="font-bold">${item.currency}</p>
      </div>
      <div class="d-flex flex-col">
        <button><span class="edit-btn material-icons-sharp rounded-full bg-secondary mx-auto p-1 mb-3 text-white">edit</span></button>
        <button><span class="delete-btn material-icons-sharp rounded-full bg-secondary mx-auto p-1 text-white">delete</span></button>
      </div>
    </div>
</section>
`
;
    // Append the HTML markup to the container
    container.innerHTML += html;

    // Update Total Amount
   displayTotal(savedItems);
}
}

// Display amount 
async function displayTotal(savedItems) {
  let totalAmount = 0;
  const selected = document.getElementById('currencySelect').value;
   console.log(selected);
  for (let i = 0; i < savedItems.length; i++) {
    const expense = savedItems[i];
    const amount = Number(expense.amount);

    try {
      const convertedAmount = await convertCurrency(amount, expense.currency, selected);
      if (!isNaN(convertedAmount)) {
        totalAmount += convertedAmount;
      }
    } catch (error) {
      console.error('Error converting currency:', error);
    }
  }

  const total = document.getElementById('total');
  total.textContent = totalAmount;
}

// Convert Currency
function convertCurrency(amount, fromCurrency, toCurrency) {
    return new Promise((resolve, reject) => {
      const requestURL = `https://v6.exchangerate-api.com/v6/cfe8752aed0f25c766e89aa7/pair/${fromCurrency}/${toCurrency}/${amount}`;
      
      const request = new XMLHttpRequest();
      request.open('GET', requestURL);
      request.responseType = 'json';
  
      request.onload = function () {
        if (request.status === 200) {
          const response = request.response;
          if (response.result === 'success') {
            const convertedAmount = amount * response.conversion_rate;
            if (!isNaN(convertedAmount) && isFinite(convertedAmount)) {
              resolve(Math.ceil(convertedAmount));
            } else {
              reject(new Error('Conversion result is not a valid number.'));
            }
          } else {
            reject(new Error(response.error));
          }
        } else {
          reject(new Error(`Request failed with status: ${request.status}`));
        }
      };
  
      request.onerror = function () {
        reject(new Error('Request failed'));
      };
      request.send();
    });
  }
  

// Edit function
const container = document.getElementById('expenseContainer');
container.addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-btn')) {
    const div = event.target.closest('section > div');
    const expenseId = event.target.closest('.mt-5').dataset.expenseId;
    const expense = savedItems[expenseId];

    const itemInput = document.createElement('input');
    itemInput.type = 'text';
    itemInput.value = expense.item;
    itemInput.style.textTransform = 'uppercase';
    itemInput.style.background = 'transparent';
    itemInput.style.textAlign = 'center';
    itemInput.style.fontWeight = '1000';
    itemInput.style.width = '100%'; 

    const notesInput = document.createElement('input');
      notesInput.type = 'text';
      notesInput.value = expense.notes;
      notesInput.style.background = 'transparent';
      notesInput.style.textAlign = 'center';
      notesInput.style.width = '100%';


      const amountInput = document.createElement('input');
      amountInput.type = 'number';
      amountInput.min = 0;
      amountInput.value = expense.amount;
      amountInput.style.background = 'transparent';
      amountInput.style.textAlign = 'center';
      amountInput.style.fontWeight = '1000';
      amountInput.style.width = '100%';
    

      const payerInput = document.createElement('input');
      payerInput.type = 'text';
      payerInput.value = expense.payer;
      payerInput.style.textTransform = 'uppercase';
      payerInput.style.background = 'transparent';
      payerInput.style.textAlign = 'center';
      payerInput.style.fontWeight = '1000';
      payerInput.style.width = '100%';


      // edit pay method
      const payMethodParent = document.getElementById('method');
      const payMethodInput = document.createElement('select');
      payMethodInput.value = expense.payMethod;
      payMethodInput.style.background = 'transparent';
      payMethodInput.id = 'pay-method';
      var payMethodList = ['💵','💳'];
      for(let i in payMethodList) {
        var option = document.createElement('option');
        option.value = payMethodList[i];
        option.textContent = payMethodList[i];
        if (payMethodList[i] === expense.payMethod) {
          option.selected = true;
        }
        payMethodInput.appendChild(option);
      }
      // Remove previous content
      while (payMethodParent.firstChild) {
        payMethodParent.firstChild.remove();
      }
      payMethodParent.appendChild(payMethodInput);
      
      // edit currency 
     const currencyParent = document.getElementById('currency');
     const currencyInput = document.createElement('select');
     currencyInput.value = expense.currency;
     currencyInput.style.background = 'transparent';
     currencyInput.style.color = '#7d8da1';
     currencyInput.style.fontWeight = '1000';
     currencyInput.id = 'pay-currency';
     const currencyList = [
      'AED', 'ARS', 'AUD', 'BGN', 'BRL', 'BSD', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CZK', 'DKK', 'DOP',
      'EGP', 'EUR', 'FJD', 'GBP', 'GTQ', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW',
      'KZT', 'MVR', 'MXN', 'MYR', 'NOK', 'NZD', 'PAB', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'RON', 'RUB',
      'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'UYU', 'ZAR'
    ];
    for(let i=0;i<currencyList.length;i++) {
      var option = document.createElement('option');
      option.value = currencyList[i];
      option.textContent = currencyList[i];
      if (currencyList[i] === expense.currency) {
        option.selected = true;
      }
      currencyInput.appendChild(option);
    }
    // Remove previous content
    while (currencyParent.firstChild) {
      currencyParent.firstChild.remove();
    }
    currencyParent.appendChild(currencyInput);

      // Replace the expense data with input fields
    const expenseContainer = event.target.closest('.mt-5');
    const item = expenseContainer.querySelector('#item');
    const notes = expenseContainer.querySelector('#notes');
    const amount = expenseContainer.querySelector('.amount');
    const payer = expenseContainer.querySelector('#payer');
    const payMethod = expenseContainer.querySelector('#method');
    const currency = expenseContainer.querySelector('#currency');

    item.replaceWith(itemInput);
    notes.replaceWith(notesInput);
    amount.replaceWith(amountInput);
    payer.replaceWith(payerInput);
    payMethod.replaceWith(payMethodInput);
    currency.replaceWith(currencyInput);

    itemInput.addEventListener('blur',() => {
      const updatedItem = itemInput.value;
      expense.item = updatedItem;
      updateLocalStorage();
      item.innerHTML = updatedItem;
    })

    notesInput.addEventListener('blur',() => {
      const updatedNotes = notesInput.value;
      expense.notes = updatedNotes;
      updateLocalStorage();
      notes.innerHTML = updatedNotes;
    })

    amountInput.addEventListener('blur',() => {
      const updatedAmount = amountInput.value;
      expense.amount = updatedAmount;
      updateLocalStorage();
      amount.innerHTML = updatedAmount;
    })

    payerInput.addEventListener('blur',() => {
      const updatedPayer = payerInput.value;
      expense.payer = updatedPayer;
      updateLocalStorage();
      payer.innerHTML = updatedPayer;
    })

    payMethodInput.addEventListener('change',() => {
      const updatedMethod = payMethodInput.value;
      expense.payMethod = updatedMethod;
      updateLocalStorage();
      payMethod.innerHTML = updatedMethod;
    })

    currencyInput.addEventListener('change',() => {
      const updatedCurrency = currencyInput.value;
      expense.currency = updatedCurrency;
      updateLocalStorage();
      currency.innerHTML = updatedCurrency;
    })
  }


})


// Del function 
container.addEventListener('click',(event) => {
  if (event.target.classList.contains('delete-btn')) {
    // Get which one we want to del (index)
    const expenseId = event.target.closest('.mt-5').dataset.expenseId;
    const expense = savedItems[expenseId];
    savedItems.splice(expenseId,1);
    updateLocalStorage();
    updateTable(savedItems);
    displayTotal(savedItems);
  }
})

