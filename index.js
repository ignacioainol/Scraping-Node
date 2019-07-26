const cheerio = require('cheerio');
const request = require('request');

request('https://www.paris.cl/tecnologia/celulares/?sz=40&start=0', function(err,res,body){
	if(!err && res.statusCode == 200){
		 var $ = cheerio.load(body);
		 //console.log($('title').text());

		 $('h3 span').each(function(i,element){
		 	console.log($(element).text());
		 })
	}
});