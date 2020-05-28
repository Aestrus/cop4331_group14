<?php
	// source from professor Leinker
	$inData = getRequestInfo();

  $firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
  $email = $inData["email"];
  $phoneNumber = $inData["phoneNumber"];
  $userId = (int)$inData["userId"];

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
		else if (empty($email) && empty($phoneNumber))
		{
			echo $email . "\n";
			echo $phoneNumber . "\n";
			echo "123";
		  returnWithError("Email or Phone Number must be filled");
		  return;
		}

		// create query for sql
		$sql = "INSERT INTO list_of_contacts(first_name,last_name,email,phone_number,user_id) VALUES ('$firstName','$lastName','$email','$phoneNumber','$userId')";

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