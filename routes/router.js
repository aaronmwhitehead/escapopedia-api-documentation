const nodemailer = require('nodemailer');

exports.home = function(req, res, next) {
    res.render('index', { styles: 'index.css' });
};

exports.api = (req, res, next) => {
    res.render('api', { styles: 'api.css' });
}

exports.send404 = (req, res, next) => {
    res.render('404', { layout: '', styles: '404.css' });
}

exports.features = (req, res, next) => {
    res.render('features', { styles: 'features.css' });
}

exports.contact = (req, res, next) => {
    if(req.method === 'GET') {
        res.render('contact', { styles: 'contact.css' });
    } else if(req.method === 'POST') {
        let mailOpts, smtpTrans;
        smtpTrans = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        mailOpts = {
            from: req.body.name + ' &lt;' + req.body.email + '&gt;',
            to: process.env.EMAIL_USER,
            subject: 'New message from contact form at escapopedia.com',
            text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
        };
        smtpTrans.sendMail(mailOpts, function (error, response) {
            if (error) {
                console.log(req.body)
                res.render('index', { styles: 'index.css' });
            } else {
                console.log('Message sent!');
                res.render('index', { styles: 'index.css', message: 'Your message has been sent!' });
            }
        });
    }
}