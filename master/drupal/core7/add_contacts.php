<?php

exit;

define('DRUPAL_ROOT', getcwd());

require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

//module_load_include('module', 'ai_course_course');
//module_load_include('module', 'ai_course_instance');
//module_load_include('module', 'ai_course_org');
//module_load_include('inc', 'ai_course_org', 'ai_course_org.admin');

//module_load_include('module', 'ai_course_venue');

db_set_active('default');

print "<pre>";

// query
$count = 0;

$result = db_query("SELECT cc.ai_course_course_id, 
									      substring_index(administrator_name,' ', 1) as salutation,
									      substring_index(substring_index(administrator_name,' ', -2),' ',1) as firstname,
									      substring_index(substring_index(administrator_name,' ', -2),' ',-1) as lastname,
									      administrator_email,
									      replace(replace(replace(replace(replace(administrator_telephone, '+44(0)', '0'),'++44 (0)','0'),'+ 44 ', '0'),'+(0)','0'), '-', '') as administrator_telephone,
									      town,
									      county,
									      postcode,
									      uid
									FROM ai_course_course cc
									     inner join FAC.FAC_COURSES c on (c.cid = cc.cid)
									inner join ai_course_user cu on (cc.ai_course_course_id = cu.ai_course_course_id )
									where ai_course_admin_id = 0 "
                  );
                  
foreach($result as $row) {

			$tel = intval($row->administrator_telephone);

      //create the new org in the database
      $ai_course_admin = ai_course_admin_create(array('type' => 'administrator'));
      $ai_course_admin->name = $row->firstname.' '.$row->lastname;
      $ai_course_admin->created = REQUEST_TIME;
      $ai_course_admin->save();
      $contactID = $ai_course_admin->ai_course_admin_id;
      //reload the array so we can update the entity.
      $contactNew = ai_course_admin_load($contactID);
      //update the array values with the correct
      $contactNew->field_address['und'][0]['country'] = 'GB';
      $contactNew->field_address['und'][0]['administrative_area'] = $row->county;
      $contactNew->field_address['und'][0]['locality'] = $row->town;
      $contactNew->field_address['und'][0]['postal_code'] = $row->postcode;    
      $contactNew->field_phone['und'][0]['number'] = $tel;
      $contactNew->field_phone['und'][0]['country_codes'] = 'GB';
      $contactNew->field_email['und'][0]['email'] = $row->administrator_email;
      $contactNew->field_firstname['und'][0]['value'] = $row->firstname;
      $contactNew->field_surname['und'][0]['value'] = $row->lastname;
      $contactNew->field_salutation['und'][0]['value'] = $row->salutation;
      //save it...
      $contactNew->save();
      //insert the contact user entry
      $insert = db_insert('ai_course_admin_user')
              ->fields(array(
                'ai_course_admin_id' => $contactID,
                'uid' => $row->uid,
                'created' => REQUEST_TIME,
              ))
              ->execute();
              
      $update = db_update('ai_course_course') 
      		->fields(array(
      				'ai_course_admin_id' => $contactID,
      		))
      		->condition('cu.ai_course_course_id', $row->ai_course_course_id)
      		->execute();
              
       
      echo '<br>add contact:'.$row->administrator_email.' name:'.$row->lastname;
      
}
       

echo '<br>done';
exit;


function fetchMyValues($val,$arrayIn) {
  
  foreach($arrayIn as $row) {
    if (strpos($row->cids, strval($val))===null) {
      // no match
      //echo '<h1>no match</h1>';
      //echo 'VAR:'.$val;
      //dbg($arrayIn);
      //exit;
      return array();
    } else {
    	echo '<br/>fetch:'.$val;
      return $row;
    };
  }
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
