<?php

$conf = './conf.php';
if(!file_exists($conf))
    die('missing config file!');

include($conf);
include('./functions.php');

// jvt: check & parse url
$url = (isset($_REQUEST['url']) ? $_REQUEST['url'] : '');
$state = 'overview';
if(in_array($url, array('portrait', 'studio', 'outdoor', 'event', 'blog', 'contact')))
{
    $state = $url;
    $url = '';
}

// jvt: get content
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
$articlesHtmlDir = $contentDir . getProperty('articlesHtmlDir');
$articlesJSON = array();
$blogHtmlFile = '';
foreach($articles as $article)
{
    if($url === $article[0])
    {
        $blogHtmlFile = $articlesHtmlDir . $article[3];
    }

    $articlesJSON[] = array(
        'url' => $article[0],
        'title' => $article[1],
        'text' => $article[2],
        'htmlSrc' => $articlesHtmlDir . $article[3]
    );
}

if(!empty($url) && !empty($blogHtmlFile) && file_exists($blogHtmlFile)) // jvt: check for valid blog content
{
    $state = 'blog';
}

$contentClasses = $state;
if(!empty($blogHtmlFile))
{
    $contentClasses .= ' article';
}

$data = array(
    'state' => $state,
    'url' => $url,
    'images' => $imagesJSON,
    'articles' => $articlesJSON,

    'contactHtml' => file_get_contents(getProperty('contactContentURL'))
);

?>
<html>
<head>
    <title>janvt</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="content-language" content="EN">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="janvt photography portrait outdoor concert event blog">
    <link rel="shortcut icon" href="hund.ico">
    <link rel="stylesheet" href="css.css" />
    
    <script type="text/javascript" src="js/libs/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="js/libs/underscore-min.js"></script>
    <script type="text/javascript" src="js/libs/backbone-min.js"></script>
    <script type="text/javascript" src="js/libs/jquery.lightbox_me.js"></script>
    <script type="text/javascript" src="js/hund.js"></script>
</head>

<body>
    <a href="#top"></a>
    <div class="header cf">
        <h1><a href="http://janvt.com" id="janvt">jan vt</a></h1>
        <div id="links">
            <a href="#" class="contact" data-state="contact">| CONTACT</a>
            <a href="#" class="blog" data-state="blog">| BLOG</a>
            <a href="#" class="event" data-state="event">EVENT</a>
            <a href="#" class="outdoor" data-state="outdoor">OUTDOOR</a>
            <a href="#" class="studio" data-state="studio">STUDIO</a>
            <a href="#" class="portrait" data-state="portrait">PORTRAIT</a>
        </div>
    </div>
    
    <div id="content" class="<?php print $contentClasses; ?>">
        <?php
            // jvt: render indexable shit for SE-fuckin-O OPTIMI-fuckin-ZATION, motherfucker!
            switch($state)
            {
                case 'contact':
                    print $data['contactHtml'];
                    break;

                case 'blog':
                    if(!empty($blogHtmlFile))
                        print file_get_contents($blogHtmlFile);

                    break;
            }
        ?>
    </div>
        
    <script type="text/javascript">var lovelyData = <?php print json_encode($data); ?>;</script>
    
</body>
</html>
