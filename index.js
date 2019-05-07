const scrapeIt = require('scrape-it');
const download = require('image-downloader');
const mkdirp = require('mkdirp');
const path = require('path');
const chalk = require('chalk');

let url = 'http://www.landingfolio.com';
const pageToLoad = process.argv[2];

// function logger(text) {
//   console.log(text); // eslint-disable-line no-console
// }

const logger = {
  good: function green(txt) {
    console.log(chalk.green(txt)); // eslint-disable-line no-console
  },
  bad: function red(txt) {
    console.log(chalk.red(txt)); // eslint-disable-line no-console
  },
  say: function yellow(txt) {
    console.log(chalk.yellow(txt)); // eslint-disable-line no-console
  },
};
function downloadImage(imglink, filename) {
  const folder = path.join(__dirname, 'downloads', pageToLoad.toString());

  mkdirp(folder, (err) => {
    if (err) logger.bad(err);
    else logger.good(`folder created: ${pageToLoad}`);
  });

  download.image({ url: imglink, dest: path.join(folder, filename) })
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
