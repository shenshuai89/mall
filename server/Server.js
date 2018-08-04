var http = require('http')
var url = require('url')
var util = require('util')
var fs = require('fs')

let server = http.createServer((req,res) => {
    var pathname = url.parse(req.url).pathname;
    fs.readFile(pathname.substring(1), function(err, data){
        if(err){
            res.writeHead(404, {
                'Content-Type':'text/html'
            })
        }else{
            res.writeHead(200, {
                'Content-Type':'text/html'
            })
            res.write(data.toString());
        }
        res.end();
    })
})

server.listen(3000,'127.0.0.1',()=>{
    console.log("服务器已经运行，请打开http://127.0.0.1:3000 运行");
})