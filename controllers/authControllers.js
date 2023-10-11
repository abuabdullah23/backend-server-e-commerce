const adminModel = require("../models/adminModel");
const sellerCustomerModel = require("../models/chat/sellerCustomerModel");
const sellerModel = require("../models/sellerModel");
const { responseReturn } = require("../utils/response");
const { createToken } = require("../utils/tokenCreate");
const bcrypt = require('bcrypt');

class authControllers {
    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await adminModel.findOne({ email }).select('+password')
            // check admin is available or not
            if (admin) {
                // check password
                const match = await bcrypt.compare(password, admin.password);
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    })
                    // token save in cookie
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    })
                    // for response message
                    responseReturn(res, 200, { token, message: 'Login Successful' })
                } else {
                    responseReturn(res, 404, { error: 'Wrong Password!' });
                }
            } else {
                responseReturn(res, 404, { error: 'Email not found' });
            }
            // console.log(admin);
        } catch (error) {
            responseReturn(res, 500, { error: error.message });

        }
    }

    seller_register = async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const getUser = await sellerModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email already exist!' })
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manually',
                    shopInfo: {}
                })
                await sellerCustomerModel.create({
                    myId: seller.id
                })
                const token = await createToken({ id: seller.id, role: seller.role })
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                })
                responseReturn(res, 201, { token, message: 'register success' })
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error!' })
        }
    }

    seller_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const seller = await sellerModel.findOne({ email }).select('+password')
            // check seller is available or not
            if (seller) {
                // check password
                const match = await bcrypt.compare(password, seller.password);
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    })
                    // token save in cookie
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    })
                    // for response message
                    responseReturn(res, 200, { token, message: 'Login Successful' })
                } else {
                    responseReturn(res, 404, { error: 'Wrong Password!' });
                }
            } else {
                responseReturn(res, 404, { error: 'Email not found' });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    // get user 
    getUser = async (req, res) => {
        const { role, id } = req;
        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id);
                responseReturn(res, 200, { userInfo: user });
            } else {
                const seller = await sellerModel.findById(id);
                responseReturn(res, 200, { userInfo: seller });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error!' });
        }
    }
}
module.exports = new authControllers();