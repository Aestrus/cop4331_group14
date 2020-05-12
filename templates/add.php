<?php

  // connect to database
  $connection_reference = mysqli_connect("localhost", "George", "test1234", "contact_manager");

  // chech connection
  if (!$connection_reference)
  {
    echo "Problem connecting to the database".mysqli_connect_error();
  }

  // check if they hit the submit button
  if (isSet($_POST['add']))
  {
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $phoneNumber = $_POST['phoneNumber'];

    // create query to insert into data base
    $sql = "INSERT INTO list_of_contacts(first_name,last_name,email,phone_number) VALUES ('$firstName','$lastName','$email','$phoneNumber')";

    // save to database
    if (mysqli_query($connection_reference, $sql))
    {
      header('Location: index.php');
    }
    else {
      echo 'error inserting data into database' . mysqli_error($connection_reference);
    }
  }

  // close connection to database
  mysqli_close($connection_reference);

  // secure against attacks
  // form validation

?>




<p>Add a Contact</p>
<form class="" action="index.php" method="POST">
  <label>First name</label>
  <input type="text" name="firstName" value="">
  <label>Last name</label>
  <input type="text" name="lastName" value="">
  <label>Email</label>
  <input type="text" name="email" value="">
  <label>Phone Number</label>
  <input type="text" name="phoneNumber" value="">
  <input type="submit" name="add" value="add">
</form>
