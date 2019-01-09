var vfile = require('to-vfile')
var retext = require('retext')
var keywords = require('retext-keywords')
var toString = require('nlcst-to-string')
var fs = require('fs')
var path = require('path')

fs.readdir('webpages_raw', function(err, files) {
  if (err) throw err
  files.forEach((file) => {
    if (file.indexOf('DS_')>=0) return;
    retext()
      .use(keywords)
      .process(vfile.readSync('webpages_raw/'+file), done)
  });
});


function done(err, file) {
  if (err) throw err
  let filename = 'keywords/'+path.basename(file.history[0])
  let keywords = ''
  file.data.keywords.forEach(function(keyword) {
    keywords = keywords + toString(keyword.matches[0].node)+'\n'
  })
  keywords = keywords.slice(0,-1)
  fs.writeFileSync(filename,keywords)
}