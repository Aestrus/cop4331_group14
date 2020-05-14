<?php

// connect to database
$connection_reference = mysqli_connect("localhost", "test", "testing123", "contact_manager");

// chech connection
if (!$connection_reference)
{
  echo "Problem connecting to the database".mysqli_connect_error();
}

// check if they hit the delete button
if (isSet($_POST['delete']))
{
  echo "deleteing contact with contact_id ".$_POST['contact_id'];
  $contact_id = $_POST['contact_id'];

  // make query to delete contact
  $sql = "DELETE FROM list_of_contacts WHERE contact_id = $contact_id";

  // execute query to delete
  if (mysqli_query($connection_reference,$sql))
  {
    header("Location: index.php");
  }
  else
  {
    echo "failed to delete id from database".mysqli_error($connection_reference);
  }
}

// close connection to database
mysqli_close($connection_reference);

?>
