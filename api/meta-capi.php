<?php
/* =============================================================
   Colombo Court Hotel & Spa  ·  Meta Conversions API relay
   -------------------------------------------------------------
   The browser pixel and this relay report the same action with the
   same event ID. Meta counts it once, but still receives it when an
   ad blocker or a browser's tracking protection stops the pixel, which
   is what keeps campaign reporting and optimisation honest.

   main.js calls this only after the visitor has accepted cookies, and
   only with the named events listed below. It forwards the event, the
   page it happened on, the browser's _fbp and _fbc identifiers, the IP
   address and the browser type. It never receives or sends a name,
   email address or phone number.

   SETTINGS
   The Meta access token must never sit inside public_html. In
   Hostinger's File Manager, create a folder called  cch-private  NEXT
   TO public_html (not inside it). Copy api/meta-capi-config.sample.php
   into it, rename the copy  meta-capi-config.php  and fill it in.
   A settings file inside /api/ is used only as a fallback, and
   .htaccess refuses it to visitors.

   CHECKING IT WORKS
   Put the TEST code from Events Manager > Test events into the
   settings file, accept cookies on the site, click WhatsApp or Book
   now, and the events appear in Test events marked "Server". Empty
   the test code again afterwards.
   ============================================================= */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
ignore_user_abort(true);

function cch_done($code, $body = null)
{
    http_response_code($code);
    if ($body !== null) {
        echo json_encode($body);
    }
    exit;
}

function cch_cut($value, $length)
{
    $value = (string) $value;
    return function_exists('mb_substr') ? mb_substr($value, 0, $length, 'UTF-8') : substr($value, 0, $length);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    cch_done(405, array('error' => 'POST only'));
}

/* ---- settings ------------------------------------------------ */
$cfg = null;
$paths = array(
    dirname(__DIR__, 2) . '/cch-private/meta-capi-config.php',
    __DIR__ . '/meta-capi-config.php',
);
foreach ($paths as $path) {
    if (@is_file($path)) {
        $cfg = require $path;
        break;
    }
}
if (!is_array($cfg) || empty($cfg['pixel_id']) || empty($cfg['access_token'])) {
    cch_done(503, array('error' => 'not configured'));
}

/* ---- only this website may call it --------------------------- */
$allowed = array('www.colombocourthotel.com', 'colombocourthotel.com');
if (isset($cfg['allowed_hosts']) && is_array($cfg['allowed_hosts'])) {
    $allowed = array_map('strtolower', $cfg['allowed_hosts']);
}
$from = (string) ($_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? ''));
$fromHost = strtolower((string) parse_url($from, PHP_URL_HOST));
if (!in_array($fromHost, $allowed, true)) {
    cch_done(403, array('error' => 'origin'));
}

/* ---- a ceiling per visitor, so it cannot be used to flood Meta - */
$bucket = rtrim(sys_get_temp_dir(), '/\\') . '/cch-capi-' . md5((string) ($_SERVER['REMOTE_ADDR'] ?? '')) . '-' . intdiv(time(), 60);
$count = @is_file($bucket) ? (int) @file_get_contents($bucket) : 0;
if ($count >= 120) {
    cch_done(429, array('error' => 'too many'));
}
@file_put_contents($bucket, (string) ($count + 1), LOCK_EX);

/* ---- the event ----------------------------------------------- */
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 8192) {
    cch_done(413, array('error' => 'size'));
}
$raw = file_get_contents('php://input');
$in = json_decode((string) $raw, true);
if (!is_array($in)) {
    cch_done(400, array('error' => 'json'));
}
if (($in['consent'] ?? '') !== 'all') {
    cch_done(204);
}

$names = array('PageView', 'ViewContent', 'Contact', 'Lead', 'InitiateCheckout', 'CompleteRegistration', 'FindLocation', 'OfferClick', 'VideoOpen');
$name = (string) ($in['event_name'] ?? '');
if (!in_array($name, $names, true)) {
    cch_done(400, array('error' => 'event'));
}

$eventId = substr((string) preg_replace('/[^A-Za-z0-9._-]/', '', (string) ($in['event_id'] ?? '')), 0, 64);

$url = (string) ($in['event_source_url'] ?? '');
if (!in_array(strtolower((string) parse_url($url, PHP_URL_HOST)), $allowed, true)) {
    $url = 'https://www.colombocourthotel.com/';
}
$url = cch_cut($url, 1000);

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $parts = explode(',', (string) $_SERVER['HTTP_X_FORWARDED_FOR']);
    $first = trim($parts[0]);
    if (filter_var($first, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        $ip = $first;
    }
}

$user = array(
    'client_ip_address' => $ip,
    'client_user_agent' => cch_cut($_SERVER['HTTP_USER_AGENT'] ?? '', 500),
);
foreach (array('fbp', 'fbc') as $key) {
    $value = (string) ($in[$key] ?? '');
    if ($value !== '' && preg_match('/^fb\.[0-9]\.[0-9]{10,16}\.[A-Za-z0-9_.\-]{1,500}$/', $value)) {
        $user[$key] = $value;
    }
}

$custom = array();
if (isset($in['custom_data']) && is_array($in['custom_data'])) {
    foreach (array('placement', 'room', 'offer', 'form', 'menu', 'film', 'method', 'content_type', 'content_name') as $key) {
        if (isset($in['custom_data'][$key]) && is_scalar($in['custom_data'][$key])) {
            $custom[$key] = cch_cut($in['custom_data'][$key], 100);
        }
    }
}

$event = array(
    'event_name' => $name,
    'event_time' => time(),
    'action_source' => 'website',
    'event_source_url' => $url,
    'user_data' => $user,
);
if ($eventId !== '') {
    $event['event_id'] = $eventId;
}
if (count($custom) > 0) {
    $event['custom_data'] = $custom;
}

$payload = array('data' => array($event));
if (!empty($cfg['test_event_code'])) {
    $payload['test_event_code'] = (string) $cfg['test_event_code'];
}

/* ---- off to Meta --------------------------------------------- */
$version = 'v23.0';
if (isset($cfg['graph_version']) && preg_match('/^v[0-9]+\.[0-9]+$/', (string) $cfg['graph_version'])) {
    $version = (string) $cfg['graph_version'];
}
$endpoint = 'https://graph.facebook.com/' . $version . '/' . rawurlencode((string) $cfg['pixel_id'])
    . '/events?access_token=' . rawurlencode((string) $cfg['access_token']);
$body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);

$status = 0;
$reply = '';
if (function_exists('curl_init')) {
    $ch = curl_init($endpoint);
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT => 6,
    ));
    $reply = (string) curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
} else {
    $context = stream_context_create(array('http' => array(
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $body,
        'timeout' => 6,
        'ignore_errors' => true,
    )));
    $reply = (string) @file_get_contents($endpoint, false, $context);
    if (isset($http_response_header[0]) && preg_match('/\s([0-9]{3})\s/', $http_response_header[0], $m)) {
        $status = (int) $m[1];
    }
}

if (!empty($cfg['debug'])) {
    cch_done($status >= 200 && $status < 300 ? 200 : 502, array('meta_status' => $status, 'meta_reply' => json_decode($reply, true)));
}
cch_done($status >= 200 && $status < 300 ? 204 : 502);
