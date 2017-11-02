const scrapeIt = require("scrape-it");
const download = require('image-downloader');
const mkdirp = require('mkdirp');
const path = require('path');

// var url = "https://www.lapa.ninja"
var url = 'http://www.landingfolio.com';
var pgNum = process.argv[2];

// Promise interface
function scrapeListPage(pgNum){
	// first page loads when page num excluded
	if(pgNum > 1){
			url += /page/+pgNum;
	}

	scrapeIt(url, {
			// fetch the screenshot pages
			pagelinks: {
				listItem: "div.col-md-4",
				data: {
					link: {
						selector: 'a',
						attr: "href"
					}
				}
			}
	}).then(page => {
		var found = page.pagelinks;
		for(var i = 0; i < found.length; i++){
			screenPage = found[i].link;

			if(screenPage != undefined){
				scrapePostPage(screenPage);
			}
		}

	});

}

function scrapePostPage(link){

	scrapeIt(link, {
		imageLink : {
			selector: ".featured-image a img",
			attr: "src"
		},
	}).then( res => {
		linkname = link.split("/");
		filename = linkname[linkname.length - 2] + ".jpg"
		downloadImage(res.imageLink, filename);
	});
}

function downloadImage(imglink,filename){
	var folder = path.join(__dirname,"downloads", pgNum.toString());

	mkdirp(folder,function(err){
		if(err) console.error(err)
		// else console.log("folder created: "+pgNum);
	});

	download.image({url: imglink, dest: path.join(folder,filename)})
		.then(({ filename, image }) => {
			//console.log('completed ', path.basename(filename))
		}).catch((err) => {
			throw err
		})

}

//var img_test = "https://www.lapa.ninja/assets/images/Frederique-Matti.jpg" 
//downloadImage(2, img_test);
// var linkpage = "http://www.landingfolio.com/gallery/headline/"
// scrapePostPage(linkpage);
scrapeListPage(pgNum);
