var urlBase = "localhost";
var extension = "php";
var userId = 0;
var userFirstName;

var filter = "contact_id";
var listOfContacts;
var toggleindex = -1;

function setfilter(wantedFilter) {
  if (filter == (wantedFilter + " ASC")) {
    filter = wantedFilter + " DESC";
  }
  else {
    filter = wantedFilter + " ASC";
  }
}

function updateName() {
  document.getElementById("userFirstname").innerHTML = "Hello " + userFirstName;
}

function reload() {
  document.getElementById("listOfContacts").innerHTML = "";
}

function doSignup() {

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;

  var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "password" : "' + password + '"}';
  var url = '/phpscripts/signup.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse(xhr.response);

    userId = jsonObject.id;

    if (userId < 1) {
      updateResultFieldWithError(
        true,
        "signupResult",
        "Could not create account"
      );
      return;
    }

    email = jsonObject.email;

    updateResultFieldWithError(
      false,
      "signupResult",
      "Sign up successful. Please sign in. You are being redirected."
    );

    goHome();
  } catch (err) {
    updateResultFieldWithError(true, "signupResult", err.message);
  }
}

function doSignin() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var jsonPayload =
    '{"email" : "' + email + '", "password" : "' + password + '"}';
  var url = "/phpscripts/signin." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse(xhr.response);

    userId = jsonObject.userId;
    firstName = jsonObject.firstName;
    lastName = jsonObject.lastName;
    email = jsonObject.email;

    if (userId < 0) {
      updateResultFieldWithError(
        true,
        "signinResult",
        "User/Password combination incorrect"
      );
      return;
    }

    updateResultFieldWithError(
      false,
      "signinResult",
      "Login successful. Welcome " +
      firstName +
      " " +
      lastName +
      ". Redirecting you to the home page."
    );

    saveCookie();
    goContacts();
  } catch (err) {
    updateResultFieldWithError(true, "signinResult", err.message);
  }
}

function doSignout() {
  deleteCookie();
}

function doSignout() {
  deleteCookie();
}

function doAdd() {
  var firstName = document.getElementById("addFirstName").value;
  document.getElementById("addFirstName").value = "";
  var lastName = document.getElementById("addLastName").value;
  document.getElementById("addLastName").value = "";
  var email = document.getElementById("addEmail").value;
  document.getElementById("addEmail").value = "";
  var phone = document.getElementById("addPhone").value;
  document.getElementById("addPhone").value = "";

  var jsonPayload = '{' +
    '"firstName" : "' + firstName + '", ' +
    '"lastName" : "' + lastName + '", ' +
    '"email" : "' + email + '", ' +
    '"phoneNumber" : "' + phone + '", ' +
    '"userId" : "' + userId + '"' +
    '}';

  var url = '/phpscripts/add.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse(xhr.response);

    var status = 0;

    if (status < 0) {
      updateResultFieldWithError(
        true,
        "addResult",
        "User/Password combination incorrect"
      );
      return;
    }

    updateResultFieldWithError(
      false,
      "addResult",
      "Login successful. Welcome " +
      firstName +
      " " +
      lastName +
      ". Redirecting you to the home page."
    );
  } catch (err) {
    updateResultFieldWithError(true, "addResult", err.message);
  }
}

function doSearch() {
  var search = document.getElementById("searchBar").value;
  var jsonPayload = '{' +
    '"search" : "' + search + '", ' +
    '"userId" : "' + userId + '", ' +
    '"filter" : "' + filter + '"' +
    '}';

  var url = '/phpscripts/search.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("searchResult").innerHTML = "Contact(s) has been retrieved";

        // console.log(xhr.response);  
        var jsonObject = JSON.parse(xhr.response);

        var theList = document.getElementById("listOfContacts");

        if (jsonObject.error == "No Records Found") {
          theList.innerHTML += "<li>";
          theListElement = theList.getElementsByTagName("li")[0];
          theListElement.innerHTML += "<span class=\"contactList listFName\">No Results Found</span>";
          return;
        }

        listOfContacts = jsonObject;
        for (var i = 0; i < jsonObject.results.length; i++) {
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
          theListElement.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doDelete(" + contactId + "); reload(); doGetContacts(); doEdit(" + i + ", 'delete' ); \">Delete</button>";
          if (i < jsonObject.results.length - 1) {
            contactsList += "<br />\r\n";
          }
        }
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    updateResultFieldWithError(true, "searchResult", err.message);
  }
}

function doGetContacts() {
  var jsonPayload = "{" + '"userId" : "' + userId + '"' + "}";

  var url = "/phpscripts/showcontacts." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse(xhr.response);

    listOfContacts = jsonObject;

    var theList = document.getElementById("listOfContacts");

    if (jsonObject.error == "No Records Found") {
      theList.innerHTML += "<li>";
      theListElement = theList.getElementsByTagName("li")[0];
      theListElement.innerHTML +=
        '<span class="contactList listFName">No Results Found</span>';
      return;
    }

    console.log(listOfContacts);

    for (var i = 0; i < listOfContacts.results.length; i++) {
      // do stuff
      var firstName = listOfContacts.results[i].firstName;
      var lastName = listOfContacts.results[i].lastName;
      var email = listOfContacts.results[i].email;
      var phoneNumber = listOfContacts.results[i].phoneNumber;
      var contactId = listOfContacts.results[i].contactId;

      theList.innerHTML += "<li>";

      theListElement = theList.getElementsByTagName("li")[i];

      theListElement.innerHTML +=
        '<span class="contactList listFName">' + firstName + "</span>";
      theListElement.innerHTML +=
        '<span class="contactList listLName">' + lastName + "</span>";
      theListElement.innerHTML +=
        '<span class="contactList listEmail">' + email + "</span>";
      theListElement.innerHTML +=
        '<span class="contactList listPhone">' + phoneNumber + "</span>";
      theListElement.innerHTML +=
        '<button type="button" class="listButton" onclick="doEdit(' +
        i +
        ');">Edit</button>';
      theListElement.innerHTML +=
        '<button type="button" class="listButton" onclick="doDelete(' +
        listOfContacts.results[i].contactId +
        '); reload(); doGetContacts(); ">Delete</button>';

      if (i < listOfContacts.length - 1) theList.innerHTML += "</ br>";
    }
  } catch (err) {
    console.log("something went wrong");
    updateResultFieldWithError(true, "addResult", err.message);
  }
}

function doEdit(index) {
  if (toggleindex == -1) {
    document.getElementById("togglehide").classList.toggle("show");
  } else if (toggleindex == index) {
    document.getElementById("togglehide").classList.toggle("show");
  }
  toggleindex = index;
  document.getElementById("updateFirstName").value =
    listOfContacts.results[index].firstName;
  document.getElementById("updateLastName").value =
    listOfContacts.results[index].lastName;
  document.getElementById("updateEmail").value =
    listOfContacts.results[index].email;
  document.getElementById("updatePhone").value =
    listOfContacts.results[index].phoneNumber;
}

function doGetContacts() {
  var jsonPayload = '{' +
    '"userId" : "' + userId + '"' +
    '}';

  var url = '/phpscripts/showcontacts.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse(xhr.response);

    listOfContacts = jsonObject;

    var theList = document.getElementById("listOfContacts");

    if (jsonObject.error == "No Records Found") {
      theList.innerHTML += "<li>";
      theListElement = theList.getElementsByTagName("li")[0];
      theListElement.innerHTML += "<span class=\"contactList listFName\">No Results Found</span>";
      return;
    }

    for (var i = 0; i < listOfContacts.results.length; i++) {
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
      theListElement.innerHTML += "<button type=\"button\" class=\"listButton\" onclick=\"doDelete(" + listOfContacts.results[i].contactId + "); reload(); doGetContacts(); doEdit(" + i + ", 'delete' ); \">Delete</button>";

      if (i < listOfContacts.length - 1)
        theList.innerHTML += "</ br>";
    }
  }

  catch (err) {
    // console.log("something went wrong");
    updateResultFieldWithError(true, "addResult", err.message);
  }

}

function doEdit(index, from) {
  if (from == "delete") {
    if (toggleindex == index) {
      document.getElementById('togglehide').style.visibility = 'hidden';
      toggleindex = -1;
    }
  }
  else if (from == "edit") {
    if (toggleindex == index) {
      document.getElementById('togglehide').style.visibility = 'hidden';
      toggleindex = -1;
    }
    else {
      document.getElementById('togglehide').style.visibility = 'visible';
      toggleindex = index;
      document.getElementById("updateFirstName").value = listOfContacts.results[index].firstName;
      document.getElementById("updateLastName").value = listOfContacts.results[index].lastName;
      document.getElementById("updateEmail").value = listOfContacts.results[index].email;
      document.getElementById("updatePhone").value = listOfContacts.results[index].phoneNumber;
    }
  }
  else {
    // console.log("neither edit nor delete");
  }
}

function doUpdate() {

  var firstName = document.getElementById("updateFirstName").value;
  var lastName = document.getElementById("updateLastName").value;
  var email = document.getElementById("updateEmail").value;
  var phone = document.getElementById("updatePhone").value;
  var contactId = listOfContacts.results[toggleindex].contactId;

  var jsonPayload = '{' +
    '"firstName" : "' + firstName + '", ' +
    '"lastName" : "' + lastName + '", ' +
    '"email" : "' + email + '", ' +
    '"phoneNumber" : "' + phone + '", ' +
    '"contactId" : "' + contactId + '"' +
    '}';

  var url = '/phpscripts/update.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse(xhr.response);

    var status = 0;

    if (status < 0) {
      updateResultFieldWithError(true, "updateResult", "Couldn't update contact.");
      return;
    }

    updateResultFieldWithError(false, "updateResult", "Update successful.");

  }

  catch (err) {
    updateResultFieldWithError(true, "updateResult", err.message);
  }
}

function doDelete(contactId) {

  var jsonPayload = '{' +
    '"contactId" : "' + contactId + '"' +
    '}';

  var url = '/phpscripts/delete.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse(xhr.response);

    var status = 0;

    if (status < 0) {
      updateResultFieldWithError(true, "updateResult", "Couldn't delete contact.");
      return;
    }

    updateResultFieldWithError(false, "updateResult", "Delete successful.");

  }

  catch (err) {
    updateResultFieldWithError(true, "updateResult", err.message);
  }
}

function updateResultFieldWithError(isError, elementID, message) {
  if (isError == true) {
    document.getElementById(elementID).setAttribute("class", "errorMessage");
  }
}

function doDelete(contactId) {
  var jsonPayload = "{" + '"contactId" : "' + contactId + '"' + "}";

  var url = "/phpscripts/delete." + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.send(jsonPayload);

    var jsonObject = JSON.parse(xhr.response);

    var status = 0;

    if (status < 0) {
      updateResultFieldWithError(
        true,
        "updateResult" + contactId,
        "Couldn't delete contact."
      );
      return;
    }

    updateResultFieldWithError(
      false,
      "updateResult" + contactId,
      "Delete successful."
    );
  } catch (err) {
    updateResultFieldWithError(true, "updateResult", err.message);
  }
}

function updateResultFieldWithError(isError, elementID, message) {
  if (isError == true) {
    document.getElementById(elementID).setAttribute("class", "errorMessage");
  } else {
    document.getElementById(elementID).classList.remove("errorMessage");
  }
  document.getElementById(elementID).innerHTML = message;
  return;
}

function saveCookie() {
  var minutes = 20;
  var date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ", lastName=" +
    lastName +
    ", userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function deleteCookie() {
  document.cookie = ";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function readCookie() {

  function readCookie() {
    userId = -1;

    var data = document.cookie;
    var splits = data.split(",");

    for (var i = 0; i < splits.length; i++) {
      var current = splits[i].trim();
      var tokens = current.split("=");
      if (tokens[0] == "firstName") {
        userFirstName = tokens[1];
      }
      if (tokens[0] == "lastName") {
        lastName = tokens[1];
      }
      if (tokens[0] == "userId") {
        userId = tokens[1];
      }
    }

    if (userId < 0) {
      goHome(0);
    } else {
    }
  }

  function goHome() {
    setTimeout(function () { window.location.href = "index.html"; }, 5000);
  }

  function goHome(time) {
    setTimeout(function () { window.location.href = "index.html"; }, time);
  }

  function goContacts() {
    setTimeout(function () { window.location.href = "contacts.html"; }, 0000);
  }

  particlesJS(
    "particles-js",

    {
      particles: {
        number: {
          value: 227,
          density: {
            enable: true,
            value_area: 1025.8919341219544,
          },
        },
        color: {
          value: "#d6cf47",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#d6cf47",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 126.26362266116361,
          color: "#d6cf47",
          opacity: 0.31565905665290905,
          width: 1.736124811591,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: false,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 131.86813186813188,
            line_linked: {
              opacity: 0.5828496490759407,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    }
  );

  function goSignIns() {
    setTimeout(function () {
      window.location.href = "signin.html";
    }, 0000);
  }

  function goSignUp() {
    setTimeout(function () {
      window.location.href = "signup.html";
    }, 0000);
  }

  function goForgetPassword() {
    setTimeout(function () {
      window.location.href = "forgotPassword.html";
    }, 0000);
  }

  function goContacts() {
    setTimeout(function () { window.location.href = "contacts.html"; }, 0000);
  }

  function goSignIns() {
    setTimeout(function () { window.location.href = "signin.html"; }, 0000);
  }

  function goSignUp() {
    setTimeout(function () { window.location.href = "signup.html"; }, 0000);
  }

  function goForgetPassword() {
    setTimeout(function () { window.location.href = "forgotPassword.html"; }, 0000);
  }
