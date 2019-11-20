const axios = require('axios')
const cheerio = require('cheerio')
const urlz = require('url')
const gdrive = require('./gdrive')
let shorturl = ['coeg.in', 'telondasmu.com', 'tetew.info', 'greget.space', 'siherp.com', 'ahexa.com'],
    safeurl = ['njiir.com'],
    safeurl2 = ['eue.siherp.com'],
    safelink2 = ['anjay.info'],
    collect = {};

    const querySearch = (q, u) => {
        if (!u) return null;
        q = q.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + q + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(u);
        return results == null ? null : results[1];
    }
  
const redirect = async (url) => {
    let next = !1
    let urlnya = null

    // let url = `https://anjay.info/?id=${id}`
    console.log(url)
    let { data } = await axios.get(url)

    let $ = cheerio.load(data)
    urlnya = $('#splash').find('a[href*="?r=a"]')
    if (urlnya.length) {
        urlnya = $('#splash').find('a[href*="?r=a"]').attr('href');
        urlnya = Buffer.from(querySearch('r', urlnya), 'base64').toString('ascii');
    } else {
        if (safeurl.indexOf(urlz.parse(url).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1) {
            urlnya = decodeURIComponent(querySearch('url', url))
            urlnya = decodeURIComponent(Buffer.from(urlnya, 'base64').toString('ascii').substr(2).split('').reverse().join('').substr(2).split('').reverse().join(''))
            let build = '';
            for (let i = 0; i < urlnya.length; i++) {
                build = String.fromCharCode(40 ^ urlnya.charCodeAt(i)) + build;
            }
            urlnya = build
        } else if (safeurl2.indexOf(urlz.parse(url).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1) {
            urlnya = decodeURIComponent(querySearch('url', url))
            urlnya = decodeURIComponent(Buffer.from(urlnya, 'base64').toString('ascii'))
        } else if (safelink2.indexOf(urlz.parse(url).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1) {
            var params = new URLSearchParams();
            params.append('eastsafelink_id', querySearch('id', url));
            let { data } = await axios.post('https://www.anjay.info/cluster-detection/', params).then(a => a)
            urlnya = data.match(/var a='(https?:\/\/[^ ]*)'/)[1]
            next = false
        } else {
            urlnya = url
        }
    }
    next = [...shorturl, ...safeurl, ...safeurl2, ...safelink2].indexOf(urlz.parse(urlnya).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]) !== -1 ? urlnya : false;
    if (next) {
        // url = next
        console.log(next)
       return redirect(next)
    } else {
        
            // console.log(`URL : ${urlnya}`)
            const nyaUrl = urlnya.toString()
            const idDrive = nyaUrl.substring(nyaUrl.lastIndexOf('=')+1,nyaUrl.length);
        return gdrive.getStreamFiles(idDrive)
        
    }
    
}

// redirect('https://anjay.info/?id=VWErNWlBZmpCUlMvT0pxVHE3YS84Z1JmeE9WeDM2ZkVJbVV3eGg4MlNzTTRzcFprKzY0eWV6OWpyOUNYclRFNA==').then(console.log)
// extractUrl('https://anjay.info?id=VWErNWlBZmpCUlMvT0pxVHE3YS84b2dZcTZ2Z0l6eUh6SEVrc3NOVUtDQU5iWEs1blh4aWdWU1U2MThYVDdwRg==')

const Extract = {
    redirect
}

module.exports = Extract