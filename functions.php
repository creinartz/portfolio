<?php

function getProperty($name)
{
    if(!isset($GLOBALS['__settings'][$name]))
    {
        throw new Exception('ERROR! missing config value: "' . $name . '"');
    }

    return $GLOBALS['__settings'][$name];
}

function readConfFile($path)
{
    if(!file_exists($path))
        throw new Exception('ERROR reading config file! ' . $path);

    $fc = file_get_contents($path);
    $lines = explode("\n", $fc);

    if(count($lines) === 0)
        throw new Exception('ERROR! empty conf file!' . $path);

    $r = array();
    foreach($lines as $line)
    {
        $r[] = str_getcsv($line);
    }

    return $r;
}

?>