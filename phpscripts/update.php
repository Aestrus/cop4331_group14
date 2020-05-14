
<?php

// connect to database
$connection_reference = mysqli_connect("localhost", "test", "testing123", "contact_manager");

// chech connection
if (!$connection_reference)
{
  echo "Problem connecting to the database".mysqli_connect_error();
}

// check if they hit the update button
if (isSet($_POST['update']))
{
  echo "updating contact with contact_id ".$_POST['contact_id'];
  $firstName = $_POST['firstName'];
  $lastName = $_POST['lastName'];
  $email = $_POST['email'];
  $phoneNumber = $_POST['phoneNumber'];
  $contactId = $_POST['contact_id'];

  // create query to insert into data base
  $sql = "UPDATE list_of_contacts SET first_name = '$firstName',last_name = '$lastName',email = '$email',phone_number = '$phoneNumber' WHERE contact_id = '$contactId'";

  // execute query and update
  if (mysqli_query($connection_reference, $sql))
  {
    header('Location: index.php');
  }
  else {
    echo 'error updating data in database' . mysqli_error($connection_reference);
  }


  // print_r($_POST);
}

// close connection to database
mysqli_close($connection_reference);

?>

