const cheerio = require('cheerio');
const axios = require('axios');

var itemsOk = [];

axios.get('https://www.paris.cl/tecnologia/celulares/smartphones/')
	.then(response => {
		const $ = cheerio.load(response.data);
		const items = $('#search-result-items li').toArray()
			.map(item => {
				const $item = $(item);
				if(parseInt($item.find('.discount-badge').text()) >= 57){
					itemsOk.push( {
						title: $item.find('.ellipsis_text').text(),
						dcto: parseInt($item.find('.discount-badge').text()),
						price: $item.find('.item-price').text().replace(/\n/g, ''),
						link:'https://www.paris.cl/' +  $item.find('.thumb-link').attr('href')
					})
				}
			})

	})

setTimeout(function(){
	console.log(itemsOk);
},5000) 