var express = require('express');
var router = express.Router();
const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        const filefull = `${originalName}-${uniqueSuffix}${extension}`;
        cb(null, filefull);
    }
  });

const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only (jpg, png) are permitted.'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // (2MB)
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    if (!req.body.name) {
        return res.status(400).send('Name is required');
    }
    
    const host = process.env.HOST_URL || req.get('host');
    const fileUrl = `https://${host}/uploads/${req.file.filename}`;

    res.send(`Zure izena: ${req.body.name}. Fitxategia: <a href="${fileUrl}" target="_blank">${fileUrl}</a>`);
})

module.exports = router;
