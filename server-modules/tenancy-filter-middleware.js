module.exports = function (req, res, next) {
//TODO: Implement this as a ES6 class and insert constants for redirections and validate it with list of subscribed applications for current tenant

    if (true) //CheckRegistrationsAllowed(req.session.tenantId)
        next();
    else
        res.redirect("/404.html");
}