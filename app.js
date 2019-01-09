let express = require('express');
let app = express();

let fs = require('fs');
let database_file = fs.readFileSync("database.json");
let webInfos = JSON.parse(database_file);

let rank = require('./rank.js');

for(let i of webInfos)
    rank.addDocuments(i.subject+i.keyWords.join(' '));


app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/search', function (req, res) {

  let r = {
    word:req.query.w,
    location:req.query.l,
    person:req.query.p,
    date:req.query.d,
    order:req.query.o
  };
    let result = [];
    if (r.word.length>0)
       result = rank.rank(r.word).map(r => webInfos[r[0]]);
     else
        result = webInfos.slice();

    if (r.location.length>0)
      result = result.reduce(function(total, item) {
          for (let l of item.locationWords)
            if (l.toLowerCase().indexOf(r.location.toLowerCase())>=0) {
              total.push(item);
              break;
            }
          return total;
      }, []);

    if (r.person.length>0)
      result = result.reduce(function(total, item) {
          for (let p of item.personWords)
            if (p.toLowerCase().indexOf(r.person.toLowerCase())>=0) {
              total.push(item);
              break;
            }
          return total;
      }, []);

    if (r.date.length>0) {
      let date = Date.parse(r.date);
      if (date !== NaN) {
        if (r.order === 'exact')
          result = result.filter(item => Date.parse(item.deadLine) === date);
        else if (r.order === 'upcoming')
          result = result.filter(item => Date.parse(item.deadLine) > date);
        else if (r.order === 'previous')
          result = result.filter(item => Date.parse(item.deadLine) < date);
      }
    }
    result = result.slice(0,100);

    res.end(JSON.stringify(result));

});

function cmpdatePre(a,b)
{
    let datea,dateb;
    try{
         datea = Date.parse(a.sent);
         dateb = Date.parse(b.sent);
    }
    catch(e)
    {
        datea= 0;dateb = 0;
    }
    return datea-dateb;
}



let server = app.listen(8081, function () {
    let host = '127.0.0.1'
    let port = '8081'
    console.log("Listening on %s:%s", host, port)
});