import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import { createReadStream, statSync } from 'fs';
import ffmpeg from 'fluent-ffmpeg';
const app = express();

const _fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(_fileName)
app.use(cors());

// Setup multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Ensure you have this folder created
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname)
        cb(null, uniqueSuffix + file.fieldname);
    }
});
// Setup Couldinary 

cloudinary.config({
    cloud_name: 'dlx4nknv9',
    api_key: '163676898971472',
    api_secret: 'vuVC6TJF50rm8KyrInkGyrcOxaU'
});



const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("Hi there and this is a test");
});

app.post("/upload", upload.single("fileName"), async (req, res) => {

    try {

        if (req.file) {
            const uploadResult = await cloudinary.uploader
                .upload(
                    req.file.path, {
                    public_id: req.file.filename,
                }
                )
                .catch((error) => {
                    console.log(error);
                });
            const result = await cloudinary.api.resource(req.file.filename);
            res.json({
                message: 'File uploaded successfully',
                file: req.file,
                pdfUrl: result.secure_url, // use secure_url from Cloudinary
              });
c              
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

app.post("/upload-video", upload.single('fileName'), (req,res,next)=>{
    const inputPath = req.file.path;
    const outputPath = `uploads/${req.filename}.mp4`

    ffmpeg(inputPath)
    .output(outputPath)
    .videoCodec('libx264')
    .audioCodec('aac')
    .on("end", ()=>{
        console.log("Transcoding is Fineshed")
        res.download(outputPath, (err)=>{
            if(err)
                console.log("Error While sending file", err)
        })
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
    })
    .on('error', (err)=>{
        console.error('Error during transcoding:', err);
        res.status(500).send('Error during transcoding');
    })
    .run();
})


app.get("/video/:name", (req, res) => {
    const name = req.params.name;
    const videoPath = path.join(__dirname, 'videos', `${name}.mp4`);
    const videoStats = statSync(videoPath);
    const videoSize = videoStats.size;
    const range = req.headers.range;
    console.log(range)
    if (range) {
        const parts = range.replace("bytes=", "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
        const chunkSize = 10**60;

        const videoStream = createReadStream(videoPath, { start, end });
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);
        videoStream.pipe(res);
    } 
});




app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
