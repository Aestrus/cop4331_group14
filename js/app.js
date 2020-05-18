var urlBase = 'localhost';
var extension = 'php';

function doSignup()
{
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;

  var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "password" : "' + password + '"}';
  var url ='/phpscripts/signup.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  console.log(url);
  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");
  console.log(jsonPayload);
  try
  {
    xhr.send(jsonPayload);

    var response = xhr.response;

    console.log( response ) ;

    var jsonObject = JSON.parse( response );
  
    console.log( jsonObject ); 

    userId = jsonObject.id;

    if (userId < 1)
    {
      document.getElementById("signupResult").innerHTML = "User/Password combination incorrect";
      return;
    }

    email = jsonObject.email;
    document.getElementById("signupResult").innerHTML = "Sign up successful. Please sign in. You are being redirected.";
    setTimeout(function(){ window.location.href = "index.html"; }, 5000);

  }

  catch(err)
  {
    document.getElementById("signupResult").innerHTML = err.message;
    console.log(err);
  }
}
function doSignin()
{
  var email = document.getElementById("email");
  var password = document.getElementById("password");

  try
  {


    saveCookie();
  }

  catch
  {

  }

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}