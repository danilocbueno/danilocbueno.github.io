<?php
function curlValidatorW3C($htmlData) {
	$config['url'] = 'https://validator.w3.org/nu/?out=json';
	$config['useragent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';

	$ch = curl_init($config['url']);
	curl_setopt($ch, CURLOPT_URL,$config['url']);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: text/html; charset=utf-8'));
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_USERAGENT, $config['useragent']);
	curl_setopt($ch, CURLOPT_POSTFIELDS,$htmlData);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$data = curl_exec($ch);
	$jsonRet = json_decode($data, true);    
	curl_close($ch);
        return $jsonRet;
}

function checkErros($jsonData) {
	$error = array();
	$error['numErrors'] = 0;
	$error['numWarning'] = 0;
	$error['numInfo'] = 0;
	$error['msg'] = "";

	foreach ($jsonData["messages"] as $msg) {
		//print_r($msg);
		$tipoErro = $msg["type"];
		$ultimaLinha = $msg["lastLine"];
		$mensagem = $msg["message"];

		switch ($tipoErro) {
			case 'error':
				$error['numErrors']++;
				break;
			case 'warning':
				$error['numWarning']++;
				break;
			case 'info':
				$error['numInfo']++;
				break;						
			default:
				# code...
				break;
		}

		$error['msg'] .= "$tipoErro: $mensagem  (linha $ultimaLinha) <br>";
	}

	return $error;
}

function validateW3C($htmlData){
    $json = curlValidatorW3C($htmlData);
    return checkErros($json);
}

$validate = validateW3C("<HTMLL>");
print_r($validate);
?>
