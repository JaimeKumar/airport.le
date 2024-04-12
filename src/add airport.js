const fs = require("fs");
const airportsRaw = require('./airports_raw_2.json');
const airportsCurrent = require('./airports.json');
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// const majorFilter = [
//     "ATL",
//     "DXB",
//     "DFW",
//     "LHR",
//     "HND",
//     "DEN",
//     "IST",
//     "LAX",
//     "ORD",
//     "DEL",
//     "CGK",
//     "CDG",
//     "CAN",
//     "JFK",
//     "AMS",
//     "MAD",
//     "FRA",
//     "SIN",
//     "MCO",
//     "LAS",
//     "ICN",
//     "PVG",
//     "CLT",
//     "PEK",
//     "SZX",
//     "MIA",
//     "BKK",
//     "BOM",
//     "SEA",
//     "SFO",
//     "BCN",
//     "EWR",
//     "PHX",
//     "MEX",
//     "KUL",
//     "IAH",
//     "DOH",
//     "MNL",
//     "YYZ",
//     "JED",
//     "SHA",
//     "GRU",
//     "LGW",
//     "HKG",
//     "SYD",
//     "MUC",
//     "MAN",
//     "FCO",
//     "ORY",
//     "ZRH",
//     "CPH",
//     "PHL",
//     "YHZ",
//     "BER",
//     "VIE",
//     "MAD",
//     "MXP",
//     "LIN",
//     "WAW",
//     "BRU",
//     "GVA",
//     "ATH",
//     "LCY",
//     "ARN",
//     "HEL",
//     "BUD",
//     "ZAG",
//     "PRG",
//     "LUX",
//     "OSL",
//     "PMI",
//     "VCE",
//     "MAN",
//     "SOF",
//     "HND",
//     "CAI",
//     "KEF",
//     "TUN",
//     "CPT",
//     "SPU",
//     "BEY",
//     "ALG",
//     "JNB",
//     "RUH",
//     "ESB",
//     "BAH",
//     "YUL",
//     "TPE",
//     "HAN",
//     "KWI",
//     "NAP",
//     "SJJ",
//     "LOS",
//     "GYD",
//     "DBV",
//     "HKT",
//     "BGI",
//     "ANU"
// ]

// const major_airports = airportsRaw
//     .filter(p => majorFilter.includes(p.code))
//     .map(({code, lat, lon, name, city, state, country}) => ({iata: code, lat, lng: lon, name, city, state, country, answered: false, correct: false}));


const aploop = (i) => {
    console.log("type 'done' to end")
    rl.question(`Enter airport to add: `, input => {
        if (input.toUpperCase() === "DONE") {
            rl.removeListener('line', aploop);
            save()
        } else {
            // add it with the mapping
        }
    });
};

const save = () => {
    const jsonData = JSON.stringify(major_airports, null, 2); // The '2' is for indentation

    fs.writeFile('airports_.json', jsonData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Filtered airports data has been written to filtered_airports.json');
        }
    });
}