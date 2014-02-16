<?php

$conf = './conf.php';
if(!file_exists($conf))
    die('missing config file!');

include($conf);
include('./functions.php');

$content_dir = getProperty('content_dir');
$images = readConfFile($content_dir . getProperty('images'));

?>
<html>
<head>
    <title>janvt</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="content-language" content="EN">
    <meta name="description" content="janvt photography portrait outdoor concert event blog">
    <link rel="shortcut icon" href="hund.ico">
    <link rel="stylesheet" href="css.css" />
    
    <script type="text/javascript" src="js/libs/jquery-2.1.0.min.js.js"></script>
    <script type="text/javascript" src="js/libs/underscore-min.js.js"></script>
    <script type="text/javascript" src="js/libs/backbone-min.js.js"></script>
    <script type="text/javascript" src="js/libs/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="js/libs/underscore-min.js"></script>
    <script type="text/javascript" src="js/libs/backbone-min.js"></script>
    <script type="text/javascript" src="js/hund.js"></script>
</head>

<body>
    <div class="header cf">
        <h1><a href="http://janvt.com">janvt</a></h1>
        <div class="links">
            <a href="#">| CONTACT</a>
            <a href="#">| BLOG</a>
            <a href="#">EVENT</a>
            <a href="#">OUTDOOR</a>
            <a href="#">STUDIO</a>
            <a href="#">PORTRAIT</a>
        </div>
    </div>
    
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><p>test text</p></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><h2>link title</h2><p>lots more test text</p></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    
</body>
</html>
