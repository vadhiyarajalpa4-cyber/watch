// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); 
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const nameOnly = path.basename(file.originalname, ext).split('-').pop();
//         cb(null, `${Date.now()}-${nameOnly}${ext}`);
//     }
// });

// const upload = multer({ 
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         // Optional: Check if file is an image
//         const filetypes = /jpeg|jpg|png|webp/;
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         if (extname) return cb(null, true);
//         cb(new Error("Error: Images Only!"));
//     }
// });

// module.exports = upload;


const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        // Clean up filename to prevent issues
        const nameOnly = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${nameOnly}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error("Error: Only images allowed (jpeg, jpg, png, webp)!"));
    }
});

// 🎯 UPDATED: Use .any() to capture dynamic variant keys like variants[0][image]
const uploadWatchImages = upload.any(); 

module.exports = { upload, uploadWatchImages };