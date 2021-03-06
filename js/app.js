var urlBase = 'localhost';
var extension = 'php';
var userId = 0;
var userFirstName;
var userLastName;

var filter = "date_created ASC";
var listOfContacts;
var editContactId = -1;
var editFirstName;
var editLastName;
var editEmail;
var editPhoneNumber;
var keepLogin;

function setfilter(wantedFilter)
{
  document.getElementById("filterId").innerText = "Filtering by";

  if (wantedFilter == "first_name")
  {
    document.getElementById("filterId").innerText += " First Name";
  }
  else if (wantedFilter == "last_name")
  {
    document.getElementById("filterId").innerText += " Last Name";
  }
  else if (wantedFilter == "email")
  {
    document.getElementById("filterId").innerText += " Email";
  }
  else if (wantedFilter == "phone_number")
  {
    document.getElementById("filterId").innerText += " Phone Number";
  }
  else if (wantedFilter == "date_created")
  {
    document.getElementById("filterId").innerText += " Date Created";
  }

  if (filter == (wantedFilter + " ASC"))
  {
    filter = wantedFilter + " DESC";
    document.getElementById("filterId").innerText += " Descending";
  }
  else
  {
    filter = wantedFilter + " ASC";
    document.getElementById("filterId").innerText += " Ascending";
  }
}

function updateName()
{
  document.getElementById("userFirstname").innerHTML = "Hello " + userFirstName;
}

function reload()
{
  document.getElementById("listOfContacts").innerHTML = "";
  updateCookie(keepLogin);
}

function doSignup()
{

  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  if (firstName == "" && lastName == "" && email == "" && password == "")
  {
    updateResultFieldWithError(true, "signupResult", "All fields must be filled out");
    return;
  }

  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,24})+$/;

  if(!(mailformat.test(email)))
  {
    updateResultFieldWithError(true, "signupResult", "Email is not a valid email");
    return;
  }

  updateResultFieldWithError(false, "signupResult", "");

  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

  // hashing password
  var hash = md5( password );

  var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "password" : "' + hash + '"}';
  var url ='/phpscripts/signup.' + extension;
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  
  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");

  try
  {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse( xhr.response );

    userId = jsonObject.userId;

    if (userId < 1)
    {
      updateResultFieldWithError(true, "signupResult", "Email is already being used");
      return;
    }
    else
    {
      updateResultFieldWithError(false, "signupResult", "Sign up successful.");
      
      goHome();

    }


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
  keepLogin = document.getElementById("keepLoggedin").checked == true;

  // hashing password
  var hash = md5( password );

  var jsonPayload = '{"email" : "' + email + '", "password" : "' + hash + '"}';
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

function doForgotPassword()
{
  var firstName = document.getElementById("forgotFirstName").value;
  var lastName = document.getElementById("forgotLastName").value;
  var email = document.getElementById("forgotEmail").value;
  var password = document.getElementById("forgotPassword").value;
 
  if (firstName == "" || lastName == "" || email == "" || password == "")
  {
    updateResultFieldWithError(true, "forgotPasswordResults", "All fields must be filled out");
    return;
  }
 
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 
  if(!(mailformat.test(email)))
  {
    updateResultFieldWithError(true, "forgotPasswordResults", "Email is not a valid email");
    return;
  }
 
 
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
 
  // hashing password
  var hash = md5( password );
 
  var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "password" : "' + hash + '"}';
  var url ='/phpscripts/forgotPassword.' + extension;
 
 
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  
  xhr.setRequestHeader("Content-type" , "application/json; charset=UTF-8");
 
  try
  {
    xhr.send(jsonPayload);
 
    var jsonObject = JSON.parse( xhr.response );
 
    if (jsonObject.result == "Success")
    {
      document.getElementById("forgotPasswordResults").style.color = "green";
      updateResultFieldWithError(false, "forgotPasswordResults", "Update Password Success Returning to Sign in");
      setTimeout(() => {
        goSignIns()
      }, 1000);
    }
    else
    {
      updateResultFieldWithError(true, "forgotPasswordResults", "Did not find a account that matches first name, last name, or email");
    }
 
  }
 
  catch(err)
  {
    updateResultFieldWithError(true, "console.log(jsonObject.result);", err.message);
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
  
  if (firstName == "" && lastName == "" && email == "" && phone == "")
  {
    updateResultFieldWithError(true, "addResult", "Can't add empty contact");
    return;
  }
  else if (firstName == "" && lastName == "")
  {
    updateResultFieldWithError(true, "addResult", "First or Last Name must be filled");
    return;
  }
  else if (email == "" && phone == "")
  {
    updateResultFieldWithError(true, "addResult", "Email or Phone Number must be filled");
    return;
  }
  else if (email != "")
  {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
    if(!(mailformat.test(email)))
    {
      updateResultFieldWithError(true, "addResult", "Email is not a valid email");
      return;
    }
  }
  else if (phone != "")
  {
    var numberformat = /^[0-9]+$/;
  
    if(!(numberformat.test(phone)))
    {
      updateResultFieldWithError(true, "addResult", "Phone Number is not a valid number");
      return;
    }
  }

  updateResultFieldWithError(false, "addResult", "");

  document.getElementById("addFirstName").value = "";
  document.getElementById("addLastName").value = "";
  document.getElementById("addEmail").value = "";
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
      updateResultFieldWithError(true, "Results", "User/Password combination incorrect");
      return;
    }

    updateResultFieldWithError(false, "Results", "Add successful");

  }

  catch(err)
  {
    updateResultFieldWithError(true, "Results", err.message);
  }
}

function doSearch()
{
  var search = document.getElementById("searchBar").value;

  // Danger zone begin
  if (search == "")
  {
    var theList = document.getElementById("listOfContacts");
    theList.innerHTML += "<tr>";
    theListElement = theList.getElementsByTagName("tr")[0];
    theListElement.innerHTML += "<th class=\"contactList listFName\">Please Search for a Contact</th>";
    return;
  }
  // Danger zone end

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
        document.getElementById("Results").innerHTML = "Contact(s) has been retrieved";
        
        // console.log(xhr.response);  
        var jsonObject = JSON.parse( xhr.response );
        
        var theList = document.getElementById("listOfContacts");

        if (jsonObject.error == "No Records Found")
        {
          theList.innerHTML += "<tr>";
          theListElement = theList.getElementsByTagName("tr")[0];
          theListElement.innerHTML += "<th class=\"contactList listFName\">No Results Found</th>";
          return;
        }

        var flag = false;

        listOfContacts = jsonObject;

        theList.innerHTML += "<tr>";

        theListElement = theList.getElementsByTagName("tr")[0];

        theListElement.innerHTML += "<th class=\"contactList listFName\">First Name</th>";
        theListElement.innerHTML += "<th class=\"contactList listFName\">Last Name</th>";
        theListElement.innerHTML += "<th class=\"contactList listFName\">Email</th>";
        theListElement.innerHTML += "<th class=\"contactList listFName\">Phone Number</th>";
        theListElement.innerHTML += "<th class=\"contactList listFName\">Edit</th>";
        theListElement.innerHTML += "<th class=\"contactList listFName\">Delete</th>";
        

        for(var i = 0;i < jsonObject.results.length; i++)
        {
          var firstName = listOfContacts.results[i].firstName;
          var lastName = listOfContacts.results[i].lastName;
          var email = listOfContacts.results[i].email;
          var phoneNumber = listOfContacts.results[i].phoneNumber;
          var contactId = listOfContacts.results[i].contactId;

          theList.innerHTML += "<tr>";

          theListElement = theList.getElementsByTagName("tr")[i + 1];

          theListElement.innerHTML += "<td class=\"contactList listFName\">" + firstName + "</td>";
          theListElement.innerHTML += "<td class=\"contactList listLName\">" + lastName + "</td>";
          theListElement.innerHTML += "<td class=\"contactList listEmail\">" + email + "</td>";
          theListElement.innerHTML += "<td class=\"contactList listPhone\">" + phoneNumber + "</td>";
          theListElement.innerHTML += "<td class=\"contactList listPhone\"><button type=\"button\" class=\"listButton\" onclick=\"doEdit(" + contactId + ",'" + firstName + "','" + lastName + "','" + email + "','" + phoneNumber + "', 'edit' );\">Edit</button></td>";
          theListElement.innerHTML += "<td class=\"contactList listPhone\"><button type=\"button\" class=\"listButton\" onclick=\"doDelete(" + contactId + "); doSearch(); reload(); doEdit(" + contactId + ",'" + firstName + "','" + lastName + "','" + email + "','" + phoneNumber + "', 'delete' ); \">Delete</button></td>";

          // for edit
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
    updateResultFieldWithError(true, "Results", err.message);
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
    updateResultFieldWithError(true, "Results", err.message);
  }

}

function doEdit(newContactId, newFirstName, newLastName, newEmail, newPhoneNumber, from)
{
  if (from == "delete")
  {
    if (editContactId == newContactId)
    {
      document.getElementById('togglehide').style.visibility='hidden';
      editContactId = -1;
    }
  }
  else if (from == "edit")
  {
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
  }
  else
  {
    // console.log("neither edit nor delete");
  }
}

function doUpdate()
{

  var firstName = document.getElementById("updateFirstName").value;
  var lastName = document.getElementById("updateLastName").value;
  var email = document.getElementById("updateEmail").value;
  var phone = document.getElementById("updatePhone").value;
  var contactId = editContactId;

  if (firstName == "" && lastName == "" && email == "" && phone == "")
  {
    updateResultFieldWithError(true, "editResult", "Can't add empty contact");
    return;
  }
  else if (firstName == "" && lastName == "")
  {
    updateResultFieldWithError(true, "editResult", "First or Last Name must be filled");
    return;
  }
  else if (email == "" && phone == "")
  {
    updateResultFieldWithError(true, "editResult", "Email or Phone Number must be filled");
    return;
  }
  else if (email != "")
  {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
    if(!(mailformat.test(email)))
    {
      updateResultFieldWithError(true, "editResult", "Email is not a valid email");
      return;
    }
  }
  else if (phone != "")
  {
    var numberformat = /^[0-9]+$/;
  
    if(!(numberformat.test(phone)))
    {
      updateResultFieldWithError(true, "editResult", "Phone Number is not a valid number");
      return;
    }
  }

  updateResultFieldWithError(false, "editResult", "");

  document.getElementById('togglehide').style.visibility='hidden';
  editContactId = -1;

  document.getElementById("updateFirstName").value = "";
  document.getElementById("updateLastName").value = "";
  document.getElementById("updateEmail").value = "";
  document.getElementById("updatePhone").value = "";



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
      updateResultFieldWithError(true, "Results" , "Couldn't update contact.");
      return;
    }

    updateResultFieldWithError(false, "Results", "Update successful.");

  }

  catch(err)
  {
    updateResultFieldWithError(true, "Results", err.message);
  }
}

function doDelete(contactId)
{
  var answer = confirm("Are you sure you want to delete this contact?");

  if (!answer)
  {
    console.log("aborting delete");
    return;
  }
  
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
      updateResultFieldWithError(true, "Results", "Couldn't delete contact.");
      return;
    }

    updateResultFieldWithError(false, "Results", "Delete successful.");

  }

  catch(err)
  {
    updateResultFieldWithError(true, "Results", err.message);
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

function updateCookie(checked)
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
  document.cookie = "firstName=" + userFirstName + ", lastName=" + userLastName + ", userId=" + userId + ";expires=" + date.toGMTString();
}

function deleteCookie()
{
  var date = new Date();
  date.setTime(date.getTime()-1000);	
  document.cookie = "firstName=" + userFirstName + ", lastName=" + userLastName + ", userId=" + userId + ";expires=" + date.toGMTString();
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
      userLastName = tokens[1];
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