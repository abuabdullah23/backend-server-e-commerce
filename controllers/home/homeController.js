const categoryModel = require("../../models/dashboard/categoryModel");
const productModel = require("../../models/dashboard/productModel");
const { responseReturn } = require("../../utils/response");

class homeController {

    // format products
    formateProduct = (products) => {
        const productsArray = [];
        let i = 0;
        while (i < products.length) {
            let temp = []
            let j = i
            while (j < i + 3) {
                if (products[j]) {
                    temp.push(products[j])
                }
                j++
            }
            productsArray.push([...temp])
            i = j
        }
        return productsArray
    }


    get_categories = async (req, res) => {

        try {
            const categories = await categoryModel.find({});
            responseReturn(res, 200, { categories })
        } catch (error) {
            console.log(error.message);
        }
    }

    // get products
    get_products = async (req, res) => {
        try {
            const products = await productModel.find({}).limit(16).sort({ createdAt: -1 })
            const allProducts1 = await productModel.find({}).limit(9).sort({ createdAt: -1 })
            const latestProducts = this.formateProduct(allProducts1)

            const allProducts2 = await productModel.find({}).limit(9).sort({ rating: -1 })
            const topRatedProducts = this.formateProduct(allProducts2)

            const allProducts3 = await productModel.find({}).limit(9).sort({ discount: -1 })
            const discountProducts = this.formateProduct(allProducts3)

            responseReturn(res, 200, { products, latestProducts, topRatedProducts, discountProducts })

        } catch (error) {
            console.log(error.message);
        }
    }

    get_price_range_products = async (req, res) => {
        try {
            const priceRange = {
                low: 0,
                high: 0
            }
            const products = await productModel.find({}).limit(9).sort({ createdAt: -1 })
            const latestProducts = this.formateProduct(products);
            const getPriceRange = await productModel.find({}).sort({ 'price': 1 })
            if (getPriceRange.length > 0) {
                priceRange.high = getPriceRange[getPriceRange.length - 1].price;
                priceRange.low = getPriceRange[0].price;
            }
            responseReturn(res, 200, { priceRange, latestProducts })
        } catch (error) {
            console.log(error.message);

        }
    }
}

module.exports = new homeController();