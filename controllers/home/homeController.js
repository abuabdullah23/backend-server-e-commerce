const categoryModel = require("../../models/dashboard/categoryModel");
const { responseReturn } = require("../../utils/response");

class homeController {
    get_categories = async (req, res) => {

        try {
            const categories = await categoryModel.find({});
            console.log(categories);
            responseReturn(res, 200, { categories })
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new homeController();