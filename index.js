const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();

//const smartPhone = fs.readFileSync('./items.json');
//const smartPhoneParis = JSON.parse(smartPhone);
const valuesOk = [];

//[SCRAPING TO PARIS.CL]
// const baseUrl = "https://www.paris.cl";
// const initialUrl = '/tecnologia/celulares/?sz=40&start=0';

// function scrapeUrl(url,items){
// 	console.log('requesting ...', url)
// 	return axios.get(url)
// 	.then(response => {
// 		const $ = cheerio.load(response.data);
// 		const pageItems = $('#search-result-items li').toArray()
// 			.map(item => {
// 				const $item = $(item);
// 				let title = $item.find('.ellipsis_text').text();
// 				//let strPos_title = title.includes('Plan');
// 				let checkDcto = $item.find('.discount-badge').text();
// 					if(checkDcto && parseInt(checkDcto) > 70 && !title.includes("Plan") && !title.includes("Carcasa")){
// 						valuesOk.push( {
// 							title: $item.find('.ellipsis_text').text(),
// 							dcto: parseInt($item.find('.discount-badge').text()),
// 							price: $item.find('.item-price').text().replace(/\n/g, '').substring(0, 8),
// 							link:'https://www.paris.cl/' +  $item.find('.thumb-link').attr('href')
// 						})
// 					}
					
// 			})
// 		const nextLink = $('.page-next').attr('href');
// 		const totalItems = items.concat(pageItems);
// 		console.log(nextLink);
// 		return nextLink ? scrapeUrl(nextLink, totalItems) : items;
// 	})	
// }
	
// scrapeUrl(baseUrl + initialUrl,[])
// 	.then(() => {
// 		fs.writeFile('./items.json',JSON.stringify(valuesOk), function(err){
// 			if(err) return console.log(err);
// 			console.log("Items saved !");

// 		})
// 	})
//[/SCRAPING TO PARIS.CL]

// ------------------------------------------------------------------------

// [SCRAPING TO RIPLEY.CL]
const baseUrlRipley = "https://simple.ripley.cl/tecno/telefonia/smartphones";
const initialUrlRipley = '?source=menu&page=1';

function scrapeUrlRipley(url,items){
	console.log('requesting ...', url)
	return axios.get(url)
	.then(response => {
		const $ = cheerio.load(response.data);
		const pageItems = $('.catalog-container .catalog-product-item').toArray()
			.map(item => {
				const $item = $(item);
				//let title = $item.find('.ellipsis_text').text();
				//let strPos_title = title.includes('Plan');
				//let checkDcto = $item.find('.discount-badge').text();
						valuesOk.push( {
							title: $item.find('.catalog-product-details__name').text(),
							dcto: Math.abs(parseInt($item.find('.catalog-product-details__discount-tag').text())),
							price: '',
							link: ''
						})
			})
		const nextLink = $('#catalog-page .catalog-page__footer-pagination ul.pagination li a').last().attr('href');
		if(nextLink.includes('?source=menu')){
			const totalItems = items.concat(pageItems);
			console.log("next link: " + nextLink);
			return nextLink ? scrapeUrlRipley(baseUrlRipley + nextLink, totalItems) : items;
		}
	})	
}

scrapeUrlRipley(baseUrlRipley + initialUrlRipley,[])
	.then(() => {
		fs.writeFile('./items.json',JSON.stringify(valuesOk), function(err){
			if(err) return console.log(err);
			console.log("Items saved !");

		})
	})

// [/SCRAPING TO RIPLEY.CL]

app.get('/',(req,res) => {
	res.json(valuesOk);
});

app.listen(3000, () => {
	console.log("server on port 3000");
})