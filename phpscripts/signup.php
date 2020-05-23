<?php
    // from Leinker note's
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $password = $inData["password"];

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
        // return user information
        $sql = "SELECT * from list_of_users where email = '$email' and password = '$password'";
        if ( $result = $conn->query($sql) != TRUE)
        {
            returnWithError( $conn->error);
        }
        else
        {
            // create query for sql
            $sql = "SELECT * from  list_of_users where email = '$email' and password = '$password'";
            $result = $conn->query($sql);
            if ($result->num_rows > 0)
            {
                $row = $result->fetch_assoc();
                $userId .= $row["user_id"];
                $firstName .= $row["first_name"];
                $lastName .= $row["last_name"];
            }
            else
            {
                $userId .= "-1";
                $firstName .= "";
                $lastName .= "";
                $email = "";
            }
    
        }
        // close connection
        mysqli_close($conn);
    }    
    
    returnWithInfo( $userId, $firstName, $lastName, $email);

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