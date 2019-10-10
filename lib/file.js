const { getHtml } = require('./html');
const {gShareUrl} = require ('./constant')

const getGSharer = async url => {
    const html = await getHtml(url.includes('play') ? url : `${url}/play`);
    const GSharer = parseInt(html.split(`data-tmdb="`)[1].split(`"`)[0]);
    return GSharer;
};

// https://g.kotakungu.casa/gsharer/?gsharer=384018&gshareruri=https%3A%2F%2Fidxx1.club%2Fmovie%2Ffast-and-furious-presents-hobbs-and-shaw-2019-88b6%2Fplay&gsharertitle=[idxx1.club]-[idxx1.club]-Fast-%26-Furious-Presents:-Hobbs-%26-Shaw-(2019)|
const getHtmlSource = async url => {
    const urlEncoded = encodeURIComponent(url);
    const GSharer = await getGSharer(url);
    const aa = url.substring(url.lastIndexOf('/')+1);
    const title = encodeURIComponent(aa);
    // https://g.kotakungu.casa/gsharer/?gsharer=384018&gshareruri=https%3A%2F%2Fidxx1.club%2Fmovie%2Ffast-and-furious-presents-hobbs-and-shaw-2019-88b6%2Fplay&gsharertitle=[idxx1.club]-Fast-%26-Furious-Presents:-Hobbs-%26-Shaw-(2019)|&gid=https%3A%2F%2Faccounts.google.com%2Fo%2Foauth2%2Fauth%3Faccess_type%3Doffline%26client_id%3D163251392067-q1d4s9pab7vqnbtl6at4bhlnvk7gjo7o.apps.googleusercontent.com%26redirect_uri%3Durn%253Aietf%253Awg%253Aoauth%253A2.0%253Aoob%26response_type%3Dcode%26scope%3Dhttps%253A%252F%252Fwww.googleapis.com%252Fauth%252Fdrive%2520https%253A%252F%252Fwww.googleapis.com%252Fauth%252Fphotoslibrary%2520https%253A%252F%252Fwww.googleapis.com%252Fauth%252Fphotoslibrary.sharing%26state%3Dstate
    let urlRequest = `https://g.kotaksilver.casa/gsharer/?gsharer=${GSharer}&gshareruri=${urlEncoded}&gsharertitle=[idxx1.club]-${title}`;
    let html = await getHtml(urlRequest);
    // console.log(aa)
    return html;
};

const getSources = async url => {
    try {
        let html = await getHtmlSource(url);
    if (html.includes('expired')) {
        let newUrl = null;
        if (url.includes('play')) {
            newUrl = url.replace('/play', '');
        } else {
            newUrl = url + '/play';
        }
        html = await getHtmlSource(newUrl);
    }
    if (html.includes('expired')) return [];
    const stringSources = html.split(`localStorage.gsharerfile = '`)[1].split(`'`)[0];
    const sources = JSON.parse(stringSources);
    return sources.map(s => {
        let files = s.sources;
        const type = s.meta.type;
        // let driveid = undefined;
        // if (type === 'drives_muvi' || type === 'drives_lk21' || type.includes('drives_')) {
        //     const fileUrl = files[0].file;
        //     if (fileUrl.includes('driveid')) {
        //         driveid = fileUrl.split('driveid=')[1].split('&')[0];
        //         files = [];
        //     }
        // }

        return files;
    });
    } catch (error) {
        return [];
    }
    

};

const getSubs = async (url, urlReq = null) => {
    const baseUrl = `https://sub.akubebas.com`;
    const GSharer = urlReq ? null : await getGSharer(url);
    const urlRequest = urlReq || `${baseUrl}/muvi/${GSharer}/`;
    const html = await getHtml(urlRequest);
    const splitted = html.split(`A HREF="`).filter((a, i) => i !== 0 && i !== 1);
    const links = html
        .split(`A HREF="`)
        .filter((a, i) => i !== 0 && i !== 1)
        .map(a => a.split(`">`)[0]);
    let linkFiles = links.filter(l => l.includes('.srt')).map(u => baseUrl + u);
    const linkFolders = links.filter(l => l.split('').reverse()[0] === '/');
    for (let i = 0; i < linkFolders.length; i++) {
        const url = `${baseUrl}${linkFolders[i]}`;
        const files = await getSubs(null, url);
        linkFiles = linkFiles.concat(files);
    }
    return linkFiles;
};

// const url = `https://idxx1.cam/movie/aladdin-2019-90pd/play`;
// getSources(url)
// .then(console.log).catch(console.log)

// getSubs('https://indoxxi.cx/movie/hellboy-2019-9sf8').then(console.log)

module.exports = {
    getSources,
    getSubs
};
