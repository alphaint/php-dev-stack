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
										from FAC.FAC_COURSES C
										where existing_user = 0  and iso_3_code = 'GBR' "
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
		db_update('FAC.FAC_COURSES')
				->fields(array(
					'existing_user' => $account->uid,
					'type' => 2,
				))
				->condition('administrator_email', $row->mail)
				->execute();  	
}


echo 'done';
exit;

function fetchMyValues($val,$query) {
  foreach($query as $row) {
  	$elements = explode(',',$row->cids);
  	foreach($elements as $element) {
    	if (strval($element)==strval($val)) {
    		echo '<br>matched!!!';
      	return $row;	
    	};
  	}
  } 
 // no match
 // echo '<h1>no match</h1>';
 // echo 'VAR:'.$val;
 // dbg($arrayIn);
 // exit;
  return array();
}

function getDenominationID($id) {
	$result = db_query("select tid 
                      from taxonomy_vocabulary v
                      inner join taxonomy_term_data td on (td.vid = v.vid)
                      where td.name = :id
                             and v.machine_name = 'denomination';", array(':id' => $id));
  foreach ($result as $row) {
    echo '<br/>get denomination:'.$id;
  	return $row->tid;
  }
  return null;
}

function getCourseID($term) {
	$tid = null;
  $result = db_query("select tid 
                      from taxonomy_vocabulary v
                      inner join taxonomy_term_data td on (td.vid = v.vid)
                      where td.name = :name
                             and v.machine_name = 'course_types';", array(':name' => $term));
  foreach ($result as $row) {
    $tid = $row->tid;
  }
  if ($tid===null){
  	return 1;
  } else {
   return $tid;
  }
}

function getISO2Code($iso3code) {
  $ret = null;
  $result = db_query("select iso_2_code from FAC.FAC_COUNTRIES where iso_3_code = :code ", array(':code' => $iso3code));
    foreach ($result as $record) {
    $ret = $record->iso_2_code;
    }
  echo '<br/>get isocode:'.$ret;
  return $ret;
}


// end
