// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-sunrisers-hyderabad-14th-match-1216516/full-scorecard";

let request = require("request");
let cheerio = require("cheerio");
let xlsx = require("xlsx");
let path = require("path");
let fs = require("fs");

function processscorecard(url){
    request(url, cb);
}

function cb(error, response, html){
    if(error){
        console.error(error);
    }
    else{
        extractmatchdetail(html);
    }
}

function extractmatchdetail(html){
    let $ = cheerio.load(html);
    let venueanddate = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3").text();
    // console.log(venueanddate);
    let venueanddatearr = venueanddate.split(",");
    let venue = venueanddatearr[1].trim();
    let date = venueanddatearr[2]+","+venueanddatearr[3];
    date = date.trim();
    // console.log(venue);
    // console.log(date);
    let result = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo").text();
    // console.log(result);

    let inningsarr = $(".ds-rounded-lg.ds-mt-2");
    let htmlstr = "";
    let htmlallrowarr = "";
    for(let i=0; i<inningsarr.length; i++){
        // htmlstr += $(inningsarr[i]).html();
        let teamname = $(inningsarr[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        // console.log(teamname);
        let oppidx = i==0? 1: 0;
        let oppname = $(inningsarr[oppidx]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text();
        // console.log(oppname);
        // console.log(`${venue}  ${date}  ${teamname}  ${oppname}  ${result}`);
        let battingtable = $(inningsarr[i]).find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table");
        let allrowarr = $(battingtable).find("tr");
        // console.log(allrowarr.length)
        // for(let k=0; k<allrowarr.length; k++){
        //     htmlallrowarr += $(allrowarr[k]).html();
        // }
        // console.log(date);
        for(let j=1; j<allrowarr.length; j += 2){
            let allcolarr = $(allrowarr[j]).find("td");
            if($(allcolarr[0]).hasClass("ds-w-0 ds-whitespace-nowrap ds-min-w-max ds-flex ds-items-center") == true){
                let battername = $(allcolarr[0]).text().split("(")[0].trim();
                let runs = $(allcolarr[2]).text().trim();
                let balls = $(allcolarr[3]).text().trim();
                let sixes = $(allcolarr[6]).text().trim();
                let fours = $(allcolarr[5]).text().trim();
                let sr = $(allcolarr[7]).text().trim();
                
                // console.log(`${teamname}  -  ${battername}  ${runs}  ${balls}  ${fours}  ${sixes}  ${sr}`);

                processplayer(teamname, battername, runs, sixes, fours, sr, oppname, venue, date);
            }
        }
        // console.log(" ");
    }
    // console.log(htmlallrowarr);
    // console.log(htmlstr);
}

function processplayer(teamname, battername, runs, sixes, fours, sr, oppname, venue, date){
    let teampathdir = path.join(__dirname, "ipl", teamname);
    dircreator(teampathdir);
    let filepath = path.join(teampathdir, battername+".xlsx");

    let content = excelreader(filepath, battername);
    let playerobj = {
        teamname,
        battername,
        runs,
        sixes,
        fours,
        sr,
        oppname,
        venue,
        date
    }
    content.push(playerobj);

    excelwriter(filepath, content, battername);
}

function dircreator(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath);
    }
}

function excelwriter(filepath, json, sheetname){
    let newwb = xlsx.utils.book_new();
    let newws = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newwb, newws, sheetname, true);
    xlsx.writeFile(newwb, filepath);
}
function excelreader(filepath, sheetname){
    if(fs.existsSync(filepath) == false){
        return [];
    }
    let wb = xlsx.readFile(filepath);
    let ws = wb.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(ws);
    return ans;
}

module.exports = {
    ps: processscorecard
}