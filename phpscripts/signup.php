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
        // look for email in database first then create user if email doesn't exist

        // create query
        $sql = "SELECT * FROM  list_of_users WHERE email = '$email'";

        // execute query
        if ( $result = $conn->query($sql) != TRUE)
        {
            returnWithError( $conn->error);
        }
        else
        {
            if ($result->num_rows > 0)
            {
                $userId .= "-1";
                $firstName .= "";
                $lastName .= "";
                $email = "";
                returnWithInfo( $userId, $firstName, $lastName, $email);
            }
        }

        // creating user after searching for email

        // create query
        $sql = "INSERT INTO list_of_users(first_name,last_name,email,password) VALUES ('$firstName','$lastName','$email','$password')";
    
        // execute query and see if it goes through
        if ( $result = $conn->query($sql) != TRUE)
        {
            returnWithError( $conn->error);
        }
        // return user information
        $sql = "SELECT * FROM list_of_users WHERE email = '$email' AND password = '$password'";
        if ( $result = $conn->query($sql) != TRUE)
        {
            returnWithError( $conn->error);
        }
        else
        {
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