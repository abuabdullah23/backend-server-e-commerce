const formidable = require('formidable');
const { responseReturn } = require("../../utils/response");
const categoryModel = require("../../models/dashboard/categoryModel");
const cloudinary = require('cloudinary').v2

class categoryController {
    add_category = async (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            // files.image[0].filepath;
            // console.log('file name:', files);
            if (err) {
                responseReturn(res, 404, { error: 'Something wrong' })
            } else {
                let { name } = fields
                let { image } = files
                name = name.toString()
                const slug = name.trim().split(' ').join('-');
                console.log(files);
                // console.log('image:', image.filepath);

                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                })

                try {
                    const result = await cloudinary.uploader.upload(files.image[0].filepath, { folder: 'categories' })
                    console.log(result.url);
                    if (result) {
                        const category = await categoryModel.create({
                            name,
                            image: result.url,
                            slug
                        })
                        responseReturn(res, 201, { category, message: 'Category added successful' })
                    } else {
                        responseReturn(res, 404, { error: 'Image upload failed!' })
                    }
                } catch (error) {
                    console.log('Error:', error);
                    responseReturn(res, 500, { error: 'Internal server error!' })
                }
            }
        })
    }

    get_category = async (req, res) => {
        const { page, searchValue, perPage } = req.query;
        const skipPage = parseInt(perPage) * (parseInt(page) - 1);
        // console.log(req.query.perPage);
        try {
            if (searchValue && page && perPage) {
                const categories = await categoryModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(perPage).sort({ createAt: 1 });
                const totalCategory = await categoryModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { totalCategory, categories })
            } else if (searchValue === '' && page && perPage) {
                const categories = await categoryModel.find({}).skip(skipPage).limit(perPage).sort({ createdAt: -1 });
                const totalCategory = await categoryModel.find({}).countDocuments();
                responseReturn(res, 200, { totalCategory, categories });
            } else {
                const categories = await categoryModel.find({}).sort({ createdAt: -1 });
                const totalCategory = await categoryModel.find({}).countDocuments();
                responseReturn(res, 200, { totalCategory, categories });
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new categoryController();