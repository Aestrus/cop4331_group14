var urlBase = 'localhost';
var extension = 'php';
var userId = 0;

function doSignup()
{
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;

  var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "password" : "' + password + '"}';
  var url ='/phpscripts/signup.' + extension;
  userId
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  
  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");

  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.response );

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
  
  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.response );

    userId = jsonObject.userId;
    firstName = jsonObject.firstName;
    lastName = jsonObject.lastName;
    email = jsonObject.email;

    if ( userId < 0 ){
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
  }

}

function doAdd()
{
  var firstName = document.getElementById("addFirstName").value;
  var lastName = document.getElementById("addLastName").value;
  var email = document.getElementById("addEmail").value;
  var phone = document.getElementById("addPhone").value;
  
  var jsonPayload = '{'+
  '"firstName" : "' + firstName + '", ' +
  '"lastName" : "' + lastName + '", ' +
  '"email" : "' + email + '", ' +
  '"phoneNumber" : "' + phone + '", ' +
  '"userId" : "' + userId + '"' +
  '}';

  var url ='/phpscripts/add.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");
  
  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.response );

    var status = 0;

    if ( status < 0 ){
      updateResultFieldWithError(true, "addResult", "User/Password combination incorrect");
      return;
    }

    updateResultFieldWithError(false, "addResult", "Login successful. Welcome "+ firstName + " " + lastName + ". Redirecting you to the home page.");

  }

  catch(err)
  {
    updateResultFieldWithError(true, "addResult", err.message);
  }
}

function doSearch()
{
  var search = document.getElementById("searchBar").value;
  var jsonPayload = '{'+
  '"search" : "' + search + '", ' +
  '"userId" : "' + userId + '"' +
  '}';
  
  var url ='/phpscripts/search.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  console.log(jsonPayload);

  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");

  try
  {
    xhr.onreadystatechange = function()
    {
      if(this.readyState == 4 && this.status == 200)
      {
        document.getElementById("searchResult").innerHTML = "Contact(s) has been retrieved";
        
        console.log(xhr);
        console.log("\n\n\n");
        console.log(xhr.response);
        var jsonObject = JSON.parse( xhr.response );
        
        for(var i = 0;i < jsonObject.results.length; i++)
        {
          contactsList += jsonObject.results[i];
          if(i < jsonObject.results.length -1)
          {
            contactsList += "<br />\r\n";
          }
        }
        
        document.getElementById("contactsList").innerHTML = contactsList.innerHTML;
      }
    };
		xhr.send(jsonPayload);
  }

  catch(err)
  {
    updateResultFieldWithError(true, "searchResult", err.message);
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
  document.cookie = "firstName=" + firstName + ", lastName=" + lastName + ", userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{

  userId = -1;

  var data = document.cookie;
  var splits = data.split(",");

  for(var i = 0; i < splits.length; i++){
    var current = splits[i].trim();
    var tokens = current.split("=");
    if(tokens[0] == "firstName")
    {
      firstName = tokens[1];
    }
    if(tokens[0] == "lastName")
    {
      lastName = tokens[1];
    }
    if(tokens[0] == "userId")
    {
      userId = tokens[1];
    }
  }

  if(userId < 0)
  {
    goHome(0);
  }
  else
  {
  }

}

function goHome()
{
  setTimeout(function(){ window.location.href = "index.html"; }, 5000);
}

function goHome(time)
{
  setTimeout(function(){ window.location.href = "index.html"; }, time);
}

function goContacts()
{
  setTimeout(function(){ window.location.href = "contacts.html"; }, 5000);
}