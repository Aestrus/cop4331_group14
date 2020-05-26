<?php
	// source from professor Leinker
	$inData = getRequestInfo();
  
  $search = $inData["search"];
	$userId = $inData["userId"];
	$filter = $inData["filter"];
	$searchResults = "";
	$searchCount = 0;

	// connect to database
	$conn = new mysqli("localhost", "test", "testing123", "contact_manager");

	// check for error
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// create query
		$sql = "SELECT contact_id, first_name, last_name, email, phone_number FROM list_of_contacts WHERE (first_name LIKE '%$search%' OR last_name LIKE '%$search%' OR email LIKE '%$search%' OR phone_number LIKE '%$search%') AND user_id = $userId ORDER BY $filter";

		// execute query and see if it goes through
		$result = $conn->query($sql);

		// return user information
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",\n";
				}
				$searchCount++;
				$searchResults .= '{"firstName":"' . $row["first_name"] . '","lastName":"' . $row["last_name"] . '","email":"' . $row["email"] . '","phoneNumber":"' . $row["phone_number"] . '","contactId":"'. $row["contact_id"].'"}' ;
			}
			returnWithInfo( $searchResults );
		}
		else
		{
			returnWithError( "No Records Found" );
		}
		$conn->close();
	}

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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>