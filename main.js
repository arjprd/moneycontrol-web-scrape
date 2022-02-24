const express = require('express');
const stock = require("./stock");


const operation = process.argv.length == 3? process.argv[2] : 'cmd';

if(operation == 'web'){
    const app = express();
    const port = 3000;
    app.get('/', (req, res) => {
        let tableBody = `
        <thead>
            <th>Company Name</td>
            <th>High</td>
            <th>Low</td>
            <th>Latest Price</td>
            <th>Prev Close</td>
            <th>Change</td>
            <th>% Gain/Loss</td>
            <th>Gain/lost since last run</td>
        </thead>
        `;
        stock.invoke().then((data)=>{
            tableBody += "<tbody>"
            Object.keys(data).map((companyName)=>{
                tableBody += `
                <tr style="background-color:${
                    typeof data[companyName]['Gain/lost since last run'] === 'string' ? 'white' : 
                        data[companyName]['Gain/lost since last run'] < 0 ? "red": 
                            data[companyName]['Gain/lost since last run'] == 0 ? "white": "green"
                }">
                    <td>${companyName}</td>
                    <td style="text-align:right;">${data[companyName]['High']}</td>
                    <td style="text-align:right;">${data[companyName]['Low']}</td>
                    <td style="text-align:right;">${data[companyName]['Latest Price']}</td>
                    <td style="text-align:right;">${data[companyName]['Prev Close']}</td>
                    <td style="text-align:right;">${data[companyName]['Change']}</td>
                    <td style="text-align:right;">${data[companyName]['% Gain/Loss']}</td>
                    <td style="text-align:right;">${data[companyName]['Gain/lost since last run']}</td>
                </tr>
                `;
            });
            tableBody += "</tbody>";
            res.send(`
                <style>
                    table, th, td {
                        border: 1px solid black;
                        border-collapse: collapse;
                        padding: 3px;
                    }
                </style>
                <table>
                    ${tableBody}
                </table>
            `);
        })
    })
      
    app.listen(port, () => {
        console.log(`Please visit http://localhost:${port}`);
    })
}else{
    stock.invoke().then((data)=>{
        const finalResponse = Object.keys(data).map((companyName)=>{
            return { "Company Name": companyName, ...data[companyName] }
        });
        console.table(finalResponse, ["Company Name","High","Low","Latest Price","Prev Close","Change","% Gain/Loss","Gain/lost since last run"]);
    })
}