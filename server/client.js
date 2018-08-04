var http = require('http')

http.get('http://www.imooc.com/index/getstarlist', function (res) { 
    let data = ''
    res.on('data', function(chunk){
        data += chunk;
    })
    res.on('end', function(){
        let result = JSON.parse(data);
        console.log("result:",result.msg);
    })
 })