const userInput = document.getElementById('bringItem');
const submitBtn = document.querySelector('.add-btn');
const itemContainer = document.getElementById('itemContainer');
const clearBtn = document.getElementById('clear');

// Load items from local storage
// Set 'saveItems' for array to store items in local storage
// retrieve data and display
let savedItems = JSON.parse(localStorage.getItem('items')) || [];
displayItems();

// ADD ITEM via submit button
submitBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const newItemName = userInput.value;
  if (newItemName) {
    // a new object to store every new item name and its status
    const newItem = {
      name: newItemName,
      checked: false
    };
    // add the new input to the storage array
    // which include also include checked status
    // 0: {name: 'food', checked: true} 1: {name: 'ipad', checked: false} 
    savedItems.push(newItem);
    updateLocalStorage();
    displayItems();
    userInput.value = '';
  }
});

// Clear Btn 
clearBtn.addEventListener('click',() => {
  localStorage.clear();
  itemContainer.innerHTML = '';
})

// What to include in every row
// ternary operator below this code mean if item is checked, then its style will be checked (ticked)
// if it's checked,then the text decoration will add a line through
// if it's checked then the edit btn will be disabled
function createItemRow(item) {
  const tr = document.createElement('tr');
  if(item){
  tr.innerHTML = `
    <div class="d-flex flex-row justify-evenly">
      <input type="checkbox" class="form-check-input" name="checkedItems" ${item.checked ? ' checked' : ''}/> 
      <td class="item-name">
        <span class="label-text form-check-label text-lg"${item.checked ? ' style="text-decoration: line-through;"' : ''}>${item.name}</span>
      </td>
      <div class="d-flex flex-row justify-evenly">
      <button><span class="edit-btn material-icons-sharp">
      edit</span></button>
      <button><span class="delete-btn material-icons-sharp">delete</span></button>
      </div>
    </div>
  `;
  }
  return tr;
}

// Function to display items in the item container
function displayItems() {
  itemContainer.innerHTML = '';
  itemContainer.style.textTransform = 'uppercase';
  savedItems.forEach(item => {
    const tr = createItemRow(item);
    itemContainer.appendChild(tr);
  });
}

// Function to update items in local storage
function updateLocalStorage() {
  // 'items' chosen as a key to identify for data retrieval and store the 'saveItems' array in local storage
  localStorage.setItem('items', JSON.stringify(savedItems));
}


// EDIT ITEM
itemContainer.addEventListener('click', (event) => {
  // see when you clicking the ele that include a class "edit-btn" = clicking the edit btn
  if (event.target.classList.contains('edit-btn')) {
     // target the span ele that hold the user's input
    const tr = event.target.closest('tr');
    const span = tr.querySelector('.label-text');
     // create another input field to allow user update the item
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.style.textTransform = 'uppercase';
    input.style.background = 'transparent';
    input.style.textAlign = 'center';

    // replace the span item with input field, so user can type 
    span.replaceWith(input);
    input.focus(); //automatically add visible indication for a focused text field
    
    // 'blur' is an opposite of focus event, when user finish input and click out the input field it will fire
    input.addEventListener('blur', () => {
      const updatedItemName = input.value;
      // the input value will be updated and added to the saveItem array
      span.textContent = updatedItemName;
      input.replaceWith(span); // it will then become a read-only ele 

      // This will return the position(index) of the edited item 
      // Array.from(itemContainer.children) -> return 'tr' -> indexOf(tr) -> return index(position) of the edited item
      const index = Array.from(itemContainer.children).indexOf(tr);
      // if the current element is found in the existing array
      if (index !== -1) {
        // save the new input item name into the savedItems object array with the correct position from the index value
        savedItems[index].name = updatedItemName;
        updateLocalStorage();
      }
    });
  }
});

// TICK OFF ITEM
itemContainer.addEventListener('click', (event) => {
  // see when you clicking the ele that include a class "checkbox" = clicking the checkbox
  if (event.target.classList.contains('checkbox')) {
     // target the row that the checkbox located in
    const tr = event.target.closest('tr');
    // the item on that row
    const span = tr.querySelector('.label-text');
    const checkBox = tr.querySelector('.checkbox');
    const editBtn = tr.querySelector('.edit-btn');
    
    // find() is a an array method that return the first ele in the array that satisfy the things in inside the () 
    // we want to check if 'name' of each item in the savedItems array, whether its content equal to the text content in span ele
    // if yes, then it will be assign to item variable
    const item = savedItems.find(item => item.name === span.textContent);

    // if the matching item is found
    if (item) {
      // assign the value of checked property of the item object
      item.checked = checkBox.checked;
      // if checked is true
      if (item.checked) {
        // excute all these styles
        span.style.textDecoration = 'line-through';
        checkBox.disabled = true;
        editBtn.disabled = true;
      } else {
        span.style.textDecoration = '';
        checkBox.disabled = false;
        editBtn.disabled = false;
      }
      updateLocalStorage();
    }
  }
});

// del item 
itemContainer.addEventListener('click', (event) => {
const delBtn = document.querySelector('.delete-btn');
if (event.target.classList.contains('delete-btn')) {
  const tr = event.target.closest('tr');
  const index = Array.from(itemContainer.children).indexOf(tr);
  savedItems.splice(index,1);
  updateLocalStorage();
  displayItems();
}
});


