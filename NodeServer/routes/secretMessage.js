var express = require('express');
var router = express.Router();
var SecretMessage;
var handleError;

function getSecretMessage(req, res){
	if (req.params.username && !req.query.key) 
		return handleError(req, res, 400, "No 'key' in URL params");

	var query = {};

	if (req.params.username) query.username = req.params.username;

	var executablequery = SecretMessage.find(query);

	executablequery.exec(function(err, secretMessages){
		if(err){ return handleError(req, res, 500, err); }

		if (secretMessages.length == 0) return res.json(secretMessages);

		if(req.params.username){
			var secretMessage = secretMessages[0].toJSON();
			secretMessage.decryptedMsg = secretMessages[0].decrypt(req.query.key)
			delete secretMessage.encryptedText;
			res.json(secretMessage);
		}
		else {
			res.json(secretMessages);
		}
	});
}

function addSecretMessage(req, res){
	if (!req.body.username) 
		return handleError(req, res, 400, "No 'username' in body");
	if (!req.body.text) 
		return handleError(req, res, 400, "No 'text' in body");
	if (!req.body.key) 
		return handleError(req, res, 400, "No 'key' in body");
	
	
	SecretMessage.findOne({username : req.body.username}, function(err, secretMessage){
		if(err){ return handleError(req, res, 500, err); }

		if (!secretMessage) secretMessage = new SecretMessage();

		secretMessage.username = req.body.username;
		secretMessage.encrypt(req.body.text, req.body.key);

		secretMessage.save(function(err, newSecretMessage){
			if(err){ return handleError(req, res, 500, err); }

			res.json(newSecretMessage)
		})
	})
}

function putSecretMessage(req, res){
	res.json({test: 'putMessage'});
}


// Routing
router.route('/')
	.get(getSecretMessage)
	.post(addSecretMessage)

router.route('/:username')
	.put(putSecretMessage)
	.get(getSecretMessage);


// Export
module.exports = function (mongoose, app, errCallback){
	console.log('Initializing messages routing module');

	SecretMessage = mongoose.model('SecretMessage');
	handleError = errCallback;
	return router;
};