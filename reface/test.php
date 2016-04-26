<?php

$urls = ['http://balancer.voximplant.com/getNearestHost', 'http://balancer2.voximplant.com/getNearestHost'];

$res = [];

for($i = 0; $i < 20; $i++) {
	foreach($urls as $url) {
//		sleep(0.5);
		$parse = explode(';', file_get_contents($url));
		foreach ($parse as $item) {
			$res[$item]++;
		}
	}
}

var_dump($res);die;