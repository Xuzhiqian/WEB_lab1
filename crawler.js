let https = require('https');
let cheerio = require('cheerio');
let webInfos = [];
let pageUrl = 'https://research.cs.wisc.edu/dbworld/browse.html';
let md5 = require('js-md5');
let fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
async function main() {
for(let i of webInfos)
{
let check = fs.existsSync('webpages_raw/'+i.filename+'.txt');
    if(!check)
    {
        
        if(i.subjectaddr){
            let fixedURL = i.subjectaddr.replace('www','research').replace('http','https');
            console.log(fixedURL);
        https.get(fixedURL,(res)=> {
            const {statusCode} = res;

            let error;
            if (statusCode !== 200) {
                error = new Error('请求失败。\n' +
                    `状态码: ${statusCode}`);
            }
            if (error) {
                console.error(error.message);
                // 消耗响应数据以释放内存
                res.resume();
                return;
            }

            //以上代码来自node.js http模块文档中,用于出错时消耗掉数据

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                const $ = cheerio.load(rawData);
                let data = $;
                if(data)
                {
                    fs.writeFileSync('webpages_raw/'+i.filename+'.txt',data.text());
                }
            });

        });
        }
        else {console.log('error in url');}
        await sleep(1000);

    }
}
}

https.get(pageUrl,(res)=>{
        const { statusCode } = res;

        let error;
        if (statusCode !== 200) {
            error = new Error('请求失败。\n' +
                `状态码: ${statusCode}`);
        }
        if (error) {
            console.error(error.message);
            // 消耗响应数据以释放内存
            res.resume();
            return;
        }

        //以上代码来自node.js http模块文档中,用于出错时消耗掉数据

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end',() => {
           // console.log(rawData);
            const $ = cheerio.load(rawData);
            let tempurls=$("tbody").slice(1);
            tempurls.each(function () {
                let sent = $(this).find("td").first();
                let mesType = sent.next();
                let from = mesType.next();
                let subject = from.next();
                let deadLine = subject.next();
                let webPage  = deadLine.next().children();
                webInfos.push({
                    sent:sent.text(),
                    mesType:mesType.text(),
                    from:from.text(),
                    subject:subject.text(),
                    subjectaddr:subject.children().first().attr("href"),
                    filename:md5(subject.children().first().attr("href")),
                    deadLine:deadLine.text(),
                    webPage:webPage.length === 0?undefined:webPage.first().attr("href")
                });
            });
            fs.writeFileSync( "database_raw.json",JSON.stringify(webInfos));
            main();
        });
});









