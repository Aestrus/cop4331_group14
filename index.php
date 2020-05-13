<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <!--Tempoaray CSS -->
    <title>Contact Manager</title>
  </head>
  <body style="color: blue;">
    <p>Hello User</p>
    <button type="button" name="logOut" onclick= "location.href = 'signin.php'" >Log Out</button>
    <?php include("templates/update.php") ?>
    <?php include("templates/delete.php") ?>
    <?php include("templates/add.php") ?>
    <?php include("templates/search.php") ?>
    <?php include("templates/show.php") ?>
  </body>
</html>
