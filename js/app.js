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
  
  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");

  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.response );

    console.log(xhr);

    userId = jsonObject.id;

    if (userId < 1)
    {
      updateResultFieldWithError(true, "signupResult", "Could not create account");
      return;
    }

    email = jsonObject.email;

    updateResultFieldWithError(false, "signupResult", "Sign up successful. Please sign in. You are being redirected.");
    
    goHome();

  }

  catch(err)
  {
    console.log(err);
    updateResultFieldWithError(true, "signupResult", err.message);
  }
}

function doSignin()
{
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var jsonPayload = '{"email" : "' + email + '", "password" : "' + password + '"}';
  var url ='/phpscripts/signin.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  
  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");
  
  console.log(jsonPayload);

  try
  {
    xhr.send(jsonPayload);

    console.log(xhr);
    console.log(xhr.response);
    var jsonObject = JSON.parse( xhr.response );

    userID = jsonObject.userID;
    firstName = jsonObject.firstName;
    lastName = jsonObject.lastName;
    email = jsonObject.email;

    if ( userID < 0 ){
      updateResultFieldWithError(true, "signinResult", "User/Password combination incorrect");
      return;
    }

    updateResultFieldWithError(false, "signinResult", "Login successful. Welcome "+ firstName + " " + lastName + ". Redirecting you to the home page.");

    saveCookie();
    goContacts();
  }

  catch(err)
  {
    updateResultFieldWithError(true, "signinResult", err.message);
    console.log(jsonObject);
    console.log(err);
  }

}

function updateResultFieldWithError(isError, elementID, message)
{
  if(isError == true)
  {
    document.getElementById(elementID).setAttribute("class", "errorMessage");
  }
  else 
  {
    document.getElementById(elementID).classList.remove("errorMessage");
  }
  document.getElementById(elementID).innerHTML = message;
  return;
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toGMTString();
}

function goHome()
{
  setTimeout(function(){ window.location.href = "index.html"; }, 5000);
}

function goContacts()
{
  setTimeout(function(){ window.location.href = "contacts.html"; }, 5000);
}