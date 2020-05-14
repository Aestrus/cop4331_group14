<?php


?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <!--Tempoaray CSS -->
    <title>Contact Manager</title>
  </head>
  <body>
    <form class="signincontainer" action="signin.php" method="POST">
      <h1>Sign In</h1>
      <label for="email"><b>Email<b/></label>
      <input type="text" name="email" placeholder="example@example.com" required>
      <label for="password">Password</label>
      <input type="password" name="password" placeholder="password" required>
      <input type="submit" name="signIn" value="Sign In">
    </form>
  </body>
</html>
