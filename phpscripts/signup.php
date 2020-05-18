<?php
    // from Leinker note's
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $password = $inData["password"];
    $userId = (int)$inData["userId"];

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
        // close connection
        mysqli_close($conn);
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