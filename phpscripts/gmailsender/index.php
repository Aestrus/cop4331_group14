<?php
  require_once('PHPMailer/PHPMailerAutoload.php');

  $mail = new PHPMailer();
  $mail->isSMTP();
  $mail->SMTPAuth = true;
  $mail->SMTPSecure = 'ssl';
  $mail->Host = 'smtp.gmail.com';
  $mail->Port = '465';
  $mail->isHTML();
  $mail->Username = 'contactermanager@gmail.com';
  $mail->Password = 'qacct503';
  $mail->SetFrom('no-reply@ec2-3-17-188-192.us-east-2.compute.amazonaws.com/');
  $mail->Subject = 'Password Recovery';
  $mail->Body = 'Here is the link to reset your password: ';
  $mail->AddAddress('lucagglbnc@gmail.com');

  $mail->Send();
?>
