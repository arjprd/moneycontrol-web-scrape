const axios = require("axios");
const cheerio = require('cheerio');
const fs = require('fs');


let localDB = {};

module.exports = {
    getCurrentGainers: async () => {
        const response = await axios.get("https://www.moneycontrol.com/stocks/marketstats/nsegainer/index.php");
        const dom = cheerio.load(response.data);
        const rows = dom('.bsr_table.hist_tbl_hm > table > tbody').children('tr');//new jsdom.JSDOM(dom('#mc_content').html());
    
        rows.map(function(row) {
            const columns = dom(rows[row]).children('td');
            const companyName = dom(columns[0]).find('h3 a').text();
            const high = Number(dom(columns[1]).text().replace(/,/g,''));
            const low = Number(dom(columns[2]).text().replace(/,/g,''));
            const lastPrice = Number(dom(columns[3]).text().replace(/,/g,''));
            const prevClose = Number(dom(columns[4]).text().replace(/,/g,''));
            const change = Number(dom(columns[5]).text().replace(/,/g,''));
            const gain = Number(dom(columns[6]).text().replace(/,/g,''));
            if(localDB[companyName]){
                const previousGain = localDB[companyName]["% Gain/Loss"];
                localDB[companyName] = {
                    "High": high,
                    "Low": low,
                    "Latest Price": lastPrice,
                    "Prev Close": prevClose, 
                    "Change": change,
                    "% Gain/Loss": gain,
                };
                localDB[companyName]["Gain/lost since last run"] = gain - previousGain; 
            }else{
                localDB[companyName] = {
                    "High": high,
                    "Low": low,
                    "Latest Price": lastPrice,
                    "Prev Close": prevClose, 
                    "Change": change,
                    "% Gain/Loss": gain,
                    "Gain/lost since last run": "New Entrant",
                };
            }
        })
    },
    getCurrentLooser: async () => {
        const response = await axios.get("https://www.moneycontrol.com/stocks/marketstats/nseloser/index.php");
        const dom = cheerio.load(response.data);
        const rows = dom('.bsr_table.hist_tbl_hm > table > tbody').children('tr');//new jsdom.JSDOM(dom('#mc_content').html());
    
        rows.map(function(row) {
            const columns = dom(rows[row]).children('td');
            const companyName = dom(columns[0]).find('h3 a').text();
            const high = Number(dom(columns[1]).text().replace(/,/g,''));
            const low = Number(dom(columns[2]).text().replace(/,/g,''));
            const lastPrice = Number(dom(columns[3]).text().replace(/,/g,''));
            const prevClose = Number(dom(columns[4]).text().replace(/,/g,''));
            const change = Number(dom(columns[5]).text().replace(/,/g,''));
            const gain = Number(dom(columns[6]).text().replace(/,/g,''));
            if(localDB[companyName]){
                const previousGain = localDB[companyName]["% Gain/Loss"];
                localDB[companyName] = {
                    "High": high,
                    "Low": low,
                    "Latest Price": lastPrice,
                    "Prev Close": prevClose, 
                    "Change": change,
                    "% Gain/Loss": gain,
                };
                localDB[companyName]["Gain/lost since last run"] = gain - previousGain; 
            }else{
                localDB[companyName] = {
                    "High": high,
                    "Low": low,
                    "Latest Price": lastPrice,
                    "Prev Close": prevClose, 
                    "Change": change,
                    "% Gain/Loss": gain,
                    "Gain/lost since last run": "New Entrant",
                };
            }
        })
    },
    invoke: async () => {
        const localDBRaw = fs.readFileSync("localDB.json");
        localDB = JSON.parse(localDBRaw);
        const promiseList = []
        promiseList.push(module.exports.getCurrentGainers());
        promiseList.push(module.exports.getCurrentLooser());
        await Promise.allSettled(promiseList);
        fs.writeFileSync('localDB.json', JSON.stringify(localDB));
        return localDB;
    }
}