const express = require("express");
const server= express();

//server.use(express.static("index.html"));
server.get("/redirect",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})
server.use(express.static(__dirname + '/public'));
// server.get("/",(req,res)=>{

//     res.sendFile(__dirname+"/index.html",(err)=>{
//         console.log(err);
//     })
// })

server.listen(3000,()=>{
    console.log('http://localhost:3000')
});
