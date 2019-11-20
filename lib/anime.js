const {getHtml} = require('./html')
const cheerio = require('cheerio');
const constantUrl = require('./constant')
const redirectUrl = require('./redirect')


const getList = async (page = null) => {
    let urlRequest = page ? `${constantUrl.baseAnimeUrl}/page/${page}/` : `${baseUrl}`;
    // if (url) urlRequest = url;
    console.log(urlRequest)
    const html = await getHtml(urlRequest);
    const $ = cheerio.load(html);
    const data = [];
    $("div[class='white updateanime']").find("li[itemscope='itemscope']").each((index, item) => {
        const url = $(item).find("a").attr('href').toString().substring(0,$(item).find("a").attr('href').toString().length-1);
        const slug = url.substring(url.lastIndexOf('/')+1,url.length);
        const title = $(item).find('a').attr('title');
        const poster = $(item).find('img').attr('src');
        const release = $(item).find('span').slice(1).eq(0).text();
        const result = {url,title, poster,release,slug};
        console.log(item)

        data.push(result)
    })
    return data;
}

const getListSearch = async (query = "naruto") => {
    let urlRequest = `${constantUrl.baseAnimeUrl}/?s=${encodeURIComponent(query)}`;
    // if (url) urlRequest = url;
    console.log(urlRequest)
    const html = await getHtml(urlRequest);
    const $ = cheerio.load(html);
    const data = [];
    $("div.bs").each((index, item) => {
        const url = $(item).find("a").attr('href');
        const slug = url.substring(0,url.lastIndexOf('/')).substring(url.lastIndexOf('/'),url.length);
        const title = $(item).find('a').attr('alt');
        const poster = $(item).find('img').attr('src');
        // const release = $(item).find('span').slice(1).eq(0).text();
        const result = {url,title,poster,slug};
        console.log(item)

        data.push(result)
    })
    return data;
}

const getDetail = async (slug) => {

    const html = await getHtml(`${constantUrl.baseAnimeUrl}/${slug}`);
    const $ = cheerio.load(html);
    const data = {};
   
    const cover = $("img[class='size-full wp-image-85994 aligncenter']").attr('src');
    data['title'] = $("h1[itemprop='name']").find('b').text();
    data['cover'] = cover;
    const content =  $('div.content_episode');
    
    const desc = content.find('div').slice(1).eq(0)
    data['description'] = desc.find('p').slice(3).eq(0).text();
    data['next_release'] = desc.find('p').slice(2).eq(0).text();
    const htmlDownlod = $('div.download-eps').find('li');
    const linkDownload =[]
    
    
    

    $('div.download-eps').find('li').each((index,item) =>{

        const title = $(item).find('strong').text()
        const quality = {}
        const qualityData =[]
        $(item).find('span').each((index,item2)=>{
            const source = {}
            source['type'] = $(item2).find('a').text();
            const url = $(item2).find('a').attr('href')
            source['file'] = url
            source['label'] = title;
            qualityData.push(source)
        })
        
        quality['data'] = qualityData
        quality['quality'] =title
        quality['type'] =title
        
        linkDownload.push(quality)
        
    })
   
    data['source'] = linkDownload
    return data;
}
// getList(1).then(console.log)
// getListSearch("sao").then(console.log)
// getDetail(`black-clover-episode-105`).then(console.log)

const List ={
    getList,
    getListSearch,
    getDetail
}

module.exports = List