<?php

  // connect to database
  $connection_reference = mysqli_connect("localhost", "George", "test1234", "contact_manager");

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


<p>Search a Contact</p>
<form class="" action="index.php" method="post">
  <input type="text" name="whatToSearch" value="">
  <input type="submit" name="search" value="search">
</form>

<?php if (isSet($_POST['search'])){?>
<p>Searched List</p>
<ul>
  <?php foreach($contacts as $contact) { ?>
    <li>
      <form class="" action="index.php" method="POST">
        <label>First name</label>
        <input type="text" name="firstName" value="<?php echo $contact['first_name'] ?>">
        <label>Last name</label>
        <input type="text" name="lastName" value="<?php echo $contact['last_name'] ?>">
        <label>Email</label>
        <input type="text" name="email" value="<?php echo $contact['email'] ?>">
        <label>Phone Number</label>
        <input type="text" name="phoneNumber" value="<?php echo $contact['phone_number'] ?>">
        <input type="submit" name="update" value="update">
        <input type="submit" name="delete" value= "delete">
        <input type="reset">
        <input type="hidden" name="contact_id" value="<?php echo $contact['contact_id'] ?> ">
      </form>
    </li>
  <?php } ?>
</ul>
<?php } ?>



<p>Filter By</p>
<form class="" action="index.php" method="POST">
  <input type="submit" name="searchType" value="created_at">
  <input type="submit" name="searchType" value="first_name">
  <input type="submit" name="searchType" value="last_name">
  <input type="submit" name="searchType" value="email">
  <input type="submit" name="searchType" value="phone_number">
</form>
