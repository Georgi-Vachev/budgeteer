export function e(type, attributes, ...content){
    const result = document.createElement(type);

    for (let key in attributes){
        if(key.slice(0,2) == 'on'){
            result.addEventListener(key.slice(2), attributes[key]);
        }else {
            result[key] = attributes[key];
        }
    }

    for(let item of content){
        result.append(item);
    }

    return result;
}

export const tr = e.bind(null, 'tr', {});
export const td = e.bind(null, 'td', {});
export const th = e.bind(null, 'th', {});
export const button = (label, onClick, attributes = {}) => e('button',Object.assign(attributes, {onclick: onClick}), label)


export const monthName = [
    "",
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

export const categories = {
    "0": "Other",
    "1": "Utilities",
    "2": "Groceries",
    "3": "Entertainment",
    "4": "Transport"
}

export function genID(){
    return ('00000000' + (Math.random() * 999999 | 0).toString(16)).slice(-8);
}

export function setData(data){
    const values = [...data.values()];
    localStorage.setItem('records', JSON.stringify(values));
}

export function getData(){
    const values = JSON.parse(localStorage.getItem('records'));
    if(!values){
        return new Map()
    }else{
        return new Map(values.map(e => [e.id, e]));
    }
}

export function setBudgets(data){
    const values = [...data.values()];
    localStorage.setItem('budgets', JSON.stringify(values));
}

export function getBudgets(){
    const values = JSON.parse(localStorage.getItem('budgets'));
    if(!values){
        return new Map()
    }else{
        return new Map(values.map(e => [e.id, e]));
    }
}