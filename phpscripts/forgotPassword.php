<?php
    // from Leinker note's
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $password = $inData["password"];
    // hash password
    $password = hash("sha256",$password);
    // connect to database
    $conn = new mysqli("localhost", "test", "testing123", "contact_manager");

    // check for error
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
    } 
    else
    {
        if (empty($email))
        {
            returnWithError("Email must be filled.");
            return;
        }
        else if (empty($password))
        {
            returnWithError("Password must be filled.");
            return;
        }
        else if (empty($firstName) || empty($lastName))
        {
            returnWithError("First and Last name must be filled.");
            return;
        }
        // create query for SQL
        $sql = "SELECT * FROM  list_of_users WHERE first_name = '$firstName' AND last_name = '$lastName' AND email = '$email'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0)
        {
            // found user, update password
            // create query for sql
            $sql = "UPDATE list_of_users SET password = '$password' WHERE email = '$email'";

            // execute query and see if it goes through
            if( $result = $conn->query($sql) != TRUE )
            {
                returnWithError( $conn->error );
            }
            $conn->close();
            returnwithResult("Success");
        }
        else
        {
            // user not found, return error
            returnWithError("User not found.");
            return;
        }
        mysqli_close($conn);
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
    function returnWithResult( $result )
    {
        $retValue = '{"result":"' . $result . '"}';
		sendResultInfoAsJson( $retValue );
    }

	function returnWithInfo( $userId, $firstName, $lastName, $email)
	{
        $retValue = '{' .
      '"userId":' . $userId . ',' .
      '"firstName":"' . $firstName . '",' .
      '"lastName":"' . $lastName . '",' .
      '"email":"' . $email . '",' .
      '"error":""' .
      '}';
		sendResultInfoAsJson( $retValue );
	}
?>