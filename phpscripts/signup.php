<?php
    // from Leinker note's
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $password = $inData["password"];
    $userId = (int)$inData["userId"];
    $searchResults = "";

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
        $sql = "INSERT INTO list_of_users(first_name,last_name,email,password) VALUES ('$firstName','$lastName','$email','$password')";
    
        // execute query and see if it goes through
        if ( $result = $conn->query($sql) != TRUE)
        {
            returnWithError( $conn->error);
        }
        // return user_id
        $sql = "SELECT user_id from list_of_users where email = '$email' and password = '$password'";
        if ( $result = $conn->query($sql) != TRUE)
        {
            returnWithError( $conn->error);
        }
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $searchResults .= $row["user_id"];
        // close connection
        mysqli_close($conn);
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":' . $searchResults . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>