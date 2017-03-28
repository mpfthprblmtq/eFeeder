var FeedParser = require('feedparser');
var request = require('request');
var app = require('electron').remote;
var fs = require('fs');
//var rssLink = 'https://www.reddit.com/r/GameDeals/.rss';
//var MAX = 5;
//writeRSSConfig('http://ohumanstar.com/feed/', 3);

function submitstuff() {

  var link = document.getElementById("link").value;
  var number = document.getElementById("number").value;

  fs.readFile('src/rss_config.txt', 'utf-8', function(err,data) {
    if(data.includes(link)) {
      alert("Duplicate entry.");
    }
    else {
      writeRSSConfig(link, number);
      window.location.href="index.html";
    }

  });
}

//readRSSConfig();

//loadRSS(rssLink, MAX);

function readRSSConfig() {
  fs.readFile('src/rss_config.txt', 'utf-8', function(err,data) {
    if(err) {
      fs.writeFile('src/rss_config.txt', '',function(err){
        if(err) {
          console.log("Error creating rss_config.txt");
          return;
        }
        console.log("rss_config.txt created");
      });
      return;
    }
    var splitData = data.split("\n");
    //console.log(splitData);
    for(var i = 0; i < (splitData.length / 2); i++) {
      //console.log(splitData);
      var numItems = parseInt(splitData[i * 2]);
      var link = splitData[(i * 2) + 1];

      //console.log(numItems);
      //console.log(link);
      loadRSS(link, numItems);
    }
  });
}

function writeRSSConfig(link, maxItems) {
  fs.readFile('src/rss_config.txt', 'utf-8', function(err,data) {
    if(err) {
      fs.writeFile('src/rss_config.txt', maxItems.toString() + '\n' + link,function(err){
        if(err) {
          console.log("Error creating rss_config.txt");
          return;
        }
        console.log("rss_config.txt created");
      });
      return;
    }
    //console.log(splitData);
    if(loadRSS(link,maxItems)) {
      fs.writeFile('src/rss_config.txt', data + '\n' + maxItems.toString() + '\n' + link, function(err) {
        if(err) {
          console.log("Error writing to rss_config.txt");
          return;
        }
        console.log("rss_config.txt updated");
      });
    }

  });
}

function loadRSS(link, maxItems) {
  var links = [];
  var titles = [];
  var descriptions = [];
  var guids = [];
  var metaTitle;
  var feedparser = new FeedParser();
  var req;
  req = request(link);

  req.on('error', function(error) {
      return false;
  });

  req.on('response', function(res) {
    var stream = this;

    if(res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
      return false;
    }
    else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on('error', function(error) {
      return false;
  });

  feedparser.on('readable', function() {
    var stream = this;
    metaTitle = this.meta.title;
    var item;

    while(item = stream.read()) {
      links.push(item.link);
      titles.push(item.title);
      descriptions.push(item.description);
      guids.push(item.guid);
    }

    //console.log(links);
    //console.log(titles);
    //console.log(descriptions);

    /*while(item = stream.read() && count < numberOfFeedUpdates) {
      rss.innerHTML = rss.innerHTML + item.link;
      count++;
    }*/


  });
  setTimeout(function myFunction() {
    //console.log(links.length);
    var r = document.getElementById("rss");
    var b = r.innerHTML;
    //var totalRSS;
    var noSpaceMetaTitle = metaTitle.toString().replace(/[ \.,<>;]/g, '');
    /*totalRSS += '<hr class="split"/><div role="button" class="rss-metatitle" data-toggle="collapse" data-target=".rss-title-' + noSpaceMetaTitle + '">' + metaTitle + '</div>';*/
    r.innerHTML = b +
      '<hr class="split"/><div role="button" class="collapsed rss-metatitle" data-toggle="collapse" data-target=".rss-title-' + noSpaceMetaTitle + '">' + metaTitle + '</div>';
    for(var i = 0; i < titles.length && i < maxItems; i++) {
      var rss = document.getElementById("rss");
      var c = rss.innerHTML;
      var noSpaceTitle = titles[i].toString().replace(/[ \.,<>;]/g, '');
      rss.innerHTML = c +
        '<div role="button" data-toggle="collapse" data-target="#rss-description-'+ noSpaceMetaTitle + i.toString() + '" class="rss-title rss-title-' + noSpaceMetaTitle + '" collapsed>' + titles[i] + '</div>'
        + '<div id="rss-description-'+ noSpaceMetaTitle + i.toString() + '" class="collapse rss-description">' + descriptions[i] + '</div>';

      //console.log(links[i]);
      /*totalRSS += '<div role="button" data-toggle="collapse" data-target="#rss-description-'+ noSpaceMetaTitle + i.toString() + '" class="rss-title-' + noSpaceMetaTitle + '" collapsed>' + titles[i] + '</div>'
        + '<div id="rss-description-'+ noSpaceMetaTitle + i.toString() + '" class="collapse rss-description">' + descriptions[i] + '</div>';*/
    }
    //r.innerHTML = b + totalRSS;
  }, 2000);
  return true;
}

//getMetaTitle('http://ohumanstar.com/feed/');

function getMetaTitle(link) {
  var metaTitle;
  var feedparser = new FeedParser();
  var req;
  req = request(link);

  req.on('response', function(res) {
    var stream = this;

    if(res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on('meta', function (meta) {
    //console.log(meta.title);
    return meta.title;
  });
}

function listFeedsByMetaName() {
  fs.readFile('src/rss_config.txt', 'utf-8', function(err,data) {
    if(err) {
      fs.writeFile('src/rss_config.txt', '',function(err){
        if(err) {
          console.log("Error creating rss_config.txt");
          return;
        }
        console.log("rss_config.txt created");
      });
      return;
    }
    var splitData = data.split("\n");
    //console.log(splitData);
    for(var i = 0; i < (splitData.length / 2); i++) {
      var link = splitData[(i * 2) + 1];
      var mTitle = getMetaTitle(link);
      //console.log(getMetaTitle(link));
      //rss-list
      var rssList = document.getElementById("rss-list");
      var temp = rssList.innerHTML;

      rssList.innerHTML = temp + '<div role="button" id="' + link + '">' + mTitle + '</div>';
    }
  });
}

function removeFeed(link) {
  fs.readFile('src/rss_config.txt', 'utf-8', function(err,data) {
    if(err) {
      console.log("Error: rss_config.txt missing...");
      return;
    }
    var newText;
    var splitData = data.split("\n");
    for(var i = 0; i < (splitData.length / 2); i++) {
      if(splitData[(i * 2) + 1] == link) {
        splitData.splice(i,1);
        splitData.splice(i,1);
      }
      else {
        newText += splitData[i * 2] + '\n' + splitData[(i * 2) + 1];
      }
    }
    fs.writeFile('src/rss_config.txt', newText,function(err){
      if(err) {
        console.log("Error rewriting rss_config.txt");
        return;
      }
      console.log("rss_config.txt rewritten");
    });
  });
}
