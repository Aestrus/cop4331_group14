var urlBase = 'localhost';
var extension = 'php';
var userId = 0;

var listOfContacts;

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

function doSignout()
{
  deleteCookie();
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

  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");

  try
  {
    xhr.onreadystatechange = function()
    {
      if(this.readyState == 4 && this.status == 200)
      {
        document.getElementById("searchResult").innerHTML = "Contact(s) has been retrieved";
        
        console.log(xhr.response);  
        var jsonObject = JSON.parse( xhr.response );
        console.log(jsonObject);
        
        for(var i = 0;i < jsonObject.results.length; i++)
        {
          
          contactsList.innerHTML += jsonObject.results[i];
          console.log(jsonObject.results);
          console.log(contactsList);
          if(i < jsonObject.results.length -1)
          {
            contactsList += "<br />\r\n";
          }
        }
        console.log(typeof(contactsList));
        document.getElementsByTagName("p")[0].innerHTML = contactsList;
      }
    };
		xhr.send(jsonPayload);
  }

  catch(err)
  {
    updateResultFieldWithError(true, "searchResult", err.message);
  }

}

function doGetContacts()
{
  var jsonPayload = '{'+
  '"userId" : "' + userId + '"' +
  '}';

  var url ='/phpscripts/showcontacts.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");
  
  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.response );

    listOfContacts = jsonObject;

    var theList = document.getElementById("listOfContacts");

    for (var i = 0; i < listOfContacts.results.length; i++){
      // do stuff
      var firstName = listOfContacts.results[i].firstName;
      var lastName = listOfContacts.results[i].lastName;
      var email = listOfContacts.results[i].email;
      var phoneNumber = listOfContacts.results[i].phoneNumber;
      var contactId = listOfContacts.results[i].contactId;

      theList.innerHTML += "<li>";
      
      theListElement = theList.getElementsByTagName("li")[i];

      theListElement.innerHTML += "<span class=\"contactList listFName\">" + firstName + "</span>";
      theListElement.innerHTML += "<span class=\"contactList listLName\">" + lastName + "</span>";
      theListElement.innerHTML += "<span class=\"contactList listEmail\">" + email + "</span>";
      theListElement.innerHTML += "<span class=\"contactList listPhone\">" + phoneNumber + "</span>";
      theListElement.innerHTML += "<span class=\"contactList contactId\">" + contactId + "</span>";
      theListElement.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doEdit(" + contactId + ");\">Edit</button>";
      theListElement.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doDelete(" + listOfContacts.results[i].contactId + ")\">Delete</button>";
      theListElement.innerHTML += "<div id=\"listOfContacts" + contactId + "\" class=\"editForm editHidden\">";

      theListForm = theListElement.getElementsByClassName("editForm")[0];

      theListForm.innerHTML += "<label>First name</label>";
      theListForm.innerHTML += "<input type=\"text\" name=\"firstName\" id=\"updateFirstName" + contactId + "\" value=\"" + firstName + "\">";
      theListForm.innerHTML += "<label>Last name</label>";
      theListForm.innerHTML += "<input type=\"text\" name=\"lastName\" id=\"updateLastName" + contactId + "\" value=\"" + lastName + "\">";
      theListForm.innerHTML += "<label>Email</label>";
      theListForm.innerHTML += " <input type=\"text\" name=\"email\" id=\"updateEmail" + contactId + "\" value=\"" + email + "\">";
      theListForm.innerHTML += "<label>Phone Number</label>";
      theListForm.innerHTML += "<input type=\"text\" name=\"phoneNumber\" id=\"updatePhone" + contactId + "\" value=\"" + phoneNumber + "\">";
      theListForm.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doUpdate(" + contactId + ");\">Update</button>";

      theListElement.innerHTML += "<span id=\"updateResult" + contactId + "\">";
      if ( i < listOfContacts.length - 1)
        theList.innerHTML += "</ br>";
    }
  }

  catch(err)
  {
    //console.log("something went wrong");
    //updateResultFieldWithError(true, "addResult", err.message);
  }

}

function doEdit(contactId)
{
  document.getElementById("listOfContacts" + contactId).classList.toggle("editHidden");
}

function doUpdate(contactId)
{

  var firstName = document.getElementById("updateFirstName" + contactId).value;
  var lastName = document.getElementById("updateLastName" + contactId).value;
  var email = document.getElementById("updateEmail" + contactId).value;
  var phone = document.getElementById("updatePhone" + contactId).value;
  
  var jsonPayload = '{'+
  '"firstName" : "' + firstName + '", ' +
  '"lastName" : "' + lastName + '", ' +
  '"email" : "' + email + '", ' +
  '"phoneNumber" : "' + phone + '", ' +
  '"contactId" : "' + contactId + '"' +
  '}';

  var url ='/phpscripts/update.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");
  
  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.response );

    var status = 0;

    if ( status < 0 ){
      updateResultFieldWithError(true, "updateResult" + contactId, "Couldn't update contact.");
      return;
    }

    updateResultFieldWithError(false, "updateResult" + contactId, "Update successful.");

  }

  catch(err)
  {
    updateResultFieldWithError(true, "updateResult" + contactId, err.message);
  }
}

function doDelete(contactId)
{
  
  var jsonPayload = '{'+
  '"contactId" : "' + contactId + '"' +
  '}';

  var url ='/phpscripts/delete.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");
  
  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.response );

    var status = 0;

    if ( status < 0 ){
      updateResultFieldWithError(true, "updateResult" + contactId, "Couldn't delete contact.");
      return;
    }

    updateResultFieldWithError(false, "updateResult" + contactId, "Delete successful.");

  }

  catch(err)
  {
    updateResultFieldWithError(true, "updateResult" + contactId, err.message);
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

function deleteCookie()
{
  document.cookie = ";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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
  setTimeout(function(){ window.location.href = "contacts.html"; }, 0000);
}

function goSignIns()
{
  setTimeout(function(){ window.location.href = "signin.html"; }, 0000);
}

function goSignUp()
{
  setTimeout(function(){ window.location.href = "signup.html"; }, 0000);
}

function goForgetPassword()
{
  setTimeout(function(){ window.location.href = "forgotPassword.html"; }, 0000);
}