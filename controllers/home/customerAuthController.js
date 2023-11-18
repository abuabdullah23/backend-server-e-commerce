const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const customerModel = require("../../models/home/customerModel");
const { responseReturn } = require("../../utils/response");
const bcrypt = require('bcrypt');
const { createToken } = require("../../utils/tokenCreate");

class customerAuthController {
    // Customer Register Method
    customerRegister = async (req, res) => {
        const { name, email, password } = req.body;

        try {
            const customer = await customerModel.findOne({ email });
            if (customer) {
                responseReturn(res, 404, { error: 'Email already exist' })
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password, 10),
                    method: 'manually'
                })
                await sellerCustomerModel.create({
                    myId: createCustomer.id
                })
                const token = await createToken({
                    id: createCustomer.id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    method: createCustomer.method
                })
                res.cookie('customerToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                responseReturn(res, 201, { message: 'Registration Successful', token })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }


    // Customer Login
    customerLogin = async (req, res) => {
        const { email, password } = req.body;
        // console.log(password);
        try {
            const customer = await customerModel.findOne({ email }).select('+password');
            if (customer) {
                const match = await bcrypt.compare(password, customer.password);
                if (match) {
                    const token = await createToken({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        method: customer.method
                    })
                    res.cookie('customerToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 201, { message: 'Login Successful', token })
                } else {
                    responseReturn(res, 404, { error: 'Password Wrong.' })
                }
            } else {
                responseReturn(res, 404, { error: "Email not found." })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

}

module.exports = new customerAuthController();