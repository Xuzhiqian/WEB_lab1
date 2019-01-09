let TfIdf = require('node-tfidf');
let tfidf = new TfIdf();

function addDocuments(document) {
     tfidf.addDocument(document.toLowerCase());
}

 function rank(searchWords) {
    let result = [];
    for (let i = 0; i < tfidf.documents.length; i++)
    {
       // result[i] = [i,tfidf.tfidf(searchWords,i)];
        tfidf.tfidfs(searchWords.toLowerCase(), function(i, measure)
        {
            result[i] = [i,measure];
        });
    }
    if(result.length>1)
    result.sort(function (a,b) {
        return b[1]-a[1];
    });

    return result.reduce(function (total, item) {
        if(item[1]>0) total.push(item);
        return total;
    },[]);
}



exports.rank = rank;
exports.addDocuments =addDocuments;
