const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const dbConf = require('./config/db.config');
const mongose = require('mongoose');

mongose.connect(dbConf.url,{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>{
    console.log("Veritabanı bağlandı");
}).catch((err)=>{
    console.log("Veritabanı hatası: ",err);    
    process.exit();
});

app.get('/',(req,res)=>{
    res.json({"message":"Hoş geldin!"});
});

require('./app/routes/note.routes')(app);

app.listen(3000,()=>{
    console.log("Server start");
});