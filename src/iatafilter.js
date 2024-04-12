const fs = require("fs");
const airportsRaw = require('./airports_raw_2.json');
// const readline = require('readline')

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

const majorFilter = [
    "ATL",
    "DXB",
    "DFW",
    "LHR",
    "HND",
    "DEN",
    "IST",
    "LAX",
    "ORD",
    "DEL",
    "CGK",
    "CDG",
    "CAN",
    "JFK",
    "AMS",
    "MAD",
    "FRA",
    "SIN",
    "MCO",
    "LAS",
    "ICN",
    "PVG",
    "CLT",
    "PEK",
    "SZX",
    "MIA",
    "BKK",
    "BOM",
    "SEA",
    "SFO",
    "BCN",
    "EWR",
    "PHX",
    "MEX",
    "KUL",
    "IAH",
    "DOH",
    "MNL",
    "YYZ",
    "JED",
    "SHA",
    "GRU",
    "LGW",
    "HKG",
    "SYD",
    "MUC",
    "MAN",
    "FCO",
    "ORY",
    "ZRH",
    "CPH",
    "PHL",
    "YHZ",
    "BER",
    "VIE",
    "MAD",
    "MXP",
    "LIN",
    "WAW",
    "BRU",
    "GVA",
    "ATH",
    "LCY",
    "ARN",
    "HEL",
    "BUD",
    "ZAG",
    "PRG",
    "LUX",
    "OSL",
    "PMI",
    "VCE",
    "MAN",
    "SOF",
    "HND",
    "CAI",
    "KEF",
    "TUN",
    "CPT",
    "SPU",
    "BEY",
    "ALG",
    "JNB",
    "RUH",
    "ESB",
    "BAH",
    "YUL",
    "TPE",
    "HAN",
    "KWI",
    "NAP",
    "SJJ",
    "LOS",
    "GYD",
    "DBV",
    "HKT",
    "BGI",
    "ANU"
]

const major_airports = airportsRaw
    .filter(p => majorFilter.includes(p.code))
    .map(({code, lat, lon, name, city, state, country}) => ({iata: code, lat, lng: lon, name, city, state, country, answered: false, correct: false}));


// const aploop = (i) => {
//     rl.question(`For ${major_airports[i].iata}: `, input => {
//         if (input.toUpperCase() === "NEXT") {
//             rl.removeListener('line', aploop);
//             console.log(major_airports[i].destinations);
//             if (i < major_airports.length - 1) {
//                 major_airports[i + 1].destinations = [];
//                 aploop(i + 1);
//             } else {
//                 rl.close();
//                 save();
//             }
//         } else {
//             if (majorFilter.includes(input.toUpperCase())) {
//                 major_airports[i].destinations.push(input.toUpperCase());
//             }
//             aploop(i);
//         }
//     });
// };

// major_airports[0].destinations = [];
// aploop(0);


// const save = () => {
    const jsonData = JSON.stringify(major_airports, null, 2); // The '2' is for indentation

    fs.writeFile('major_airports_3.json', jsonData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Filtered airports data has been written to filtered_airports.json');
        }
    });
// }