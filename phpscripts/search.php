<?php

  // connect to database
  $connection_reference = mysqli_connect("localhost", "test", "testing123", "contact_manager");

  // chech connection
  if (!$connection_reference)
  {
    echo "Problem connecting to the database".mysqli_connect_error();
  }

  if (isSet($_POST['search']))
  {
    $search = $_POST['whatToSearch'];
    $sql = "SELECT contact_id, first_name, last_name, email, phone_number, user_id FROM list_of_contacts WHERE first_name LIKE '%$search%' OR last_name LIKE '%$search%' OR email LIKE '%$search%' OR phone_number LIKE '%$search%'";

    // execute query and get results
    $results = mysqli_query($connection_reference, $sql);

    // fetch the resulting rows as an array
    $contacts = mysqli_fetch_all($results, MYSQLI_ASSOC);

    // free from memory
    mysqli_free_result($results);
  }

  // close connection to database
  mysqli_close($connection_reference);
?>