const express = require('express');
const mongoose  = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const {createReadStream} = require('fs');
const path = require('path');
const app = express();



app.use(express.json());
app.use(cors());

// Connect to mongodb
mongoose.connect('mongodb://127.0.0.1/fileApp',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const fileSchema = new mongoose.Schema({
    filename:String,
})

const File = mongoose.model('File', fileSchema);

//Multer storage configuration

const storage = multer.diskStorage({
    destination:(req, file ,cb) => {
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+"-"+file.originalname);
    },
});
const upload = multer({storage});


// File upload endpoint
app.post("/api/upload", upload.single('file'),async(req,res)=>{

    try {
        const {filename} = req.file;
        console.log(filename)
        const file = new File({filename});
        await file.save();
        res.status(200).json({message:'File upload succesfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Error uploading file"})
    }
})

// file upload multiple 
app.post("/api/uploadMultiple",upload.array('files'), async(req, res)=>{
    try{
        const filenames = req.files.map(file=>file.filename);
        console.log(req.files, "this is req.file");
        const filePromise = filenames.map((filename) =>  new File({filename}).save())
        await Promise.all(filePromise);

        res.status(200).json({message:"Files upload succesfully multiple",filePromise:filenames})
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Error uploading file"})
    }
})


// File list endpoint

app.get("/api/files", async(req,res)=>{
    try{
        const file = await File.find();
        res.status(200).json(file);

    }catch(error){
        res.status(500).json(error);
    }
})

app.get("/api", (req,res)=>{
    res.send("hellow");
})



app.listen(5000, ()=>{
    console.log("listen on port " , 5000);
})

