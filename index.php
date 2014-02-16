<?php

$conf = './conf.php';
if(!file_exists($conf))
    die('missing config file!');

include($conf);
include('./functions.php');

$contentDir = getProperty('contentDir');

$images = readConfFile($contentDir . getProperty('imagesData'));
$imagesJSON = array();
$imageBaseUrl = getProperty('imageBaseUrl');
$imageThumbBaseUrl = getProperty('imageThumbBaseUrl');
foreach($images as $image)
{
    $imagesJSON[] = array(
        'url' => $imageBaseUrl . $image[0],
        'thumbUrl' => $imageThumbBaseUrl . $image[1],
        'category' => $image[2],
        'title' => $image[3],
        'description' => $image[4]
    );
}

$articles = readConfFile($contentDir . getProperty('articlesData'));
$articlesJSON = array();
foreach($articles as $article)
{
    $articlesJSON[] = array(
        'title' => $article[0],
        'text' => $article[1],
    );
}

$data = array(
    'images' => $imagesJSON,
    'articles' => $articlesJSON
);

?>
<html>
<head>
    <title>janvt</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="content-language" content="EN">
    <meta name="description" content="janvt photography portrait outdoor concert event blog">
    <link rel="shortcut icon" href="hund.ico">
    <link rel="stylesheet" href="css.css" />
    
    <script type="text/javascript" src="js/libs/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="js/libs/underscore-min.js"></script>
    <script type="text/javascript" src="js/libs/backbone-min.js"></script>
    <script type="text/javascript" src="js/hund.js"></script>
</head>

<body>
    <div class="header cf">
        <h1><a href="http://janvt.com" id="janvt">janvt</a></h1>
        <div id="links">
            <a href="#" class="contact" data-state="contact">| CONTACT</a>
            <a href="#" class="blog" data-state="blog">| BLOG</a>
            <a href="#" class="event" data-state="event">EVENT</a>
            <a href="#" class="outdoor" data-state="outdoor">OUTDOOR</a>
            <a href="#" class="studio" data-state="studio">STUDIO</a>
            <a href="#" class="portrait" data-state="portrait">PORTRAIT</a>
        </div>
    </div>
    
    <div id="content"></div>
    <!--a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><p>test text</p></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a>
    <a class="tile" href="#"><div><h2>link title</h2><p>lots more test text</p></div></a>
    <a class="tile" href="#"><div><img src="http://farm3.staticflickr.com/2827/12048337836_10dd9c39bd.jpg" /></div></a-->
        
    <script type="text/javascript">var lovelyData = <?php print json_encode($data); ?>;</script>
    
</body>
</html>
