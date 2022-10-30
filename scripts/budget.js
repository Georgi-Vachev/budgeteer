import {e, tr, td, button, monthName, categories, genID, setBudgets, getBudgets} from './util.js';

const budgets = getBudgets()

const tbody = document.querySelector('tbody');
const form = document.getElementById('new-budget');

let editMode = false;
let rowToEdit;
console.log(budgets)
form.addEventListener('submit', onSubmit)

function onSubmit(event){

    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if(!editMode){
        
        const record = {
            id: genID(), //generate uniqe ID for each row
            ...data
        };

        if (Object.values(record).every(x => x) == false){ //do nothing if 1 or more fields are empty
            return;
        };
        
        budgets.set(record.id, record);
        const row = createNewRow(record);
        tbody.append(row);

    }else if(editMode){
        
        //use form data to change record data in records map
 
        budgets.set(rowToEdit, {id: rowToEdit, ...data});

        rowToEdit = null;
        editMode = false;
        
    }

    form.reset();
    setBudgets(budgets);
    populate();
}

function createNewRow(record){

    const {id, month, income, budget} = record;

    const dateAsString = `${monthName[Number(month.split("-")[0])]}.${month.split("-")[1]}`;
    console.log(dateAsString);
    const row = tr(
        td(dateAsString),
        td(e('span', {className: 'currency'} , income)),
        td(e('span', {className: 'currency'} , budget)),
        td(button('Edit', (event) => editRow(event)), button('Delete', () => deleteRow(row))), //pass label and onlick function
    );
    
    row.id = id; 

    return row;
}

function editRow(event){
    editMode = true;
    rowToEdit = event.target.parentElement.parentElement.id;
  
    //populate form with row info from records
    form.querySelector('[name="month"]').value = budgets.get(rowToEdit).month;
    form.querySelector('[name="income"]').value = budgets.get(rowToEdit).income;
    form.querySelector('[name="budget"]').value = budgets.get(rowToEdit).budget;
}

function deleteRow(row){

    if(confirm("Are you sure you want to delete this record?")){
        row.remove();
        budgets.delete(row.id);
        setBudgets(budgets);
    }
    
}

function populate(){
    tbody.replaceChildren(...[...budgets.values()].map(createNewRow));
}

populate();