import scrapeIt from 'scrape-it';
import logger from './logger';

const path = require('path');
const download = require('image-downloader');
const mkdirp = require('mkdirp');

let url = 'http://www.landingfolio.com';
const pageToLoad = process.argv[2];

function downloadImage(imglink, filename) {
  const downloadsFolder = path.join(__dirname, 'downloads', pageToLoad.toString());
  mkdirp(downloadsFolder, (err) => {
    if (err) logger.bad(err);
    else logger.good(`folder created: ${pageToLoad}`);
  });

  download.image({ url: imglink, dest: path.join(downloadsFolder, filename) })
    .then(({ newfilename }) => {
      logger.good('completed ', path.basename(newfilename));
    }).catch((err) => {
      logger.bad(err);
      throw err;
    });
}

function scrapePostPage(link) {
  scrapeIt(link, {
    imageLink: {
      selector: '.featured-image .box img',
      attr: 'src',
    },
  }).then((res) => {
    // const linkname = link.split('/');
    // const filename = `${linkname[linkname.length - 2]}.jpg`;
    // downloadImage(res.imageLink, filename);
    logger.good(res.imageLink);
    logger.say(link);
  });
}

// Promise interface
function scrapeListPage(pageNumber) {
// first page loads when page num excluded
  if (pageNumber > 1) {
    url = `${url}/page/${pageNumber}`;
  }

  scrapeIt(url, {
  // fetch the screenshot pages
    pagelinks: {
      listItem: 'div.col-md-4 .box',
      data: {
        link: {
          selector: 'a',
          attr: 'href',
        },
      },
    },
  }).then((page) => {
    const found = page.pagelinks;

    logger.say(`loading the page list: ${pageNumber}`);

    found.map((linkElement) => {
      scrapePostPage(linkElement.link);
      return linkElement.link;
    });
  });
}

// let img_test = "https://www.lapa.ninja/assets/images/Frederique-Matti.jpg"
// downloadImage(2, img_test);
// let linkpage = "http://www.landingfolio.com/gallery/headline/"
// scrapePostPage(linkpage);

if (pageToLoad) {
  scrapeListPage(pageToLoad);
} else {
  logger.bad('-------------------------------------------------');
  logger.bad('please provide a page number from landing folio');
}
