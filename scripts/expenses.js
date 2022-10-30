import {e, tr, td, button, monthName, categories, genID, setData, getData} from './util.js';

//create data structure for the table data
const records = getData(); //get data from local storage

const tbody = document.querySelector('tbody');
const form = document.getElementById('new-expense');
let dateInput = form.querySelector('[name="date"]');
let editMode = false;
let rowToEdit;

//get info for new expense row from the form and add onSubmit event listener 

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
        records.set(record.id, record);
        const row = createNewRow(record);
        tbody.append(row);

    }else if(editMode){
        
        //use form data to change record data in records map
 
        records.set(rowToEdit, {id: rowToEdit, ...data
        });

        rowToEdit = null;
        editMode = false;
        
    }

    form.reset();
    dateInput.value = data.date;
    console.log(records);
    setData(records);
    populate();
}

//create new row with the given info

function createNewRow(record){

    const {id, date, name, category, amount} = record;

    const parsedDate = new Date(date);
    const dateAsString = `${parsedDate.getDate()}.${monthName[parsedDate.getMonth()+1]}`;

    const row = tr(
        td(dateAsString),
        td(name.charAt(0).toUpperCase() + name.slice(1)),
        td(categories[category]),
        td(e('span', {className: 'currency'} , amount)),
        td(button('Edit', (event) => editRow(event)), button('Delete', () => deleteRow(row))), //pass label and onlick function
    );
    
    row.id = id; 

    return row;
}

//add edit and delete functionality
function editRow(event){
    editMode = true;
    rowToEdit = event.target.parentElement.parentElement.id;

    //populate form with row info from records
    form.querySelector('[name="date"]').value = records.get(rowToEdit).date;
    form.querySelector('[name="name"]').value = records.get(rowToEdit).name;
    form.querySelector('[name="category"]').value = records.get(rowToEdit).category;
    form.querySelector('[name="amount"]').value = records.get(rowToEdit).amount;
}

function deleteRow(row){

    if(confirm("Are you sure you want to delete this record?")){
        row.remove();
        records.delete(row.id);
        setData(records);
    }
    
}

//populate table from records

function populate(){
    tbody.replaceChildren(...[...records.values()].map(createNewRow));
}

populate();

//save data in localStorage 

