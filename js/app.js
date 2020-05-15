var urlBase = 'localhost';
var extension = 'php';

function doSignup()
{
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var jsonPayload = '{"email" : "' + email + '", password" : "' + password + '"}';
  var url = urlBase + '/signup.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");
  
  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.responseText );

    userId = jsonObject.id;

    if (userId < 1)
    {
      document.getElementById("signupResult").innerHTML = "User/Password combination incorrect";
      return;
    }

    email = jsonObject.email;

    saveCookie();

    window.location.href = "contacts.html";

  }
  catch(err)
  {
    document.getElementById("signupResult").innerHTML = err.message;
  }

}