<?php
/* =============================================================
   Colombo Court  ·  settings for api/meta-capi.php
   -------------------------------------------------------------
   1. In Hostinger's File Manager, make a folder called  cch-private
      beside public_html (NOT inside it).
   2. Copy this file into that folder and rename it  meta-capi-config.php
   3. Fill in pixel_id and access_token below, from Meta Events Manager.

   The access token works like a password to the hotel's ad account data.
   Never paste it into main.js, a page, an email or a chat.
   ============================================================= */
return array(

    /* Events Manager > Data sources > the pixel > Settings > Pixel ID (digits only).
       The same number goes into tags.metaPixelId in assets/js/main.js. */
    'pixel_id' => '',

    /* Events Manager > Data sources > the pixel > Settings >
       Conversions API > Generate access token. */
    'access_token' => '',

    /* While checking the setup: paste the code from Events Manager > Test events.
       Empty it again afterwards, or real events are recorded as tests. */
    'test_event_code' => '',

    /* The Graph API version shown in Events Manager's code samples. */
    'graph_version' => 'v23.0',

    /* true sends Meta's reply back to the browser, for checking. Leave false. */
    'debug' => false,

    /* Only these sites may use the relay. */
    'allowed_hosts' => array('www.colombocourthotel.com', 'colombocourthotel.com'),
);
