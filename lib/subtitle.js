const { getHtml } = require("./html");
const cheerio = require('cheerio');
const constantBase = require("./constant");

async function getList(url) {
  const html = await getHtml(url);
  const $ = cheerio.load(html);
  const titles = [];
  const urls = [];
  const languages = [];
  const owners = []
  $("tr > td.a1 > a").each((i, e) => {
    const aText = $(e)
      .text()
      .split("\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t");
    urls.push($(e).attr("href"));
    titles.push(aText[1].replace(" \n\t\t\t\t\t\n\t\t\t\t", ""));
    languages.push(aText[0].replace("\n\t\t\t\t\t\n\t\t\t\t\t\t", ""));

  });

  $("tr > td.a5 > a").each((i, e) => {
    const owner = $(e)
      .text()
      .split("\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t");
    // urls.push($(e).attr("href"));
    
    const ownerName = owner[0].replace("\n\t\t\t\t","").replace("\n\t\t\t","") || "-";
    owners.push(ownerName)
   
  });
//   console.log(owners)
  const result = titles.map((title, index) => {
      
    return {
      title,
      url: constantBase.subsceneUrl + urls[index],
      language: languages[index],
      owners: owners[index]
    };
  });
  return result;
}

async function getDownloadLink(url) {
    const html = await getHtml(url);
    const $ = cheerio.load(html);
    return constantBase.subsceneUrl + $(".download > a").attr("href");
  }


// getList("https://subscene.com/subtitles/logan-2017/indonesian").then(console.log);
// getDownloadLink("https://subscene.com/subtitles/spider-man-homecoming/indonesian/1636874").then(console.log);




module.exports = { getList, getDownloadLink };