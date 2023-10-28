let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let getallmatchesobj = require("./allmatch");

let url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";

let ipldir = path.join(__dirname, "ipl");
dircreator(ipldir);

request(url, cb);

function cb(error, response, html){
    if(error){
        console.error(error);
    }
    else{
        extractresultlink(html);
    }
}
function extractresultlink(html){
    let $ = cheerio.load(html);
    let resultlink = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2").find("a").attr("href");
    // console.log(resultlink);
    let fullresultlink = "https://www.espncricinfo.com" + resultlink;
    // console.log(fullresultlink);
    getallmatchesobj.getallmatches(fullresultlink);
}

function dircreator(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath);
    }
}