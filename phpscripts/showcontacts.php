<?php
	// source from professor Leinker
	$inData = getRequestInfo();
  
  $userId = $inData["userId"];
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "test", "testing123", "contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT * from list_of_contacts where user_id = $userId";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",\n";
				}
				$searchCount++;
        $searchResults .= '{"firstName":"' . $row["first_name"] .
          '", "lastName":"' . $row["last_name"] .
          '", "email":"' . $row["email"] .
          '", "phoneNumber":"' . $row["phone_number"] .
          '", "contactId":"'. $row["contact_id"] .
          '"}' ;
			}
		}
		else
		{
			returnWithError( "No Records Found" );
		}
		$conn->close();
	}

	returnWithInfo( $searchResults );

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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>