const formidable = require("formidable");
const productModel = require("../../models/dashboard/productModel");
const { responseReturn } = require("../../utils/response");
const cloudinary = require('cloudinary').v2

class productController {
    add_product = async (req, res) => {
        const { id } = req;
        const form = new formidable.IncomingForm({ multiples: true })

        form.parse(req, async (err, field, files) => {
            let { name, category, description, price, stock, discount, brand, shopName } = field;
            let { images } = files;
            // console.log(images);

            name = name.toString();
            const slug = name.trim().split(' ').join('-');
            // console.log(field);
            // console.log(files.images[0]); 

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })

            try {
                let allImageUrl = [];
                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(files.images[i].filepath, { folder: 'products' })
                    allImageUrl = [...allImageUrl, result.url]
                }

                const product = await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    shopName: shopName[0],
                    category: category[0],
                    description: description[0],
                    brand: brand[0],
                    stock: parseInt(stock[0]),
                    price: parseInt(price[0]),
                    discount: parseInt(discount[0]),
                    images: allImageUrl,
                })
                responseReturn(res, 201, { category, message: 'Product added successful' })
            } catch (error) {
                responseReturn(res, 500, { error: error.message })
            }
        })
    }
}
module.exports = new productController();