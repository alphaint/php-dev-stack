<?php

exit;

define('DRUPAL_ROOT', getcwd());

require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

db_set_active('default');

print "<pre>";

// query
$count = 0;

$result = db_query("select distinct administrator_email as mail, password
										from FAC.FAC_LATIN_COURSES C
										where existing_user = 0 and type = 2 "
                  );

$newUser = new stdClass();                  
                  
foreach($result as $row) {

  	$newUser = array(
  			'name' => $row->mail,
  			'pass' => $row->password,
  			'mail' => $row->mail,
  			'status' => 1,
  	);
  	//create the user
  	$account = user_save(null, $newUser);
  	//update courses
  	echo $row->mail.':'.$account->uid.':'.$row->password.'<br/>';
		//upate courses
		db_update('FAC.FAC_LATIN_COURSES')
				->fields(array(
					'existing_user' => $account->uid,
					'type' => 2,
				))
				->condition('administrator_email', $row->mail)
				->execute();  	
}


echo 'done';
exit;




// end
