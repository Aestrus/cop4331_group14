<?php
	// source from professor Leinker
	$inData = getRequestInfo();

  $contact_id = (int)$inData['contactId'];

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
		$sql = "DELETE FROM list_of_contacts WHERE contact_id = $contact_id";

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