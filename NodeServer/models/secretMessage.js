var crypto = require('crypto'),
    algorithm = 'aes-256-ctr'

function init(mongoose){
	console.log('Iniializing message schema');

	var Schema = mongoose.Schema;

	var secretMessageSchema = new Schema({
  	    username : {type: String, required: true, unique: true},
  	    encryptedText : {type: String, required: true},
	});

	secretMessageSchema.methods.encrypt = function(text, password) {
	    var cipher = crypto.createCipher(algorithm,password)
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		this.encryptedText = crypted;
		return crypted;
	};

	secretMessageSchema.methods.decrypt = function(password) {
	    if (!this.encryptedText) return "";
	    var decipher = crypto.createDecipher(algorithm,password)
		var dec = decipher.update(this.encryptedText,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	};

	mongoose.model("SecretMessage", secretMessageSchema);
}


module.exports = init; 