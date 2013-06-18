<?php

exit;

define('DRUPAL_ROOT', getcwd());
require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

/* TRANSLATE MEDIA */

//variable_set('acs_media_move_upto', 0);

$result = db_query("SELECT r.endpoints_entity_id AS media_id, GROUP_CONCAT(rt.endpoints_entity_id) AS node_ids
  FROM {field_data_endpoints} r
  INNER JOIN {field_data_endpoints} rt ON (rt.entity_id = r.entity_id)
  WHERE r.endpoints_entity_type = 'ai_media' AND !(r.endpoints_entity_id = rt.endpoints_entity_id AND r.endpoints_entity_type = rt.endpoints_entity_type) AND r.endpoints_entity_id > :lastnid GROUP BY r.endpoints_entity_id ORDER BY r.endpoints_entity_id ASC
  LIMIT 0,100", array(':lastnid' => variable_get('acs_media_move_upto', 0)));

foreach ($result as $record) {
  $media = ai_media_load($record->media_id);

  // Load media from ACS
  $url = 'http://acs.alpha.org/media/' . $media->s3id;
  $media_node = _htb_media_copy_create('http://acs.alpha.org/media/' . $media->s3id);
  
  if ($media_node == FALSE) continue;
  
  $nodes = explode(',', $record->node_ids);
  foreach ($nodes as $node_id) {
    $node = node_load($node_id);
    if ($node && $media_node && isset($media_node->title) && $media_node->title != '') {
      $relation = relation_create('media', array(array('entity_type' => 'node', 'entity_id' => $media_node->nid), array('entity_type' => 'node', 'entity_id' => $node->nid)));
      $outcome = relation_save($relation);
    }
    else {
      $outcome = FALSE;
    }
    
    if ($outcome) {
      echo '<strong>'.$record->media_id.'</strong> Relation created between: ' . $media_node->title . ' (' . $media_node->nid . ') and ' . $node->title . ' (' . $node->nid . ')<br/>';
    }
    else {
      echo '<span style="color:#FF0000;">Failed to create relation between: ' . $media_node->title . ' (' . $media_node->nid . ') and ' . $node->title . ' (' . $node->nid . ')</span><br/>';
    }
  }
  
  variable_set('acs_media_move_upto', $record->media_id);
}

echo '<br/><br/><strong>Task complete</strong><br/><br/>';