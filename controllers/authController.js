const signup_get = (req, res) => res.render('signup');

const login_get = (req, res) => res.render('login');

const signup_post = (req, res) => {
    const { email, password } = req.body;
    res.send('new signup');
};

const login_post = (req, res) => {
    const { email, password } = req.body;
    res.send('logged in');
};

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post
}
