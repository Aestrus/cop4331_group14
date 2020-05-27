<?php
	// source from professor Leinker
	$inData = getRequestInfo();

  $contactId = (int)$inData['contactId'];
  $firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
  $email = $inData["email"];
  $phoneNumber = $inData["phoneNumber"];

	// connecting to the database
	$conn = new mysqli("localhost", "test", "testing123", "contact_manager");

	// check connection
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// check for empty field 
		if (empty($firstName) && empty($lastName))
		{
		  returnWithError("First or Last Name must be filled");
		  return;
		}
		else if (empty($email) && empty($phone))
		{
		  returnWithError("Email or Phone Number must be filled");
		  return;
		}
		// create query for sql
		$sql = "UPDATE list_of_contacts SET first_name = '$firstName',last_name = '$lastName',email = '$email',phone_number = '$phoneNumber' WHERE contact_id = '$contactId'";

		// execute query and see if it goes through
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
  }
  
  returnWithError("");
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>