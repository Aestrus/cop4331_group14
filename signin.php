<?php


?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="main.css"></link>
    <title>Contact Manager</title>
  </head>
  <body>
    <form class="signincontainer" action="signin.php" method="POST">
      <h1>Sign In</h1>
      <label for="email"><b>Email<b/></label>
      <input type="text" name="email" placeholder="example@example.com" required>
      <label for="password">Password</label>
      <input type="password" name="password" placeholder="password" required>
      <button type="submit">Sign in</button>
    </form>
  </body>
</html>
