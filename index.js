
const file = require("./lib/detail");
const constant = require('./lib/constant');
const homefile = require('./lib/home');
const radiofile = require('./lib/radio');
const anime = require("./lib/anime");
const redirect = require('./lib/redirect');
const listMovie = require('./lib/list_movie');
const baseUrl = constant.baseUrl;
const recomend = homefile.recomended;
const baseDetailUrl = constant.baseDetailUrl;
const response = require('./lib/res')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const cool = require('cool-ascii-faces')
const express = require('express');
const app = express();
// const port = 3000;
const port = process.env.PORT || 5000


app.listen(port,function(){
    console.log('listen port '+port)
})
app.get('/ping',(req,res)=>{

    res.send('masuk')
})

app.get("/", async function (req, res, next) {
    const page = req.params.page;
	const url = 'indoxx1';
    const result = await listMovie.getListByUrl(url);
    const section={}
    const list = []
    section['title'] = 'Film baru di upload'
    section['subtitle'] = ''
    section['label'] = ''
    section ['section'] = 1
    section ['data'] = result
    list.push(recomend,section,homefile.terpopuler,homefile.animeted,homefile.marvel,homefile.baper,homefile.scfi,homefile.fantasy,homefile.comedy)
	response.ok(list,res);
	// response.ok(result,res);
});

app.get("/category/:category/:page", async function (req, res, next) {
	const page = req.params.page;
	const category = req.params.category;
	const result = await listMovie.getListByCategory(page, category);
	response.ok(result,res);
});

app.get("/production/:category/:page", async function (req, res, next) {
	const page = req.params.page;
	const category = 'production/'+req.params.category;
	const result = await listMovie.getListByCategory(page, category);
	response.ok(result,res);
});


app.get("/filter/:category/:filter/:page", async function (req, res, next) {
	const page = req.params.page;
	const url = `muvi/${req.params.category}/all/all/id/${req.params.filter}`;
	const result = await listMovie.getListByCategory(page, url);
	response.ok(result,res);
});

app.get("/movie/category/query/", async function (req, res, next) {
    var query = req.query;
    var category = query.category;
    var filter = query.filter
	const url = `muvi/${category}all/all/id/${filter}`
	const result = await listMovie.getListByCategory(1, url);
	response.ok(result,res);
});

app.get("/search/:query", async function (req, res, next) {
	const page = req.params.page;
	const category = req.params.query;
	const result = await listMovie.searchMovies(category);
	response.ok(result,res);
});

app.get("/movie/detail/:slug", async function (req, res, next) {
	const url = baseDetailUrl + "/movie/" + req.params.slug;
    const result = await file.getDetail(url);
   
	response.ok(result,res);
	// response.ok(result,res);
});

app.get("/anime/:page", async function (req, res, next) {
	const page =req.params.page
    const result = await anime.getList(page);
	response.ok(result,res);
	// response.ok(result,res);
});
app.get("/anime/detail/:slug", async function (req, res, next) {
	const slug =req.params.slug
    const result = await anime.getDetail(slug);
	response.ok(result,res);
	// response.ok(result,res);
});

app.get("/anime/redirect/:id", async function (req, res, next) {
	const id =`https://anjay.info/?id=${req.params.id}`
    const result = await redirect.redirect(id)
	response.ok(result,res);
	// response.ok(result,res);
});

app.get('/cool', (req, res) => res.send(cool()))

app.get('/radio', function (req, res, next) {
	response.ok(radiofile.home,res)
 });




// app.get("/source/:slug", async function (req, res, next) {
// 	const url = baseDetailUrl + "/movie/" + req.params.slug;
// 	console.log(url)
// 	const result = await file.getDetail(url);
// 	response.ok(result,res);
// });

