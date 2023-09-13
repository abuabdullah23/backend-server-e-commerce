class authControllers {
    admin_login = async (req, res) => {
        console.log('admin login info: ', req.body);
    }
}
module.exports = new authControllers();