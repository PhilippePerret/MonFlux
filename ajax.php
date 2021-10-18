<?php

// $code = $_POST['data'];
// $code = $_REQUEST['code'];
// $keys = array_keys($_POST);
$keys = array_keys($_REQUEST);
// $code = "bonjour";
// $res = shell_exec($code);


echo '{"ok":"' . implode(', ', $keys) . '"}';
// echo '{"ok":true}';
?>
