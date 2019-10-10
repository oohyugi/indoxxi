const {getHtml} = require('./html');
const cheerio = require('cheerio');
const File = require('./file');

const getDetail = async (url) => {
    const html = await getHtml(url);
    const $ = cheerio.load(html);
    const data = {};
    const sources = await File.getSources(url);
    data['sources'] = sources;
    const slug = url.substring(url.lastIndexOf('/')+1);
    data['slug'] = slug
    // const subtitles = await File.getSubs(url);
    // data['subtitles'] = subtitles;
    console.log(url)
    const cover = $('div[id=mv-ply]').attr('style').replace('background-image:url(', '').split(')')[0];
    data['cover'] = cover;
    $('div.mvi-content').each((i, info) => {
        data['title'] = $(info).find('h3[itemprop=name]').attr('content');
        data['description'] = $(info).find('div[itemprop=description] > span').text();
        $(info).find('div.mvic-info > div.mvici-left > p').each((i, left) => {
            const infoLeft = $(left).text();
            const key = infoLeft.split(': ')[0].replace(' ', '_').toLowerCase();
            const value = infoLeft.split(': ')[1];
            data[key] = value;
        })
        $(info).find('div.mvic-info > div.mvici-right > p').each((i, right) => {
            const infoRight = $(right).text();
            let separator = ': ';
            if (!infoRight.includes('Quality')) {
                const key = infoRight.split(': ')[0].replace(' ', '_').toLowerCase();
                const value = infoRight.split(': ')[1];
                data[key] = value;
            } else {
                const key = infoRight.split(':')[0].toLowerCase();
                const value = infoRight.split(':')[1].split(' ')[1];
                data[key] = value;
            }
        })
    })
    return data;
}

// getDetail('https://idxx1.cam/movie/logan-2017-subtitle-indonesia-5n0r').then(console.log)


const Detail = {
    getDetail
}

module.exports = Detail;