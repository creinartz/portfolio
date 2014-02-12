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

}

?>