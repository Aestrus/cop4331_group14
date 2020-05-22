function add()
{
  console.log(document.getElementById("content").innerHTML);
  document.getElementById("content").innerHTML += "<p> added p tag </p>";
}

function cleardiv()
{
  console.log("123");
  document.getElementById("content").innerHTML = "";
}