const cheerio = require('cheerio');
const axios = require('axios');

axios.get('https://www.paris.cl/tecnologia/celulares/smartphones/')
	.then(response => {
		const $ = cheerio.load(response.data);
		var itemsOk = [];
		const items = $('#search-result-items li').toArray()
			.map(item => {
				const $item = $(item);
				if(parseInt($item.find('.discount-badge').text()) >= 40){
					itemsOk.push( {
						title: $item.find('.ellipsis_text').text(),
						dcto: parseInt($item.find('.discount-badge').text()),
						price: $item.find('.item-price').text().replace(/\n/g, ''),
						link:'https://www.paris.cl/' +  $item.find('.thumb-link').attr('href')
					})
				}
			})

		console.log(itemsOk);
	})