import { getData, categories, e, getBudgets } from './util.js';

// get data from localStorage
const records = getData();
const budgets = getBudgets();
const summary = summarize(records, categories);
const maxValue = Math.max(...Object.values(summary));
let totalSpent = 0;
let sumOfBudgets = 0;
let sumOfIncome = 0;

for (let month of budgets.values()) {
    sumOfBudgets += Number(month.budget);
    sumOfIncome += Number(month.income);
}

//draw fields
const rows = Object.entries(summary).map(([name, value]) => createSummaryRow(name, value, maxValue))
document.querySelector('.breakdown').replaceChildren(...rows)

// calculate sums and field lenghts
function summarize(records, categories) {
    const summary = {};

    for (let record of records.values()) {
        const catId = record.category;
        if (summary.hasOwnProperty(catId) == false) {
            summary[catId] = [];
        }
        summary[catId].push(record);
    }

    for (let key in summary) {
        summary[key] = summary[key].reduce((a, b) => a + Number(b.amount), 0);
    }

    return Object.fromEntries(Object.entries(summary).map(([catId, sum]) => [categories[catId], sum]))
}

function createSummaryRow(name, value, maxValue) {
    totalSpent += value;
    const bar = e('span', { className: 'bar' })
    bar.style.width = `${value / maxValue * 400 | 0}px`

    const result = e('div', { className: 'cat-row' },
        e('span', { className: 'row label' }, name),
        e('span', { className: 'row value' }, value),
        e('div', { className: 'bar-area' }, bar),
    );

    return result;
}

drawOverview();

function drawOverview() {
    const leftCol = document.querySelector(".left-col");
    const rightCol = document.querySelector(".right-col");

    leftCol.children[0].children[1].innerHTML = totalSpent;
    leftCol.children[1].children[1].innerHTML = sumOfBudgets - totalSpent;
    leftCol.children[2].children[1].innerHTML = sumOfIncome - totalSpent;

    const sumAll = totalSpent + (sumOfBudgets - totalSpent) + (sumOfIncome - totalSpent);

    rightCol.children[0].style.height = `${(totalSpent / (sumAll / 100)) * 3}px`
    rightCol.children[1].style.height = `${((sumOfBudgets - totalSpent) / (sumAll / 100)) * 3}px`
    rightCol.children[2].style.height = `${((sumOfIncome - totalSpent) / (sumAll / 100)) * 3}px`

    console.log(((sumOfBudgets - totalSpent) / (sumAll / 100)) + (totalSpent / (sumAll / 100)) + ((sumOfIncome - totalSpent) / (sumAll / 100)))
}
