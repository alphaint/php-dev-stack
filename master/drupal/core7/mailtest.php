<?php


		$to = "ian@chatteris.org";
        $subject = "Test mail";
        $message = "Hello! This is a simple email message.";
        $from = "webmaster@alpha.org";
        $headers = "From:" . $from;
        mail($to,$subject,$message,$headers,"-f webmaster@alpha.org");
        echo "Mail Sent.";
        echo " ";

?>
