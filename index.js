var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

var imgDownloader = function(url,callback){
	request(url, function(err,resp,body){
		 //do something
		var $ = cheerio.load(body);
		var src = $('.featured-image a img').attr('src');
		var title = path.basename(url);
		flname = title+".jpg";
		
		var dir = 'downloads';

		if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
		}

		flname = path.join(dir,flname);

		request(src).pipe(fs.createWriteStream(flname)).on('close',function(){
			console.log('downloaded: '+title);
			callback(); // only download next image when one completes
		});

	});
};

// scrape all links in the page
function pgExtractor(pg, callback){
	console.log("\nloading page: "+pg);
	var baseurl = 'http://www.landingfolio.com/page/'+pg;

	request(baseurl, function(err,resp, body){
		if (err)	
			console.log(err);

		$ = cheerio.load(body);

		var links = [];

		$('.inner').each( function(){
			var item_link = $(this).parent().attr('href');
			if(item_link){
				links.push(item_link);
			}
		});

		function fetchImg(link){
			if(link){
				imgDownloader(link, function(){
					return fetchImg(links.shift());
				});
			}else{
				console.log("downloaded all images");
				callback(pg); // proceed to next page on the list
			}
			
		}
		fetchImg(links.shift());

	});

}

// navigate through pages 
function loadPage(pageNum){
	if(pageNum <= totalPages){
		pgExtractor(pageNum, function(result){
			loadPage(result+1);
		});
	}else{
		console.log("\ndownloaded all the pages");
	}
}

console.log('downloading pages');
var totalPages = 1;
loadPage(1);
