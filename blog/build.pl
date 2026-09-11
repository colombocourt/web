#!/usr/bin/perl
# ============================================================
#  THE JOURNAL BUILDER
#
#  One source file, blog/_src/posts.txt, becomes:
#
#    blog/index.html          the listing, with every entry in it as
#                             ordinary crawlable markup
#    blog/<slug>/index.html   one real page per entry, which is what
#                             makes an entry linkable and indexable
#    blog/feed.xml            RSS, for anyone who syndicates us
#    sitemap.xml              the blog block, rewritten in place
#
#  Run it from the project root:   perl blog/build.pl
#
#  The chrome comes out of blog/_tpl/_chrome-*.html, which were taken
#  from a real page, so the header and footer here cannot drift from
#  the rest of the site. If you change the site header, re-extract them.
# ============================================================
use strict;
use warnings;
use POSIX qw(strftime mktime);

my $ROOT = '.';
$ROOT = '..' if -d '../blog' && !-d './blog';
my $SITE = 'https://www.colombocourthotel.com';

# ---- read the templates -------------------------------------------------
sub slurp {
  my $p = shift;
  open(my $h, '<:encoding(UTF-8)', $p) or die "cannot read $p: $!\n";
  local $/; my $s = <$h>; close $h; return $s;
}
sub spew {
  my ($p, $s) = @_;
  my ($dir) = $p =~ m{^(.*)/[^/]+$};
  if ($dir && !-d $dir) { mkdir $dir or die "cannot make $dir: $!\n" }
  open(my $h, '>:encoding(UTF-8)', $p) or die "cannot write $p: $!\n";
  print $h $s; close $h;
}

my $TPL_ART   = slurp("$ROOT/blog/_tpl/article.html");
my $TPL_IDX   = slurp("$ROOT/blog/_tpl/index.html");
my $CHROME_H  = slurp("$ROOT/blog/_tpl/_chrome-head.html");
my $CHROME_F  = slurp("$ROOT/blog/_tpl/_chrome-foot.html");
my $SRC       = slurp("$ROOT/blog/_src/posts.txt");

# ---- parse the source ---------------------------------------------------
my @POSTS;
my @blocks = split /^=== /m, $SRC;
shift @blocks;                                  # the note at the top
for my $b (@blocks) {
  my ($slug, $rest) = $b =~ /^([a-z0-9-]+)\s*\n(.*)$/s;
  die "a block has no slug\n" unless $slug;
  my ($front, $body) = split /^---\s*$/m, $rest, 2;
  die "$slug has no --- separator\n" unless defined $body;
  my %p = (slug => $slug);
  for my $line (split /\n/, $front) {
    next unless $line =~ /^(\w+):\s*(.*)$/;
    $p{$1} = $2;
  }
  $body =~ s/^\s+|\s+$//g;
  $p{body} = $body;
  for my $k (qw(title date topic summary hero heroW heroAlt minutes)) {
    die "$slug is missing '$k'\n" unless defined $p{$k} && length $p{$k};
  }
  die "$slug has a bad date '$p{date}'\n" unless $p{date} =~ /^(\d{4})-(\d{2})-(\d{2})$/;
  my ($y, $m, $d) = ($1, $2, $3);
  $p{ym}    = "$y-$m";
  $p{stamp} = sprintf('%04d%02d%02d', $y, $m, $d);
  my @MON = qw(January February March April May June July August September October November December);
  $p{human}     = sprintf('%d %s %d', $d, $MON[$m - 1], $y);
  $p{monthName} = sprintf('%s %d', $MON[$m - 1], $y);
  $p{rfc}       = strftime('%a, %d %b %Y 09:00:00 +0530',
                    0, 0, 9, $d, $m - 1, $y - 1900);
  $p{topicHtml} = $p{topic}; $p{topicHtml} =~ s/&(?!\w+;)/&amp;/g;
  $p{topicSlug} = lc $p{topic};
  $p{topicSlug} =~ s/\s*&(amp;)?\s*/ and /g; $p{topicSlug} =~ s/[^a-z0-9]+/-/g; $p{topicSlug} =~ s/^-|-$//g;
  push @POSTS, \%p;
}
@POSTS = sort { $b->{stamp} <=> $a->{stamp} } @POSTS;      # newest first
print "  " . scalar(@POSTS) . " entries, newest " . $POSTS[0]{date} . "\n";

# a future date is treated as spam by Google, so refuse to publish one
my $today = strftime('%Y%m%d', localtime);
for my $p (@POSTS) {
  die "$p->{slug} is dated in the future ($p->{date})\n" if $p->{stamp} > $today;
}

# Every picture a post names must actually be on disk at every width the
# markup will ask for. Getting this wrong produces a page that looks fine
# to whoever wrote it and a broken image to everybody else, so it stops
# the build rather than warning about it.
for my $p (@POSTS) {
  for my $w (560, 900, $p->{heroW}) {
    my $img = "$ROOT/assets/img/$p->{hero}-$w.jpg";
    next if -f $img;
    die "$p->{slug}: the main picture is missing at $w wide\n"
      . "  looked for assets/img/$p->{hero}-$w.jpg\n"
      . "  the main picture has to be one of the -hero images, which are built at 560, 900 and 1600\n";
  }
  while ($p->{body} =~ m{assets/img/([a-z0-9-]+)-(\d+)\.jpg}g) {
    my ($name, $w) = ($1, $2);
    next if -f "$ROOT/assets/img/$name-$w.jpg";
    die "$p->{slug}: a picture inside the post is missing\n"
      . "  looked for assets/img/$name-$w.jpg\n";
  }
}
print "  every picture accounted for\n";

# ---- helpers ------------------------------------------------------------
sub esc  { my $s = shift // ''; $s =~ s/&(?!(amp|lt|gt|quot|#\d+|[a-z]+);)/&amp;/g; $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g; return $s }
sub attr { my $s = shift // ''; $s = esc($s); $s =~ s/"/&quot;/g; return $s }
sub json { my $s = shift // ''; $s =~ s/&amp;/&/g; $s =~ s/&eacute;/\x{e9}/g; $s =~ s/&rsquo;/\x{2019}/g;
           $s =~ s/&hellip;/\x{2026}/g; $s =~ s/\\/\\\\/g; $s =~ s/"/\\"/g; $s =~ s/\s+/ /g; return $s }
sub plain { my $s = shift // ''; $s =~ s/<[^>]+>//g; $s =~ s/&amp;/&/g; $s =~ s/&rsquo;/\x{2019}/g;
            $s =~ s/&eacute;/\x{e9}/g; $s =~ s/&hellip;/\x{2026}/g; $s =~ s/\s+/ /g; $s =~ s/^\s|\s$//g; return $s }

sub fill {
  my ($tpl, %v) = @_;
  $tpl =~ s/\{\{(\w+)\}\}/ defined $v{$1} ? $v{$1} : "{{$1}}" /ge;
  return $tpl;
}

# ---- one page per entry -------------------------------------------------
for my $i (0 .. $#POSTS) {
  my $p = $POSTS[$i];
  my $prev = $i > 0        ? $POSTS[$i - 1] : undef;   # newer
  my $next = $i < $#POSTS  ? $POSTS[$i + 1] : undef;   # older

  my $pn = '';
  if ($prev || $next) {
    $pn = qq{    <nav class="post__pn" aria-label="More blog posts">\n};
    $pn .= qq{      <a class="post__pn__l" href="/blog/$prev->{slug}/"><span>Newer</span><b>} . $prev->{title} . qq{</b></a>\n} if $prev;
    $pn .= qq{      <a class="post__pn__r" href="/blog/$next->{slug}/"><span>Older</span><b>} . $next->{title} . qq{</b></a>\n} if $next;
    $pn .= qq{    </nav>\n};
  }

  my $ld = <<"LD";
{
  "\@context": "https://schema.org",
  "\@graph": [
    {
      "\@type": "BlogPosting",
      "\@id": "$SITE/blog/$p->{slug}/#post",
      "mainEntityOfPage": { "\@type": "WebPage", "\@id": "$SITE/blog/$p->{slug}/" },
      "url": "$SITE/blog/$p->{slug}/",
      "headline": "@{[ json($p->{title}) ]}",
      "description": "@{[ json($p->{summary}) ]}",
      "articleSection": "@{[ json($p->{topic}) ]}",
      "datePublished": "$p->{date}",
      "dateModified": "$p->{date}",
      "inLanguage": "en-GB",
      "wordCount": @{[ scalar(split /\s+/, plain($p->{body})) ]},
      "image": {
        "\@type": "ImageObject",
        "url": "$SITE/assets/img/$p->{hero}-$p->{heroW}.jpg",
        "caption": "@{[ json($p->{heroAlt}) ]}"
      },
      "author":    { "\@type": "Organization", "name": "Colombo Court Hotel & Spa", "url": "$SITE/" },
      "publisher": { "\@id": "$SITE/#hotel" },
      "isPartOf":  { "\@id": "$SITE/blog/#blog" },
      "about":     { "\@id": "$SITE/#hotel" }
    },
    {
      "\@type": "BreadcrumbList",
      "itemListElement": [
        { "\@type": "ListItem", "position": 1, "name": "Home", "item": "$SITE/" },
        { "\@type": "ListItem", "position": 2, "name": "Blog", "item": "$SITE/blog/" },
        { "\@type": "ListItem", "position": 3, "name": "@{[ json($p->{title}) ]}", "item": "$SITE/blog/$p->{slug}/" }
      ]
    }
  ]
}
LD

  my $body = $p->{body};
  $body =~ s/\{\{A\}\}/..\/..\//g;
  $body =~ s/^/  /mg;

  my $page = fill($TPL_ART,
    A            => '../../',
    TITLE        => $p->{title},
    DESC         => attr(plain($p->{summary})),
    SUMMARY      => $p->{summary},
    SLUG         => $p->{slug},
    TOPIC        => $p->{topicHtml},
    TOPIC_SLUG   => $p->{topicSlug},
    DATE_ISO     => $p->{date},
    DATE_HUMAN   => $p->{human},
    MINUTES      => $p->{minutes},
    HERO         => $p->{hero},
    HERO_W       => $p->{heroW},
    HERO_H       => int($p->{heroW} * 9 / 16 + 0.5),
    HERO_ALT     => attr($p->{heroAlt}),
    BODY         => $body,
    PREVNEXT     => $pn,
    JSONLD       => $ld,
    CHROME_HEAD  => fill($CHROME_H, A => '../../'),
    CHROME_FOOT  => fill($CHROME_F, A => "../../", SCRIPTS => ""),
  );
  spew("$ROOT/blog/$p->{slug}/index.html", $page);
  print "  wrote blog/$p->{slug}/index.html\n";
}

# ---- the listing --------------------------------------------------------
my $cards = '';
for my $p (@POSTS) {
  $cards .= <<"CARD";
      <article class="pcard" data-topic="@{[ attr($p->{topicSlug}) ]}" data-month="$p->{ym}" data-find="@{[ attr(lc(plain($p->{title}) . ' ' . plain($p->{summary}) . ' ' . $p->{topic})) ]}">
        <a class="pcard__link" href="/blog/$p->{slug}/">
          <figure class="pcard__img">
            <img src="../assets/img/$p->{hero}-560.jpg"
                 srcset="../assets/img/$p->{hero}-560.jpg 560w, ../assets/img/$p->{hero}-900.jpg 900w"
                 sizes="(max-width: 700px) 92vw, (max-width: 1099px) 44vw, 30vw"
                 width="560" height="315" loading="lazy" decoding="async" alt="@{[ attr($p->{heroAlt}) ]}">
          </figure>
          <p class="pcard__meta"><span class="pcard__topic">$p->{topicHtml}</span> <time datetime="$p->{date}">$p->{human}</time></p>
          <h3 class="pcard__h">$p->{title}</h3>
          <p class="pcard__sum">$p->{summary}</p>
          <span class="pcard__more">Read this<span aria-hidden="true"></span></span>
        </a>
      </article>
CARD
}

my (%topics, %topicNames, %months, @monthOrder);
for my $p (@POSTS) {
  $topics{ $p->{topic} }     = $p->{topicSlug};
  $topicNames{ $p->{topic} } = $p->{topicHtml};
  push @monthOrder, $p->{ym} unless exists $months{ $p->{ym} };
  $months{ $p->{ym} } = $p->{monthName};
}
my $topicOpts = join "\n", map { '            <option value="' . attr($topics{$_}) . '">' . $topicNames{$_} . '</option>' } sort keys %topics;
my $monthOpts = join "\n", map { '            <option value="' . $_ . '">' . $months{$_} . '</option>' } @monthOrder;

my $items = join ",\n", map {
  my $p = $POSTS[$_];
  '        { "@type": "ListItem", "position": ' . ($_ + 1) . ', "url": "' . $SITE . '/blog/' . $p->{slug} . '/", "name": "' . json($p->{title}) . '" }'
} 0 .. $#POSTS;

my $idxLd = <<"LD";
{
  "\@context": "https://schema.org",
  "\@graph": [
    {
      "\@type": "Blog",
      "\@id": "$SITE/blog/#blog",
      "url": "$SITE/blog/",
      "name": "The Colombo Court blog",
      "description": "Notes on Colombo, the hotel, the spa and the two restaurants, written by the people who work here.",
      "inLanguage": "en-GB",
      "publisher": { "\@id": "$SITE/#hotel" }
    },
    {
      "\@type": "BreadcrumbList",
      "itemListElement": [
        { "\@type": "ListItem", "position": 1, "name": "Home", "item": "$SITE/" },
        { "\@type": "ListItem", "position": 2, "name": "Blog", "item": "$SITE/blog/" }
      ]
    },
    {
      "\@type": "ItemList",
      "name": "Blog posts, newest first",
      "numberOfItems": @{[ scalar @POSTS ]},
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "itemListElement": [
$items
      ]
    }
  ]
}
LD

spew("$ROOT/blog/index.html", fill($TPL_IDX,
  A             => '../',
  CARDS         => $cards,
  TOPIC_OPTIONS => $topicOpts,
  MONTH_OPTIONS => $monthOpts,
  LEAD_HERO     => $POSTS[0]{hero},
  LEAD_HERO_W   => $POSTS[0]{heroW},
  JSONLD        => $idxLd,
  CHROME_HEAD   => fill($CHROME_H, A => '../'),
  CHROME_FOOT   => fill($CHROME_F, A => "../", SCRIPTS => qq{<script src="../assets/js/blog.js?v=20260911" defer></script>}),
));
print "  wrote blog/index.html\n";

# ---- RSS ----------------------------------------------------------------
my $now = strftime('%a, %d %b %Y %H:%M:%S +0530', localtime);
my $rss = qq{<?xml version="1.0" encoding="UTF-8"?>\n}
  . qq{<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n}
  . qq{    <title>The Colombo Court blog</title>\n}
  . qq{    <link>$SITE/blog/</link>\n}
  . qq{    <atom:link href="$SITE/blog/feed.xml" rel="self" type="application/rss+xml"/>\n}
  . qq{    <description>Notes on Colombo, the hotel, the spa and the two restaurants, from Colombo Court Hotel &amp; Spa in Colombo 3.</description>\n}
  . qq{    <language>en-gb</language>\n}
  . qq{    <lastBuildDate>$now</lastBuildDate>\n};
for my $p (@POSTS) {
  $rss .= qq{    <item>\n}
    . qq{      <title>} . esc(plain($p->{title})) . qq{</title>\n}
    . qq{      <link>$SITE/blog/$p->{slug}/</link>\n}
    . qq{      <guid isPermaLink="true">$SITE/blog/$p->{slug}/</guid>\n}
    . qq{      <pubDate>$p->{rfc}</pubDate>\n}
    . qq{      <category>} . esc(plain($p->{topic})) . qq{</category>\n}
    . qq{      <description>} . esc(plain($p->{summary})) . qq{</description>\n}
    . qq{    </item>\n};
}
$rss .= qq{  </channel>\n</rss>\n};
spew("$ROOT/blog/feed.xml", $rss);
print "  wrote blog/feed.xml\n";

# ---- the sitemap, rewritten between its markers ------------------------
my $sm = slurp("$ROOT/sitemap.xml");
my $block = qq{  <!-- BLOG:START  rewritten by blog/build.pl, do not edit between the markers -->\n}
  . qq{  <url>\n    <loc>$SITE/blog/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n};
for my $p (@POSTS) {
  $block .= qq{  <url>\n    <loc>$SITE/blog/$p->{slug}/</loc>\n}
    . qq{    <lastmod>$p->{date}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>\n};
}
$block .= qq{  <!-- BLOG:END -->\n};

if ($sm =~ m{^  <!-- BLOG:START.*?^  <!-- BLOG:END -->\n}ms) {
  $sm =~ s{^  <!-- BLOG:START.*?^  <!-- BLOG:END -->\n}{$block}ms;
} else {
  $sm =~ s{(\n</urlset>)}{\n$block$1};
}
spew("$ROOT/sitemap.xml", $sm);
print "  wrote sitemap.xml (" . scalar(@POSTS) . " entries + the listing)\n";

print "done\n";
