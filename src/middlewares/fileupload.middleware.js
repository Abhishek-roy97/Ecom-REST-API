import multer from "multer";

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, './uploads');
        // console.log("Destination")
    },
    filename: function (req, file, cb) {
        // console.log(file)
        cb(null, file.filename + '-' + Date.now())
      },
});
 export const upload = multer({storage: storage,});

 