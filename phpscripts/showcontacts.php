<?php
	// source from professor Leinker
	$inData = getRequestInfo();

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
		// create query for sql
    $sql = "SELECT contact_id, first_name, last_name, email, phone_number FROM list_of_contacts";
    
    // $sql = "SELECT contact_id, first_name, last_name, email, phone_number FROM list_of_contacts WHERE user_id = $userId";

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