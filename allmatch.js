let request = require("request");
let cheerio = require("cheerio");
let scorecardobj = require("./scorecard");

function getallmatcheslink(url){
    request(url, cb);
    function cb(err, response, html){
        if(err){
            console.error(err);
        }
        else{
            extractallmatches(html);
        }
    }
}
function extractallmatches(html){
    let $ = cheerio.load(html);
    let allmatches = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent");
    // console.log(allmatches.length);
    let htmlstr;
    for(let i=0; i<allmatches.length; i++){
        // htmlstr += $(allmatches[i]).html();
        let matchlink = $(allmatches[i]).find("a").attr("href");
        matchlink = "https://www.espncricinfo.com" + matchlink;
        // console.log(matchlink);
        scorecardobj.ps(matchlink);
    }
    // fs.writeFileSync("allmatch.html",htmlstr);

}

module.exports = {
    getallmatches : getallmatcheslink
}