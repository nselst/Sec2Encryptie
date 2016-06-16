
var serverUrl = "http://localhost:3000/"

$(document).on("click", "#SaveButton", function(){
	var data = {};
	data.username = $("#username").val()
	data.key = $("#key").val();
	data.text = $("#text").val();

	if (!data.username || !data.key) return setMsg("fill in username and key")

	var url = serverUrl + 'secretMessage';
	$.ajax({
	  method: "POST",
	  //contentType: "application/json",
	  url: url,
	  data: data
	})
    .done(function( msg ) {
	    setMsg( "Message Saved");
	    console.log(msg)
    })
    .fail(function( jqXHR, textStatus ) {
	  	setMsg( "Request failed: " + jqXHR.responseText );
	});
})
$(document).on("click", "#LoadButton", function(){
	var username = $("#username").val()
	var key = $("#key").val();

	if (!username || !key) return setMsg("fill in username and key")

	var url = serverUrl + 'secretMessage/' + username + '?key=' + key;
	$.get(url)
	.done(function(data, data2) {
		var text = ''; 
		var msg = '';
		
		if (!data.hasOwnProperty('decryptedMsg')) msg = "no message found";
		else text = data.decryptedMsg

     	$('#text').val(text)
     	setMsg(msg)
     	
  	})
  	.fail(function(err) {
  		setMsg("Error");
  		console.log({err: err})
	    alert( err );
  	})

})

$(document).on("click", "#ClearButton", function(){
	$('#text').val('');
	setMsg("text cleared")
})

function setMsg(msg){
	$("#msgbox").text(msg);
}