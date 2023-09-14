const adminModel = require("../models/adminModel");
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
            console.log(admin);
        } catch (error) {
            responseReturn(res, 500, { error: error.message });

        }
    }
}
module.exports = new authControllers();