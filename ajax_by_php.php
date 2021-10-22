<?php

$dossier_courant = dirname(__FILE__);
$keys = array_keys($_POST);
$script = $_POST['ajax_script'];
$data   = $_POST['ajax_data'];
$data   = str_replace('"', '\"', $data);
$request = "ruby " . $dossier_courant . '/ajax/scripts/' . $script . ' "' . $data . '" 2>&1';

$filename = 'ajax.log';
$filehandle = fopen($filename,'a');
fwrite($filehandle, $request . "\n");
fclose($filehandle);


$res = shell_exec($request);

echo '{"current_dir":"'.$dossier_courant.'", "keys":["'. implode('", "', $keys) . '"], "script": "'.$script.'", "resultat": ' . trim($res) . '}';
?>
