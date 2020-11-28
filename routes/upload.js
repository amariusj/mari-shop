const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

//I think the configuration is off because the environments need to be changed into strings

//Confugure cloudinary

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
})

//Uploads image
router.post('/upload', auth, authAdmin, (req, res) => {
    try {

        //Verify a file is uploaded
        if (!req.files || Object.keys(req.files).length === 0) 
            return res.status(400).json({msg: 'No files were uploaded'})

        const file = req.files.file

        //Verify image is not larger than 5MB
        if (file.size > 1024*1024*5) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: 'Size is too large'})
        }

        //Verify it's an image
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Unsupported file type"})
        }

        //Uploads the file to cloudinary
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: 'estore'}, async (err, result) => {
            if (err) return res.status(400).json({msg: err.message});

            removeTmp(file.tempFilePath)
            
            return res.json({public_id: result.public_id, url: result.secure_url})
        })

    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

router.post('/destroy', auth, authAdmin, async (req, res) => {
    try {

        //Grabs the public id from the request
        const { public_id } = req.body

        //If no image is selected, send an error
        if (!public_id) return res.status(400).json({msg: "No images selected"})

        //Destroy the image in cloudinary
        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) return res.status(400).json({msg: err.message})

            return res.json({msg: "Image deleted"})
        })

    } catch (err) {

        return res.status(500).json({msg: err.message})

    }
})

const removeTmp = path => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = router