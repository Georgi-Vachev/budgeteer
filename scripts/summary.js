import {getData, getBudgets, categories, monthName} from "./util.js"

const records = getData();
const budgets = getBudgets();
const rows = document.querySelectorAll('tr');
const summary = new Map();
let pageModifier = 0;

for(let month of budgets.values()){
    summary.set(month.month, {
        "Utilities": 0,
        "Groceries": 0,
        "Entertainment": 0,
        "Transport": 0,
        "Other": 0,
        "Total Spent": 0,
        "Budget Overruns": month.budget,
        "Savings": month.income
    })
}

// summerize records for each month category
for(let record of records.values()){
    const recCat = categories[record.category];
    const date = `${record.date.split("-")[1]}-${record.date.split("-")[0]}`;
    const amount = Number(record.amount);

    if(summary.has(date)){
        let currentMonth = summary.get(date);
        currentMonth[recCat] += amount;
        currentMonth["Total Spent"] += amount;
        currentMonth["Budget Overruns"] -= amount;
        currentMonth["Savings"] -= amount;
    }
    
}

const summArr = [...summary];

document.getElementsByTagName('button')[0].addEventListener('click', () => loadPrevMonths());
document.getElementsByTagName('button')[1].addEventListener('click', () => loadNextMonths());

fillTable()

function fillTable(){
    for(let i = 1; i <= 3; i++){
        //rows[0].children[i].innerHTML = monthName[Number(summArr[i-1+pageModifier][0].split("-")[0])]
        rows[0].children[i].innerHTML = summArr[i-1+pageModifier][0]
    }

    for(let i = 1; i <= 8; i++){
        let category = rows[i].children[0].innerHTML;
        let total = 0;
        
        for(let k = 1; k <= 3; k++){

            if(category == "Budget Overruns"){
                if(Number(summArr[k-1+pageModifier][1][category]) < 0){
                    summArr[k-1+pageModifier][1][category] *= 1;
                }else if(Number(summArr[k-1+pageModifier][1][category]) > 0){
                    summArr[k-1+pageModifier][1][category] = 0;
                }
            }else if(category == "Savings"){
                if(Number(summArr[k-1+pageModifier][1][category]) < 0){
                    summArr[k-1+pageModifier][1][category] = 0;
                }
            }
            
            rows[i].children[k].children[0].innerHTML = summArr[k-1+pageModifier][1][category];
            total += summArr[k-1+pageModifier][1][category];
        }
        rows[i].children[4].children[0].innerHTML = total;
    }
}

function loadPrevMonths(){
    console.log('show prev months')
    if(pageModifier == 0){
        return;
    }else if(pageModifier > 0){
        pageModifier--;
        fillTable();
    }
}

function loadNextMonths(){
    console.log('show next months')
    if(pageModifier >= summArr.length-3){
        return;
    }else if(pageModifier < summArr.length){
        pageModifier++;
        fillTable();
    }
}


