let webInfos = [];
let fs = require('fs');
let allWebInfos = fs.readFileSync("database_raw.json");
webInfos = JSON.parse(allWebInfos);

function getLists(str, pat) {
    let a= [];
    while (i = pat.exec(str))
        a[i[2]]=1;
    return a;
}

for(let i of webInfos){
    if (!i.processed){
        let str  =fs.readFileSync('webpages/'+i.filename+'.txt','utf-8');
        let kwords = fs.readFileSync('keywords/'+i.filename+'.txt','utf-8');

        let dateList = getLists(str, /(\<DATE\>)(.*?)(\<\/DATE\>)/g);
        let locationList = getLists(str, /(\<LOCATION\>)(.*?)(\<\/LOCATION\>)/g);
        let personList = getLists(str, /(\<PERSON\>)(.*?)(\<\/PERSON\>)/g);
        let orgList = getLists(str, /(\<ORGANIZATION\>)(.*?)(\<\/ORGANIZATION\>)/g);

        let temp =[];
        for(let j in dateList)
        {
            try{
                let t = Date.parse(j);
                if(t&&t>0) temp.push(t);
            }
            catch(e)
            {}
        }
        i.dateWords = temp;

        i.locationWords = [];
        for (let l in locationList)
            if (i.locationWords.length < 3)
                i.locationWords.push(l);

        i.personWords = [];
        for (let p in personList)
            if (i.personWords.length < 3)
                i.personWords.push(p);

        i.orgWords = [];
        for (let o in orgList)
            if (i.orgWords.length < 3)
                i.orgWords.push(o);


        i.keyWords = kwords.split('\n').slice(0,5);
        i.processed = 1;
    }
}
fs.writeFileSync("database.json",JSON.stringify(webInfos));