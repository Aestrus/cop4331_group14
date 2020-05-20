<?php
    //source from Leiniker
    $inData = getRequestInfo();

    $email = $inData["email"];
    $password = $inData["password"];

    //connecting to the database
    $conn = new mysqli("localhost", "test", "testing123", "contact_manager");

    // check connection
    if ($conn->connection_error)
    {
        returnWithError( $conn->connection_error );
    }
    else
    {
        // create query for sql
        $sql = "SELECT * from  list_of_users where email = '$email' and password = '$password'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            $searchResults .= $row["user_id"];
        }
        else
        {
            $searchResults .= "No Result Found";
        }

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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":' . $searchResults . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>