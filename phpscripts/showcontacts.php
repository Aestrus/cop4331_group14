<?php
  // connect to database
  $connection_reference = mysqli_connect("localhost", "test", "testing123", "contact_manager");

  // chech connection
  if (!$connection_reference)
  {
    echo "Problem connecting to the database".mysqli_connect_error();
  }

  // write query for all contacts
  if (isSet($_POST['searchType']))
  {
    $_searchType = $_POST['searchType'];
    $sql = "Select contact_id, first_name, last_name, email, phone_number, user_id FROM list_of_contacts ORDER BY $_searchType";
  }
  else
  {
    $sql = "SELECT contact_id, first_name, last_name, email, phone_number, user_id FROM list_of_contacts"; // sort by order by later
  }

  // execute query and get results
  $results = mysqli_query($connection_reference, $sql);

  // fetch the resulting rows as an array
  $contacts = mysqli_fetch_all($results, MYSQLI_ASSOC);

  // free from memory
  mysqli_free_result($results);

  // close connection to database
  mysqli_close($connection_reference);

  // print results
  // print_r($contacts);
?>