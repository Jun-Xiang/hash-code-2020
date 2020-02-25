const fs = require('fs');

let file = fs.readFileSync('./c_incunabula.txt').toString();
let ary = file.split('\n');
let details = ary[0].split(' ');
let days = details[2];
let score = ary[1].split(' ');
let libraryDetails = [];
let index = 0;
ary.shift();
ary.shift();
ary.pop();
ary.pop();
let totalLibsForSignup;
let daysAry = [];
let res = {
    libOrder: [],
    totalBooksForSignUp: [],
    booksToSend: [],
    currentTotal: 0
};

ary.forEach((el, i) => {
    if (i % 2 === 0) {
        let lib = el.split(' ');
        let totalBooks = lib[0];
        let signupDays = lib[1];
        let shipBooksPerDay = lib[2];
        let books = ary[i + 1];
        let details = {
            id: index,
            totalBooks,
            days: signupDays,
            ship: shipBooksPerDay,
            books
        }
        libraryDetails.push(details);
        index++;
    }
})

libraryDetails.sort((a, b) => a.days - b.days);
libraryDetails.forEach((lib, i) => {
    daysAry.push(lib.days);
    res.totalBooksForSignUp.push(days - lib.ship)
})

libraryDetails.forEach((lib, i) => {
    let totalBooksToSend = lib.ship * res.totalBooksForSignUp[i];
    let booksList = lib.books.split(' ');
    let currBooksToSend = [];
    let test = booksList.map(id => [id, score[id]]);
    test.sort((a, b) => b[1] - a[1]);
    let test2 = test.map(ary => ary[0])



    for (let i = 0; i < totalBooksToSend; i++) {
        if (i < booksList.length) currBooksToSend.push(test2[i]);
        else break;
    }
    res.booksToSend.push(currBooksToSend);
})

for (let i = 0; i < daysAry.length; i++) {
    const curr = daysAry[i];
    let libDays = res.currentTotal + parseInt(curr);

    res.currentTotal = libDays
    if (libDays >= days) {
        res.totalLib = i;
        totalLibsForSignup = i - 1;
        break;
    } else if (i === daysAry.length - 1) {
        res.totalLib = i + 1;
        totalLibsForSignup = i
        break;
    }
}

libraryDetails.forEach((lib, i) => {
    if (i <= totalLibsForSignup) res.libOrder.push(lib.id);

})


fs.appendFileSync('./res.txt', `${res.totalLib}\n`);
res.libOrder.forEach((lib, i) => {
    fs.appendFileSync('./res.txt', `${lib} ${res.booksToSend[i].length} \n${res.booksToSend[i].toString().replace(/,/g, ' ')} \n`);
})