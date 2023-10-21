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

    get_products = async (req, res) => {
        const { page, searchValue, perPage } = req.query;
        const skipPage = parseInt(perPage) * (parseInt(page) - 1);
        const { id } = req;

        try {
            if (searchValue && page && perPage) {
                const products = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).skip(skipPage).limit(perPage).sort({ createAt: 1 });
                const totalProducts = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).countDocuments()
                responseReturn(res, 200, { totalProducts, products })
            } else {
                const products = await productModel.find({ sellerId: id }).skip(skipPage).limit(perPage).sort({ createdAt: -1 });
                const totalProducts = await productModel.find({ sellerId: id }).countDocuments();
                responseReturn(res, 200, { totalProducts, products });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // get one product
    get_product = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product });
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // for update single product by Id
    update_product = async (req, res) => {
        let { productId, name, brand, category, stock, price, discount, description } = req.body;
        name = name.trim();
        const slug = name.split(' ').join('-');
        try {
            await productModel.findByIdAndUpdate(productId, {
                name, brand, category, stock, price, discount, description, slug
            })
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product, message: 'Product update successful.' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // for update single products image by Id
    update_product_image = async (req, res) => {
        const form = new formidable.IncomingForm({ multiples: true })

        form.parse(req, async (err, field, files) => {
            const { productId, oldImage } = field;
            const { newImage } = files;
            // console.log(productId[0]);
            // console.log(oldImage[0]);
            // console.log(newImage[0].filepath);

            if (err) {
                responseReturn(res, 404, { error: err.message })
            } else {
                try {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    })

                    const result = await cloudinary.uploader.upload(newImage[0].filepath, { folder: 'products' })

                    if (result) {
                        let { images } = await productModel.findById(productId[0]);
                        const index = images.findIndex((img) => img === oldImage[0]);
                        images[index] = result.url;

                        await productModel.findByIdAndUpdate(productId[0], {
                            images
                        })

                        const product = await productModel.findById(productId[0]);
                        responseReturn(res, 200, { product, message: 'Product update successful.' })
                    } else {
                        responseReturn(res, 404, { error: 'image upload failed!' })
                    }
                } catch (error) {
                    responseReturn(res, 500, { error: error.message })
                }
            }
        })
    }

}
module.exports = new productController();