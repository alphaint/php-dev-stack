<?php

exit;

define('DRUPAL_ROOT', getcwd());
require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

/* MEDIA */

$result = db_query("SELECT r.endpoints_entity_id AS media_id, rt.endpoints_entity_id AS node_id 
  FROM {old_relations} r
  INNER JOIN {old_relations} rt ON (rt.entity_id = r.entity_id)
  WHERE r.endpoints_entity_type = 'ai_media' AND !(r.endpoints_entity_id = rt.endpoints_entity_id AND r.endpoints_entity_type = rt.endpoints_entity_type)");

foreach ($result as $record) {
  $node = node_load($record->node_id);
  $media = ai_media_load($record->media_id);

  if ($node && $media && isset($media->title) && $media->title != '') {
    $relation = relation_create('media', array(array('entity_type' => 'ai_media', 'entity_id' => $record->media_id), array('entity_type' => 'node', 'entity_id' => $record->node_id)));
    $outcome = relation_save($relation);
  }
  else {
    $outcome = FALSE;
  }

  if ($outcome) {
    echo 'Relation created between:' . $media->title . ' (' . $record->media_id . ') and ' . $node->title . ' (' . $record->node_id . ')<br/>';
  }
  else {
    echo '<span style="color:#FF0000;">Failed to create relation between:' . $media->title . ' (' . $record->media_id . ') and ' . $node->title . ' (' . $record->node_id . ')</span><br/>';
  }
}

echo '<br/><br/><strong>Task complete</strong><br/><br/>';

/* NEWS or BLOGS */

$result = db_query("SELECT r.endpoints_entity_id AS node_one_id, rt.endpoints_entity_id AS node_two_id 
  FROM {old_relations} r
  INNER JOIN {old_relations} rt ON (rt.entity_id = r.entity_id)
  WHERE r.endpoints_entity_type = 'node' AND rt.endpoints_entity_type = 'node' AND !(r.endpoints_entity_id = rt.endpoints_entity_id AND r.endpoints_entity_type = rt.endpoints_entity_type)");

foreach ($result as $record) {
  $node_one = node_load($record->node_one_id);
  $node_two = node_load($record->node_two_id);

  if ($node_one->type == 'blog_entry') {
    $relation = relation_create('blog', array(array('entity_type' => 'node', 'entity_id' => $record->node_one_id), array('entity_type' => 'node', 'entity_id' => $record->node_two_id)));
    $outcome = relation_save($relation);
  }
  else if ($node_two->type == 'blog_entry') {
    $relation = relation_create('blog', array(array('entity_type' => 'node', 'entity_id' => $record->node_two_id), array('entity_type' => 'node', 'entity_id' => $record->node_one_id)));
    $outcome = relation_save($relation);
  }
  else if ($node_one->type == 'news') {
    $relation = relation_create('news', array(array('entity_type' => 'node', 'entity_id' => $record->node_one_id), array('entity_type' => 'node', 'entity_id' => $record->node_two_id)));
    $outcome = relation_save($relation);
  }
  else if ($node_two->type == 'news') {
    $relation = relation_create('news', array(array('entity_type' => 'node', 'entity_id' => $record->node_two_id), array('entity_type' => 'node', 'entity_id' => $record->node_one_id)));
    $outcome = relation_save($relation);
  }
  else {
    $outcome = FALSE;
  }

  if ($outcome) {
    echo 'Relation created between:' . $node_one->title . ' (' . $node_one->nid . ') and ' . $node_two->title . ' (' . $node_two->nid . ')<br/>';
  }
  else {
    echo '<span style="color:#FF0000;">Failed to create relation between:' . $node_one->title . ' (' . $node_one->nid . ') and ' . $node_two->title . ' (' . $node_two->nid . ')</span><br/>';
  }
}

echo '<br/><br/><strong>Task complete</strong><br/><br/>';

exit;