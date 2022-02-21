const multer = require("multer");
 
 
const fileStorage = multer.diskStorage({


    destination: (req, file, cb) => {
      cb(null, "images");
    },
    
    filename: (req, file, cb) => {
      let ext = file.originalname.substring(
        file.originalname.lastIndexOf("."),
        file.originalname.length
      );
  
      cb(null, new Date().getTime() + Math.random() + ext);
    },
  
  });
  
  const fileFilter = (req, file, cb) => {
    if ( 
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      
      const err=new Error("File must be png-jpg-jpeg.")
      err.statusCode = 400;
       cb (err,false);
    
    }
  };
 exports.upload=  multer({limits: { fileSize: 2000*1000 }, storage: fileStorage, fileFilter: fileFilter });
 