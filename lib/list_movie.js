const { getHtml } = require('./html')
const cheerio = require('cheerio');
const constant = require('./constant');
const Detail = require('./detail');

const getList = async (page = null, prefix, url = null) => {
    const baseUrl = constant.baseUrl;
    let urlRequest = page ? `${baseUrl}/${prefix}/${page}` : `${baseUrl}/${prefix}`;
    if (url) urlRequest = url;
    const html = await getHtml(urlRequest);
    const $ = cheerio.load(html);
    const data = [];
    // const promises = []
    $('div.ml-item').each((index, item) => {

        const url = baseUrl + $(item).find('a.ml-mask').attr('href');
        const title = $(item).find('a.ml-mask').attr('title');
        const poster = $(item).find('img').attr('data-original');
        const quality = $(item).find('span.mli-quality').text();
        const rating = parseFloat($(item).find('span.mli-rating').text()) || "undefined";
        const duration = parseInt($(item).find('span.mli-durasi').text()) || "undefined";
        const slug = url.substring(url.lastIndexOf('/') + 1);

        const result = { url, slug, title, poster, quality, rating, duration };
        data.push(result)
    })
    return data.filter(d => d.url.includes('movie'));
}

const getListByUrl = async (prefix = null) => {
    const baseUrl = constant.baseDetailUrl

    let urlRequest = `${baseUrl}/${prefix}`;
    const html = await getHtml(urlRequest);
    const $ = cheerio.load(html);
    const data = [];
    // const promises = []
    $('div.ml-item').each((index, item) => {

        const url = baseUrl + $(item).find('a.ml-mask').attr('href');
        const title = $(item).find('a.ml-mask').attr('title');
        const poster = $(item).find('img').attr('data-original');
        const quality = $(item).find('span.mli-quality').text();
        const rating = parseFloat($(item).find('span.mli-rating').text()) || "undefined";
        const duration = parseInt($(item).find('span.mli-durasi').text()) || "undefined";
        const slug = url.substring(url.lastIndexOf('/') + 1);

        const result = { url, slug, title, poster, quality, rating, duration };
        data.push(result)
    })
    return data.filter(d => d.url.includes('movie'));
}

const getListWithDetail = async (page = null, prefix, url = null) => {
    const baseUrl = constant.baseUrl;
    let urlRequest = page ? `${baseUrl}/${prefix}/${page}` : `${baseUrl}/${prefix}`;
    if (url) urlRequest = url;
    const html = await getHtml(urlRequest);
    const $ = cheerio.load(html);
    const data = [];
    const newdata = [];
    // const promises = []
    const mData = $('div.ml-item').each((index, item) => {

        const url = baseUrl + $(item).find('a.ml-mask').attr('href');
        const title = $(item).find('a.ml-mask').attr('title');
        const poster = $(item).find('img').attr('data-original');
        const quality = $(item).find('span.mli-quality').text();
        const rating = parseFloat($(item).find('span.mli-rating').text()) || "undefined";
        const duration = parseInt($(item).find('span.mli-durasi').text()) || "undefined";
        const slug = url.substring(url.lastIndexOf('/') + 1);

        const result = { url, slug, title, poster, quality, rating, duration };
        data.push(result)
    })
    await Promise.all(data.map(async (item) => {
        const detail = await Detail.getDetail(item.url)
        // console.log(detail)
        const url = item.url
        const title = item.title
        const slug = item.slug
        const poster = item.poster
        const quality = item.quality
        const rating = item.rating
        const duration = item.duration
        // const 
        const newresult = { url, title, slug, poster, quality, rating, duration, detail };
        newdata.push(newresult)
    }))
    // await Promise.all(promises).then(result=>{
    return newdata.filter(d => d.url.includes('movie'));
}

const getFeaturedMovies = async (page = null) => {
    return getList(page, '21cineplex-unggulan')
}

const getPopularMovies = async (page = null) => {
    return getList(page, '1000-film-terbaik-sepanjang-masa')
}

const getLatestMovies = async (page = null) => {
    return getList(page, 'film-terbaru');
}

const getListByCategory = async (page = null, category = "film-terbaru") => {
    return getList(page, category);
}

const searchMovies = async (query = '') => {
    const url = `${constant.baseUrl}/s/${encodeURIComponent(query)}`;
    console.log(url);
    return getList(null, null, url);
}
// getFeaturedMovies(2).then(console.log)
// getPopularMovies().then(console.log)
// getLatestMovies().then(console.log)
// searchMovies('Iron man').then(console.log)

const ListMovie = {
    getFeaturedMovies,
    getPopularMovies,
    getLatestMovies,
    searchMovies,
    getListByCategory,
    getListByUrl
}

module.exports = ListMovie