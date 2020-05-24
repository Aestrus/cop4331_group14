var urlBase = 'localhost';
var extension = 'php';
var userId = 0;
var userFirstName;

var filter = "contact_id";
var listOfContacts;
var editContactId = -1;
var editFirstName;
var editLastName;
var editEmail;
var editPhoneNumber;

function setfilter(wantedFilter)
{
  if (filter == (wantedFilter + " ASC"))
  {
    filter = wantedFilter + " DESC";
  }
  else
  {
    filter = wantedFilter + " ASC";
  }
}

function updateName()
{
  document.getElementById("userFirstname").innerHTML = "Hello " + userFirstName;
}

function reload()
{
  document.getElementById("listOfContacts").innerHTML = "";
}

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
  var keepLogin = document.getElementById("keepLoggedin").checked == true;

  console.log(keepLogin + "=====");

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
    
    saveCookie(keepLogin);
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
  document.getElementById("addFirstName").value = "";
  var lastName = document.getElementById("addLastName").value;
  document.getElementById("addLastName").value = "";
  var email = document.getElementById("addEmail").value;
  document.getElementById("addEmail").value = "";
  var phone = document.getElementById("addPhone").value;
  document.getElementById("addPhone").value = "";
  
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
  '"userId" : "' + userId + '", ' +
  '"filter" : "' + filter + '"' +
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
        
        // console.log(xhr.response);  
        var jsonObject = JSON.parse( xhr.response );
        
        var theList = document.getElementById("listOfContacts");

        if (jsonObject.error == "No Records Found")
        {
          theList.innerHTML += "<li>";
          theListElement = theList.getElementsByTagName("li")[0];
          theListElement.innerHTML += "<span class=\"contactList listFName\">No Results Found</span>";
          return;
        }

        var flag = false;

        listOfContacts = jsonObject;
        for(var i = 0;i < jsonObject.results.length; i++)
        {
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
          theListElement.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doEdit(" + contactId + "," + firstName + "," + lastName + "," + email + "," + phoneNumber + ", 'edit' );\">Edit</button>";
          theListElement.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doDelete(" + contactId + "); reload(); doSearch(); doEdit(" + contactId + "," + firstName + "," + lastName + "," + email + "," + phoneNumber + ", 'delete' ); \">Delete</button>";
          if(i < jsonObject.results.length - 1)
          {
            contactsList += "<br />\r\n";
          }
          if (contactId == editContactId)
          {
            flag = true;
          }
        }
        if (!flag)
        {
          document.getElementById('togglehide').style.visibility='hidden';
          editContactId = -1;
        }
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

    if (jsonObject.error == "No Records Found")
    {
      theList.innerHTML += "<li>";
      theListElement = theList.getElementsByTagName("li")[0];
      theListElement.innerHTML += "<span class=\"contactList listFName\">No Results Found</span>";
      return;
    }

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
      theListElement.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doEdit(" + i + ", 'edit' );\">Edit</button>";
      theListElement.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doDelete(" + listOfContacts.results[i].contactId + "); reload(); doGetContacts(); doEdit("+ i +", 'delete' ); \">Delete</button>";

      if ( i < listOfContacts.length - 1)
        theList.innerHTML += "</ br>";
    }
  }

  catch(err)
  {
    // console.log("something went wrong");
    updateResultFieldWithError(true, "addResult", err.message);
  }

}

function doEdit(newContactId, newFirstName, newLastName, newEmail, newPhoneNumber, from)
{
  if (from == "delete")
  {
    console.log("in delete");
    if (editContactId == newContactId)
    {
      console.log("in delete's if statement");
      document.getElementById('togglehide').style.visibility='hidden';
      editContactId = -1;
    }
    console.log(editContactId);
  }
  else if (from == "edit")
  {
    console.log("in edit");
    if (editContactId == newContactId)
    {
      document.getElementById('togglehide').style.visibility='hidden';
      editContactId = -1;
    }
    else
    {
      document.getElementById('togglehide').style.visibility='visible';
      editContactId = newContactId;
      document.getElementById("updateFirstName").value = newFirstName;
      document.getElementById("updateLastName").value = newLastName;
      document.getElementById("updateEmail").value = newEmail;
      document.getElementById("updatePhone").value = newPhoneNumber;
    }
    console.log(editContactId);
  }
  else
  {
    console.log("neither edit nor delete");
  }
}

function doUpdate()
{

  var firstName = document.getElementById("updateFirstName").value;
  var lastName = document.getElementById("updateLastName").value;
  var email = document.getElementById("updateEmail").value;
  var phone = document.getElementById("updatePhone").value;
  var contactId = listOfContacts.results[toggleindex].contactId;

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
      updateResultFieldWithError(true, "updateResult" , "Couldn't update contact.");
      return;
    }

    updateResultFieldWithError(false, "updateResult", "Update successful.");

  }

  catch(err)
  {
    updateResultFieldWithError(true, "updateResult", err.message);
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
      updateResultFieldWithError(true, "updateResult", "Couldn't delete contact.");
      return;
    }

    updateResultFieldWithError(false, "updateResult", "Delete successful.");

  }

  catch(err)
  {
    updateResultFieldWithError(true, "updateResult", err.message);
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

function saveCookie(checked)
{
  var minutes;
  if (checked)
  {
    minutes = 43800;
  }
  else
  {
    minutes = 20;
  }
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
      userFirstName = tokens[1];
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