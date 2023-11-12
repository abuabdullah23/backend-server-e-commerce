const sellerModel = require("../../models/sellerModel");
const { responseReturn } = require("../../utils/response");


class sellerController {
    get_seller_request = async (req, res) => {
        const { page, searchValue, perPage } = req.query;
        const skipPage = parseInt(perPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {

            } else {
                const sellers = await sellerModel.find({ status: 'pending' }).skip(skipPage).limit(perPage).sort({ createdAt: -1 })
                const totalSeller = await sellerModel.find({ status: 'pending' }).countDocuments();
                responseReturn(res, 200, { sellers, totalSeller });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    // get seller details by id
    get_seller = async (req, res) => {
        const { sellerId } = req.params;

        try {
            const seller = await sellerModel.findById(sellerId);
            responseReturn(res, 200, { seller });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    // update seller status
    update_seller_status = async (req, res) => {
        const { sellerId, status } = req.body;

        try {
            await (sellerModel.findByIdAndUpdate(sellerId, {
                status
            }))
            const seller = await sellerModel.findById(sellerId);
            responseReturn(res, 200, { seller, message: 'Update seller status success' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }



}

module.exports = new sellerController();