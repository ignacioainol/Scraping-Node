const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const baseUrl = "https://www.paris.cl";
const initialUrl = '/tecnologia/celulares/?sz=40&start=0';

function scrapeUrl(url,items){
	console.log('requesting ...', url)
	return axios.get(url)
	.then(response => {
		const $ = cheerio.load(response.data);
		const pageItems = $('#search-result-items li').toArray()
			.map(item => {
				const $item = $(item);
					return {
						title: $item.find('.ellipsis_text').text(),
						dcto: parseInt($item.find('.discount-badge').text()),
						price: $item.find('.item-price').text().replace(/\n/g, '').substring(0, 8),
						link:'https://www.paris.cl/' +  $item.find('.thumb-link').attr('href')
					}
			})
		const nextLink = $('.page-next').attr('href');
		const totalItems = items.concat(pageItems);
		console.log(nextLink);
		return nextLink ? scrapeUrl(nextLink, totalItems) : items;
	})	
}
	
scrapeUrl(baseUrl + initialUrl,[])
	.then(items => {
		fs.writeFile('./items.json',JSON.stringify(items), function(err){
			if(err) return console.log(err);
			console.log("Items saved !");

		})
	})
