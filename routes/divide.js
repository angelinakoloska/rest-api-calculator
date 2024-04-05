var express = require('express');
const jsend = require('jsend');
const jwt = require('jsonwebtoken'); // Require jsonwebtoken module
var router = express.Router();

router.use(jsend.middleware);

router.get('/:number1/:number2', function (req, res, next) {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"})
    }

    const number2 = parseInt(req.params.number2);
    if(isNaN(number2)) {
        return res.jsend.fail({"number2": "number2 is not in correct format"})
    }

    if (number2 == 0) {
        return res.jsend.fail({"number2": "number 2 cannot be 0"});
    }
        
    const result = number1 / number2;
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) { // Handle case where there is no token provided
        return res.jsend.fail({"message": "Authorization token is missing."});
    }
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (decodedToken && decodedToken.id) { // Ensure decodedToken exists and has id
            resultService.create("divide", Math.round(result), decodedToken.id);
        } else {
            throw new Error("Invalid token");
        }
        if (Number.isInteger(result)) {
            res.jsend.success({"result": result});
        } else {
            res.jsend.success({"result": Math.round(result), "message": "Result has been rounded, as it was not an integer."});
        }
    } catch(err) {
        // Handle token verification errors
        if (Number.isInteger(result)) {
            res.jsend.fail({"result": result, "error": err});
        } else {
            res.jsend.fail({"result": Math.round(result), "error": err, "message": "Result has been rounded, as it was not an integer."});
        }
    }
});

module.exports = router;
