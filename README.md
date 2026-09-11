# Colombo Court Hotel & Spa homepage

Static homepage. Plain HTML, CSS and vanilla JavaScript. No build step, no
framework, no npm. Serve the folder and it runs.

```
index.html            the homepage
stay/index.html       Rooms & Suites
eat-drink/index.html  Amber Poolside & Cloud Café
wellness/index.html   The Court Spa
assets/menus/         the PDF menus the in-page reader opens
assets/css/styles.css one stylesheet, tokenised at the top
assets/js/main.js     one script, no dependencies
assets/img/           responsive JPEG/PNG sets, already sized
assets/media/         the films: the hero in two cuts, two clips per
                      restaurant, one for events
.htaccess             clean URLs, security headers, caching (Apache)
llms.txt              a plain-language brief of the hotel for answer engines
robots.txt            crawlers, including AI answer engines
sitemap.xml           homepage now, future pages listed as comments
site.webmanifest      icons and theme colour
```

---

## Design direction: "A day in the court"

The page's light changes as you descend. A fixed canvas layer interpolates
from first light through noon into late afternoon and finishes warm. That is
the site's one idea, and it is why the headline is "Colombo, in a different
light."

Six places carry an hour stamp (`07:00 · by the pool`) saying when in the day
that part of the hotel happens: The Hotel, Eat & Drink, Amber Poolside, Cloud
Café, The Court Spa and Experiences. The rest run without one, so the device stays
a note rather than a label on everything. The hours are the hotel's own, which
means they no longer read in ascending order down the page — breakfast at
Amber sits above the roof at half past five. Change them in `index.html`; each
is one `<span class="stamp__t">`.

White is the page’s ordinary ground: The Hotel, Stay, Eat & Drink, Colombo
our way, In their words and Good to know all sit on it. The warm canvas that
the scroll interpolates now shows through in two places only, The Court Spa and
Events, which is what keeps the descent from reading as one flat sheet. If
you put another section on white, take the one above or below it off, or the
rhythm goes.

The page is warm off-white almost the whole way down. Dark is used four
times and each time it means something: the hero film, the sustainability
garden, the events enquiry panel, and the closing image at night. The legal
line at the very bottom is near-black so the footer has a floor. Nothing is
brown, and no section is dark merely for contrast.

- **Palette** warm charcoal `#26221E`, off-white `#F7F4EF`, cream `#FCFAF6`,
  linen `#FAF0E6`, dawn `#EDE8E0`, late gold `#E7D5BE`, espresso `#241F1A`
  for the one dark panel. WhatsApp green `#25D366` appears only on WhatsApp
  controls, and never on the closing call to action.
- **Accent** `#C0222E`, taken from the hotel's own logo mark. It appears on
  primary buttons, focus rings, the review stars and the small rules under
  the room links. Nowhere else.
- **Type** Playfair Display 400/500 and one italic; Poppins 300/400/500.
  Only those weights are requested from Google Fonts.
- **The one interactive moment** In section 02 the visitor presses and holds
  the courtyard photograph and the court turns from day to night. It is the
  headline, performed. Release early and it eases back; reduced motion gets
  the finished state without holding.

## The homepage as a journey

1. **Hero** a film of the garden court, one CTA only because BOOK NOW is
   permanently in the header, and nothing else. The block is centred in the
   viewport rather than anchored to its foot, so 900px, 1080px and 1200px
   tall screens all read the same; the extra top padding is the header, which
   pushes the optical centre down by half of it. The headline sets on two
   lines from 720px up and three on a 375px phone.
2. **The Hotel** trust, told as a story rather than a fact sheet: the
   building, the street, the things in the rooms, the size of the team.
   Three paragraphs, written to finish within a line or two of the picture
   column beside it — the two details are cropped 7:10 to make that land
   (822px of writing against 861px of photograph at 1440). If you rewrite the
   copy, re-check that balance; the crop is the easier of the two to adjust.
3. **Stay a while** heading left, description right, the two centred on each
   other, then three aligned cards (Suites, Superior Deluxe, Deluxe) and two
   CTAs. No wide hero image: the rooms carry it. Every `.lede` beside a
   heading is written to two lines at that measure — if you rewrite one,
   keep it near 90 characters or the pair stops looking balanced.
4. **Eat. Drink. Linger.** the two restaurants sit as a pair from 760px up,
   each card in the same fixed order: the name, then the picture block, then
   one paragraph. They stack on a phone. One paragraph each is deliberate — a
   visitor deciding where to eat wants the shape of the room, not the whole
   menu, and the menu belongs on /eat-drink/.

   The two cards share four grid rows — name, pictures, copy, tags — through
   `grid-template-rows: subgrid` on `.vcard`, so both line up on every row
   even though one restaurant has more to say than the other. Without subgrid
   support they still stack correctly, just unaligned.

   The picture block is `.msplit`, the same component Events uses: a portrait
   film beside two still photographs, the two columns finishing level. Only
   the film moves. An earlier draft had a 16:9 film plus two auto-changing
   portrait frames in each card, which put six moving things in one viewport
   on a page whose whole argument is *linger*. Two is the right number.
5. **The Court Spa** photographs left, words right, its own four-frame gallery.
   The frame is square rather than 4:5 so the picture finishes where the
   words do: the section is 640px tall at 1440 × 900 and holds one screen.
6. **Experiences** the editorial rail, the SEO and GEO content destination.
7. **Sustainability** the garden at dusk under a deep wash off the left
   edge, text in white. One verified fact leads. Worst-pixel contrast under
   the headline is 19.0:1 and under the smallest body copy 13.0:1.
8. **Events** the same `.msplit` block as the restaurants: a 9:16 film on
   the left, two still 16:9 frames stacked on the right, both columns
   finishing level. Then the enquiry form that reaches the events team on
   WhatsApp, and an Explore events link held for the future `/events/` page.
9. **Reviews** on plain white, rotating on its own, Tripadvisor-ready.
10. **Good to know** on plain white too: six questions that open one at a
    time, mirrored word for word in the FAQPage schema. The two white rooms
    in the middle of a warm page are deliberate — the words carry alone.
11. **Make Colombo yours** the closing booking moment. Both buttons are
    outlined, not filled; they fill on hover. No red, no green.
12. **Footer** four short bands: newsletter beside three columns of
    navigation, a centred Find us with the address, phone, email, WhatsApp
    and four social marks, the GDS codes folded away in a band of their own,
    then a near-black legal line. The nav columns are sized to their words and
    share one gutter so the gaps read equal; the GDS list needs the full width
    to open into, which is why it is not inside a column and why it sets on one
    row from 900px up. The legal line runs copyright-left, links-right on one
    row on a desktop and stacks centred on a phone, which is the only shape
    that fits at 375px.

### Vertical rhythm

The stamp sits `1.3rem` above its heading everywhere, which is the stamp’s own
margin in the venue blocks and the row gap in the split heads. Do not fold
that row gap back into the shorthand `gap` on `.sechead--split`: the column
gap between headline and description is four times as large, and setting both
at once pushes every split heading a long way off its stamp.

Sections are `var(--sec-y)` top and bottom, but five of them — The Hotel,
Stay, Eat & Drink, The Court Spa and Reviews — take a foot of `calc(var(--sec-y)
* .55)`. They each end on a grid, a gallery or a closing line, so the shape
itself already reads as a full stop and a full measure underneath left a hole.
The section that follows one of those takes a shorter head too —
`calc(var(--sec-y) * .62)` on Stay, Eat & Drink, The Court Spa, Experiences and
Q&A — so the join is one tightened gap rather than a full foot meeting a full
head: 84px at 1440px instead of 144px. Sustainability, Events and the closing
image keep the symmetrical pair, because each of those ends on a coloured or
photographic edge that needs the air to sit against.

## Server configuration

`.htaccess` in the root does five jobs, and none of them are optional. If the
site lands on nginx or a static host instead, the equivalents are below.

**1. One address per page.** A visitor should never see `index.html` in the
bar, and a crawler should never be offered the same page at two URLs. The
rewrite rules force https, force one host (www), 301 any request carrying
`.html` to the clean form, and then serve the file behind that clean form.
The `<link rel="canonical">` in the head already points at `https://www.colombocourthotel.com/`,
so the server and the markup agree.

There is deliberately **no** `ErrorDocument 404 /index.html`. Serving the
homepage for a missing URL is a soft 404: the crawler gets a 200 and indexes
the same page under a dozen addresses. Build a real 404 page and point the
directive at that.

**2. Security headers.** Content-Security-Policy, HSTS, `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and the two
cross-origin isolation headers. The CSP is written tight: the page's own
assets, Google Fonts, and the consent-gated tag endpoints. Adding a third
party means adding it to that line — if a widget silently does nothing after
launch, the CSP is the first place to look, and the browser console will name
the directive that blocked it.

**3. Nothing private is served.** Dotfiles, `.md`, `.ps1`, `.log`, `.env` and
loose `.json` are refused. Directory listing is off, `MultiViews` is off, the
server signature is off. `robots.txt`, `llms.txt` and `site.webmanifest` are
allowed back explicitly.

**4. Compression** for HTML, CSS, JS, SVG and JSON, gzip and brotli.

**5. Caching.** HTML for ten minutes, because rates and opening hours live in
it. Everything with a width in its filename for a year and `immutable`,
because a new photograph gets a new name.

### If the host is not Apache

- **nginx** — `return 301` for the host and scheme, `try_files $uri $uri.html $uri/ =404;`
  for the clean URLs, `add_header` for each header, `gzip on` plus a
  `location ~* \.(css|js|jpg|mp4)$ { expires 1y; }` block.
- **Netlify** — put the headers in `_headers` and the redirects in
  `_redirects`. Pretty URLs are on by default, which covers the `.html` case.
- **Cloudflare Pages / Vercel** — `_headers` and `_redirects`, or
  `vercel.json` with `headers` and `cleanUrls: true`.

Whatever the host, verify after deploy with
`curl -sI https://www.colombocourthotel.com/index.html` (expect `301` to `/`)
and a run through securityheaders.com.

### What is not the server's job

The form posts nowhere until `CFG.eventEndpoint` is set, so there is no
handler to harden yet. When one is added: validate on the server as well as
in the browser, rate-limit by IP, keep the honeypot field, and never echo a
submitted value back into the page without escaping it. The newsletter goes
straight to Brevo, so the email address never touches the hotel's own server.

## SEO and GEO

The page is written to be quoted, not just ranked.

- **One `<h1>`**, one `<h2>` per section, `<h3>` for the rooms, the two
  restaurants and the six guides. Run the outline again after any content
  edit; a second `<h1>` is the easiest thing to add by accident.
- **JSON-LD `@graph`** carries `Hotel` / `LodgingBusiness`, a `Restaurant`
  for each venue with `openingHoursSpecification`, a `HealthAndBeautyBusiness`
  for the spa, a `WebSite`, and an `FAQPage`. Every entity has `@id`, so the
  restaurants and the spa are linked to the hotel rather than floating.
- **The FAQ answers in the schema are the on-page answers, character for
  character.** That is a requirement, not a nicety: schema that does not match
  visible text is a manual-action risk. There is a check in the browser
  console under "Verifying" below.
- **No `aggregateRating`** on the hotel. Self-serving review markup on a
  `LodgingBusiness` is against Google's guidelines even when the rating is
  real. The 4.9 sits in the visible page instead, where it belongs.
- **`llms.txt`** in the root is a plain-language brief for answer engines:
  address, phone, room count, check-in and check-out times, airport distance,
  restaurant hours, and the sustainability claim with its date. Update it in
  the same edit as the page — an answer engine quoting a stale opening hour
  is worse than one that quotes nothing.
- **`robots.txt`** allows GPTBot, PerplexityBot, ClaudeBot and Google-Extended
  by name. That is a commercial decision as much as a technical one: it is
  what lets the hotel be the source an assistant quotes rather than a review
  aggregator.
- **Facts carry their qualifier.** "South Asia's first city hotel certified
  CarbonNeutral, in 2011, held every year since" survives being quoted out of
  context. "Award-winning" does not, which is why there is none of it.

### Verifying

Paste into the console on the live page:

```js
const g = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
const page = [...document.querySelectorAll('.qa')].map(d => [d.querySelector('summary').textContent.trim(), d.querySelector('.qa__a').textContent.replace(/\s+/g,' ').trim()]);
const faq = g['@graph'].find(n => n['@type'] === 'FAQPage').mainEntity.map(q => [q.name.trim(), q.acceptedAnswer.text.replace(/\s+/g,' ').trim()]);
console.log(page.every((p,i) => p[0] === faq[i][0] && p[1] === faq[i][1]) ? 'FAQ matches' : 'FAQ DRIFTED');
```

Then Rich Results Test for the schema, and Search Console for the rest.

## The Rooms page  ·  /stay/

`stay/index.html`, sharing `assets/css/styles.css` and `assets/js/main.js`
with the homepage and adding `assets/css/pages.css` and `assets/js/pages.js`.
The header, mobile menu, footer, cookie banner and dock bar are lifted from
`index.html` unchanged, so the chrome cannot drift between pages — if you
edit the header, edit it in both.

### The idea: hierarchy is spatial

The brief was to sell suites, not to list rooms. So the layout is the
argument: **a category's rank is how much page it gets.**

| Tier | Categories | Treatment |
|---|---|---|
| One | Suite | The only full band on the page, and the only film. Thirteen of the thirty-one rooms are Suites. |
| Two | Duplex Suite, Honeymoon Suite | A shared row, five grid rows deep via `subgrid` so both cards line up on name, photograph, copy, facts and button however long the writing runs. |
| Three | Superior Deluxe, Deluxe Twin, Deluxe Room | A strip each, one photograph high. Honest, complete, and visibly further down the ladder. |

**The order changed once the fact sheet arrived, and the reason is inventory.**
Thirteen of the thirty-one rooms are Suites, so the Suite now leads the page
and carries the only film. The Duplex and the Honeymoon follow, both one of a
kind, and the three room categories come after. Leading with Deluxe would have
trained a visitor to read Colombo Court as a Deluxe hotel that also has suites;
leading with the category we have most of sells the thing there is most of.
If you ever reorder these, reorder the `ItemList` in the JSON-LD to match — it
carries `itemListOrder` and a search engine reads it.

### The Suite band

The film and the two details share the left column: a 16:9 frame with the two
stills directly under it at matching widths. That is a deliberate second pass.
The film was first built as a full-height portrait stretched to the height of
the words beside it, which guaranteed the details could never fall past its
foot, but at 619x1108 it read as a poster rather than as part of the page.
16:9 is both the shape of the footage and a good deal smaller, and because the
stills now sit in the same column as the film, nothing has to be stretched to
keep anything in line.

### The Suite film

`assets/media/stay-suite.mp4`, 0.87 MB, 1120x630, 24 seconds, silent and
looping. It is the Suite photograph rather than new footage: a slow zoom over
twelve seconds, then the same twelve seconds reversed and concatenated, so the
loop has no seam and no cut. It runs on the same `data-reel` machinery as the
restaurant films, which means it is lazy, never autoplays with sound, and
falls back to the poster under `prefers-reduced-motion`. Replace it with the
commissioned shoot and re-cut `room-suite-film-*.jpg` from frame one so the
still keeps matching.

**[TEMPORARY] `data-yt` on that frame puts a YouTube film over the top of it.**
The id is `yrijHhAKvRU`, which is *Kumu Beach, Balapitiya*, by Teardrop Hotels.
It is **not our footage and not our hotel**, and it is another Sri Lankan
property, so it must come out before launch. Delete the `data-yt` attribute
and everything switches itself off: section 8 of `pages.js` does nothing
without one, and the local film starts playing again because the guard in
`main.js` that suppresses it also keys off `data-yt`. No CSP change is needed
either way, because the YouTube exceptions are already there for the hero.

It runs through the iframe API rather than a plain embed for the same reason
the hero does: the frame is revealed only once the player reports PLAYING, so
nobody sees a black box or a spinner, and the local film is stopped at that
exact moment so the two never run together.

### The card layout

Both cards run **name, standfirst, one photograph, the words, the facts, the
button**, in that order. Earlier versions opened with a tall 4:5 photograph
above the name and closed with a pair of small details; the tall frame made
each card read as a poster, and the pair repeated at small size what the
lightbox already holds at full size. One well-chosen 3:2 frame does more, and
the heading arriving before the picture is what makes the two cards scan as a
pair rather than as two posters.

### Nothing counts the category

The page used to say how many rooms of each kind there are in four places at
once: a grey label under the size, a line in the specs, a line in the prose
and a line in the comparison band. It is not a fact a guest can use. Every
per-category count has gone, and the stamps went with them, because once the
count was removed the stamp only repeated the floor area from the specs
underneath it.

Two counts survive on purpose, both about the hotel rather than a category:
**31 rooms** and **15 of them suites**, in the hero and the facts row. That
one is a genuine differentiator and was asked for.

### Instead of a comparison band

The six categories were laid out first as a table of ticks, then as a scale of
floor areas. The table read like a timetable; the scale read better but was
still the same information a second time, because every figure in it already
appears in the room section above.

It answers a different question now. **Which room is yours** takes six ways
people actually arrive here and names the room for each: two of us for a few
nights, two of us and it is an occasion, a family, sharing but not a bed,
working from Colombo, and one night where the rate matters. That is the one
thing a rooms page can say that the room sections cannot, and on a Meta
landing page it is the difference between browsing and booking.

**There is no JavaScript in it.** The six choices are radio buttons in one
group, the six panels are their siblings, and CSS shows the panel whose radio
is checked. With scripts off every panel is simply visible, which is the right
fallback; arrow keys move between the choices because that is what radios do;
and the focus ring is drawn on the label the focused input belongs to. The
inputs are moved off screen rather than set to `display:none`, which would
have taken them out of the tab order along with everything else.

Two deliberate refusals: no equal-weight card grid (the commonest hotel rooms
page there is, and it flattens exactly the hierarchy we want), and no
photograph wall. "As many images as possible" is answered by three placed
frames per category plus a lightbox, not by a contact sheet.

### The lightbox

Every category's extra frames sit in a `<template data-shots="slug">` inside
its own block. Adding a photograph is one more `<img>` in that template — no
code, no configuration, and nothing downloads until someone opens it, because
a `<template>` is inert. The dialog traps tab, closes on Escape, steps with
the arrow keys, takes a swipe on a phone, preloads the two neighbouring
frames, and returns focus to the button that opened it.

### Booking with a room already chosen

The engine is eZee (`live.ipms247.com`). It takes the dates as query
parameters, which is what the homepage already does. Opening it on one room
type needs the parameter name and a per-room id, and both come out of the
hotel's own eZee back office.

**To finish this:** in eZee, open the booking engine on one room type, copy
the address bar, and read off the parameter name and the id. Put them in
`ROOM_KEY` and `ROOMS` at the top of `assets/js/pages.js`. Until they are
filled the buttons still work — they open the engine on the normal
availability screen, which is correct behaviour, just one click longer.

The same file is where the Staycation, Daycation and direct-booking rate
plans go, under the same `ROOMS` map.

### What still needs a real answer

Everything below is marked `[PLACEHOLDER]` in the markup and is visible on the
page as a bracketed value, so it cannot be mistaken for a fact and cannot be
missed at review.

**Most of this is now settled.** The 2026 fact sheet supplied every room
count, floor area, bed, occupancy and amenity on the page, and the Duplex
Suite has real photography at last. What is left:

| Where | What is missing |
|---|---|
| Staycation | What LKR 18,000 net includes. The rate is confirmed; whether breakfast is in it is not, so the card does not claim it. |
| All three offers | Which nights they run and any blackout dates. |
| Room service hours | The fact sheet says in-room dining is in every category but does not give the hours. |

### Contrast on this page

Six bands run the full height of the screen, and making a band full height is
exactly what moved text onto the bright part of a photograph on the other two
pages. Both photographic bands here were measured afterwards, against the text
block rather than the frame.

| | Worst reading | |
|---|---|---|
| Hero | **7.5:1** | the small breadcrumb; the heading is 8.4 and the standfirst 17.4 |
| Closing band | **5.6:1** | the large heading, which needs 3:1 |
| Everything else | **4.6 to 16:1** | the lowest is the small grey footnote under the room chooser |

Nothing on the page is below the 4.5:1 minimum. One reading was caught at
4.63:1 during the rebuild, on the body copy of a recommendation panel, and
lifted to 7.69:1: passing is not the same as comfortable, and that panel is
the main reading matter of its band.

The fifteen amenity icons are drawn here rather than taken from a set, and
six were redrawn after being looked at rather than described. The first hair
dryer read as a megaphone, the first shoe shine as a canoe, and the first
in-room dining as a lampshade. The way to check an icon is to render it at
96px and look at it, which is what was done.

Section 18 of `v2.css` carries a `min-width:0` for every full-height band on
all three version-two pages. It was written for the comparison table, which
was wider than a phone and meant to scroll inside its own box: as a grid item
its container refused to shrink, so the box never scrolled and the last
columns were unreachable. The table has gone, but the rule stays, because the
same trap is waiting for anything wide that is added to those bands later.

### Measure, and why the caps came off

Version one caps almost every paragraph in `ch`, which was right when the page
was 1200px wide. At 1680 those caps stop short of the column they sit in and
leave a ragged gutter down the right of the page. Section 19 of `v2.css`
releases each one to the width of its own column, and only on this page,
because these columns are already a sensible measure.

What that costs, stated plainly: on a 1920 monitor the longest line on the
page, the copy beside a room strip, now runs to roughly **100 characters**
against the 70 to 80 that is comfortable to read. That was the explicit
instruction and the page looks more composed for it, but it is a trade, not a
free win. If it ever reads as too long, the fix is one line: put
`max-width:88ch` back on `.page--stay .rband__body p`, which caps only the
widest column and leaves the rest alone.

The one cap that stays is the standfirst beside a section heading, where the
column really is the full 1310px.

Two rows were also short of the space they had. The facts under **What
separates one from the next** carry five figures now rather than four, the
fifth being the airport distance, and each room strip carries four rather than
three. Nothing was invented to fill them: both extra items are from the fact
sheet.

### Where the numbers came from

Every figure on this page is from `Fact Sheet_2026.pdf`, which is an image-only
PDF with no text layer. It was read by rendering each page through the Windows
PDF renderer rather than retyped, so nothing was transcribed by eye. The room
table on the page mirrors the fact sheet row for row, and the JSON-LD is
generated from the same array in one script, so the visible table, the schema
and the fact sheet cannot drift apart.

Two things in that fact sheet were deliberately **not** used, because the
hotel has since corrected them: the dining hours (it has Amber closing at
17:00 and Cloud opening at 17:30, both superseded) and the names *Amber Spa*,
*Grape Expectations* and *The Loft*. The site says The Court Spa, and the
brief has ruled out a wine lounge.

## Tracking, heatmaps and the ad pages

`/stay/` and `/eat-drink/` are the Meta ad landing pages, so they carry more
instrumentation than the homepage.

- **Microsoft Clarity** for heatmaps, session recordings and rage-click
  detection. Free and unlimited, which matters when you are iterating on ad
  creative. Put the project id in `window.CCH_TAGS.clarity`.
- **GA4** through GTM for traffic, and **Meta Pixel** for the campaigns. Both
  ids go in the same object.
- All three load **only after consent**. The gate already exists; nothing
  fires before someone accepts.
- `pages.js` fires named events rather than relying on pageviews:
  `begin_checkout` with the room name on every booking button, `view_item`
  when a lightbox opens, `contact` when WhatsApp opens, and `scroll_depth` at
  25 / 50 / 75 / 100. Optimise campaigns on those, not on landings.

### WhatsApp: one number, several people

A `wa.me` link can only open a chat with a single number — there is no group
equivalent, and a group invite link cannot carry a prefilled message. Two ways
to get several people on the same enquiries:

1. **WhatsApp Business app**, one number linked to up to five devices. Free,
   works today, probably enough.
2. **WhatsApp Business Platform** through a provider (360dialog, Wati, Twilio)
   for a real shared inbox with assignment and canned replies. Costs per
   conversation; worth it as volume grows.

Either way the site links to one number and the sharing happens on WhatsApp's
side. Change it in one place: `CFG.eventsWhatsApp` in `main.js`.

### Email as well as WhatsApp

A browser cannot send email, and `mailto:` opens the visitor's mail client,
which many people do not have configured. It needs a form endpoint: Formspree
or Web3Forms are the cheapest good options, or Brevo transactional since the
newsletter is already on Brevo. Set `CFG.eventEndpoint` and the enquiry posts
there quietly **and** opens the prefilled WhatsApp message on the same click,
so one action reaches both and neither depends on the other.

## The Eat & Drink page  ·  /eat-drink/

`eat-drink/index.html`, on the same shared chrome, stylesheet and script as
`/stay/`.

### The idea: the page is one day

The two restaurants are not a hierarchy: they are the same kitchen in two
places at two times of day. So the organising device is the clock, not rank.
The page starts bright and ends dark:

- **Amber Poolside** sits on white. It is the daytime one.
- **Cloud Café** sits on near-black (`--espresso`). It is the evening one.

Nothing on the page calls either of them a *room*. Guests read "room" as a
bedroom, and this is a hotel; the two are "places", or they are named.

That is the only reason for the dark band, and it pays for itself twice: the
rooftop reads as a night place, and the kitchen's own dish photography — all
of it shot on dark grounds — can only live down there. A strip of those
plates on a white background would have looked like a delivery app.

Between them, a five-entry clock (07:00 breakfast through 23:30 last orders)
that answers the question a visitor actually has, which is *when do I go
where*. Set as data, so the hour leads.

Each line is written to wrap to exactly two lines, so the five read as one
even row rather than a ragged one. That only holds while the columns are wide
enough, which is why the five-across layout starts at 1180px rather than 900:
below it the clock is a list with the hour in its own column, which aligns by
construction. **If you edit a line, keep it between about 30 and 38
characters** or the row goes ragged again.

### The mosaic

Each venue gets a 16:9 film across the top and then six frames in three
shapes: one lead frame spanning two rows, two squares stacked beside it, and
three wide frames underneath. No orphan tile, and no two frames the same size.
Equal thumbnails read as a gallery; unequal ones read as a spread, which is
the difference between looking at a menu of pictures and looking at a place.

If you add a photograph, add it to `.mosaic` with one of the existing classes
(`__b` through `__f`) or the grid will break its rhythm.

### The sliders

Each venue carries one: **What comes out beside the water** on Amber, **Out of
the kitchen, and off the bar** on Cloud. Ten frames each, alternating plates
and drinks, advancing on their own every three seconds (`EVERY` in `pages.js`).

They are two independent instances of the same code. `pages.js` iterates every
`[data-slider]` and finds its arrows inside its own `.dishes` block, so adding
a third anywhere needs no JavaScript change. The styling is written for the
white band and `.venue--dark` overrides it, rather than the other way round.

The two rows are deliberately different in character. Amber is daylight: the
plates on light grounds and the four juices shot at the pool edge, which is
the only photography on the site that says *poolside* without a caption.
Cloud is the kitchen and bar photography, all of it shot on dark grounds,
which is one more reason that band is dark.

Motion nobody asked for is worth being careful about, so each stops readily:
on hover, on keyboard focus, while the browser tab is hidden, while that row
is off screen, and for six seconds after anyone scrolls or swipes it.
Under `prefers-reduced-motion` it never starts at all, and the two arrows
become the only way it moves. The arrows are always there, which is what makes
the automatic part acceptable rather than a thing being done to the reader.

**It runs as a circle, not a carousel that rewinds.** On load, `pages.js`
clones the whole set once and appends it, hidden from assistive tech, so the
last picture is followed immediately by the first with nothing between them.
When the resting position passes the end of the original set, one set width is
subtracted; the copy is pixel for pixel the same, so the fold cannot be seen.
The fold runs before each move rather than during one, so an animation in
flight is never cut off, and again on a settle timer after a scroll the
visitor started themselves. Going back from the first picture steps forward
onto the copy first, so there is always something to the left.

To add or remove a frame, edit the `<li>` list. Nothing is hard-coded to ten:
the count is read at runtime, the clone set is rebuilt from whatever is there,
and the step is measured from the first frame, so the arrows and the loop keep
working. The clones inherit `loading="lazy"`, so a longer row costs nothing
until it is actually on screen.

**The four cocktail captions on the Cloud row describe the photographs**
rather than naming anything on the bar list. Replace them with the real names.
Every caption on the Amber row is the dish or drink name from the kitchen's
own photography, so those are already right.

### The personal touch

The brief is a boutique hotel, and the thing a guest expects from one is that
somebody listens. Three places on the page say so without saying "bespoke":
the day section explains that one small kitchen means what you ask for is what
arrives; Amber offers to have breakfast waiting the way you want it if you ask
the night before; and Cloud offers a menu written for your table rather than
the same card handed round. There is also a question in the list about it,
which is the version an answer engine is most likely to quote.

### The offers

The section used to be headed **What is on this week**, which reads as a
listings board rather than a deal. These run every week at fixed prices, so
the heading is now **Standing offers** — no count in it, because there will be
more. Each card leads with the day in crimson, the place under it, and
finishes on a price line set in the ink colour rather than the grey used for
terms. A visitor scanning for a reason to come reads day, name, price, in
that order.

From 900px the four cards run on **two levels of subgrid**, so the day, the
name, the description and the price sit on the same four rails across all of
them. The four descriptions are also written to the same length, so the rows
are full rather than padded. Add a fifth offer and it inherits the rails; keep
its description near the same length and the row stays even.

On a phone the day and the room close up onto one line with an en dash
between them, because on one column there is room for both.

### The menu reader

`[data-menu="amber"]` and `[data-menu="cloud"]` open the shared reader with
the PDF in an `<iframe>`. It is a **panel, not a full screen**: capped at
58rem (928px), centred, on a dimmed and lightly blurred backdrop, because an
A4 page stretched across a 1920 monitor is not readable. The visitor never
leaves the page and never downloads a file they did not ask for; Escape closes
it, the bar carries a **Download** button that names the file after the menu
rather than the folder, and there is an **Open full size** link for anyone who
wants the real viewer. On a phone that link is hidden, because a download
opens the browser own PDF view anyway and the bar was wrapping to three rows.

The frame is built immediately rather than after a `HEAD` check, because in
production the file is there and a round-trip before anything appears reads as
a hang. A background `fetch` swaps in a "not up yet" panel only on a real 404,
and leaves the frame alone if the server is slow or unhelpful.

Two menus ship: `assets/menus/amber-poolside-menu.pdf` (0.69 MB) and
`assets/menus/cloud-cafe-menu.pdf` (0.20 MB). Both were replaced on
10 September 2026 with the current cards from the marketing desktop
(*Amber_Poolside_Menu.pdf*, *Cloud_Cafe_Menu.pdf*), which also settled the old
note about the Cloud menu being 5 MB. **To replace either again, drop the new
PDF over the same filename.** Nothing else needs touching: the path is in the
`MENUS` map in `pages.js` and the download name is generated from the menu
title, not the filename.

**Still outstanding:** the Beverage and Shareables menus are 14 MB each, which
is why they are not on the page. Run them through any PDF compressor, add them
to the `MENUS` map, and add a button.

### Table requests

The form runs the full width of the band, the same shape as the treatment
request on `/wellness/`: four short fields to a row on a wide screen, two on a
tablet, one on a phone.

It takes name, contact, email, venue, date, time, guests, occasion and a note.
**Occasion** is new, and it is there partly because a restaurant genuinely
wants to know and partly because it makes the grid whole $E seven fields left a
hole in the second row. It is only added to the message when it is not the
default.

One press opens a prefilled WhatsApp message to **+94 76 668 0971** and, once
`CFG.eventEndpoint` is set, posts the same details quietly to the hotel inbox.
Neither depends on the other, and the success panel offers both again in case
WhatsApp did not open. The **Reserve a table** button inside each venue
preselects that venue in the form.

The date field will not accept a date in the past.

### Before you come

Six questions in the same accordion the Wellness page uses, replacing the
three columns of bullets that were there. The six answers are repeated word
for word in a `FAQPage` block in the head: **change one and change the
other**, or the schema starts describing a page that does not exist.

### Version two, and the six full-screen bands

The page loads `assets/css/v2.css` after `pages.css`, exactly as the homepage
and the spa do, so the charcoal header, the red **Book now**, the white mark,
the 1680px width, the larger body type and the footer all arrive from the same
file. Delete that one `<link>` and the page returns to version one.

Section 16 of `v2.css` holds the shapes this page does not share. Six bands run
`min-height:100svh` with `align-content:center`: the hero, **When to come**,
**A day here**, **Book a table**, **Before you come** and the close. Below
900px every one of them goes back to ordinary padding, because a phone screen
is the wrong unit to measure a band in.

Two of those are new. The clock was lifted out of **When to come** into a band
of its own, because it is the one thing on the page a visitor scans rather than
reads, and it now runs three across and two down on a desktop with the hour at
roughly 34px, which is the shape that fills a screen without stretching thin.
**Before you come** grew from seven questions to eleven and took a still beside
it, in the same `.qbox` the spa uses.

Making a band full height moves its text off the middle of the photograph,
which is exactly how three contrast failures were introduced on the other two
pages. Both photographic bands here were measured again afterwards, against the
text block rather than the frame: hero 6.6:1 at worst, closing band 6.3:1. The
lowest reading anywhere on the page is 4.87:1, on the small grey note under the
offers. Everything passes AA and most of it passes AAA.

### What still needs a real answer

| Where | What is missing |
|---|---|
| Amber closing time | The venue stamp said `07:00 → 18:00` while the offers card sells high tea until 18:30. The stamp and the schema now both say 18:30. Confirm which is right. |
| Dine & Dip | Which days and hours it runs. The card says *every day*, which is an assumption. |
| The sharing platter | Whether it is on every evening or only some. |
| Cocktail names | The four captions describe the photographs. Replace with the bar list. |
| Cloud menus | The Beverage and Shareables PDFs are 14 MB each and are not on the page. |

High tea (15:30 to 18:30, LKR 2,800 net) and happy hour (18:00 to 20:00 daily,
50% off selected drinks) are as given and are no longer placeholders. What
remains is marked `[PLACEHOLDER]` in the markup.

## The Wellness page  ·  /wellness/

`wellness/index.html`, on the same shared chrome, stylesheet and script.

### The idea: the page walks through one treatment

People are unsure about spas. Not about the price list — about what actually
happens when they walk in. So the page answers that first, in order: **you
arrive** (meeting the therapist, and the two minutes about injuries and
pressure that shape the hour), **what suits you** (choosing between the
treatments), **the treatment** itself, and **afterwards** (the plunge pool
and the jacuzzi). A treatment genuinely is a sequence, which makes an `<ol>`
the honest shape here; it is the one place on this site where an ordered
list is not decoration.

The steps are named rather than numbered. `01 / 02 / 03` markers would add
chrome and subtract information — "What suits you" tells you more than "02".
The four paragraphs are deliberately the same length, so the row reads as
four equal columns rather than a ragged one.

### The chip lists on a phone

The `.tags` rows under each venue and under the spa are hidden below 760px on
`/wellness/` and `/eat-drink/`. They repeat what the paragraph above them has
already said, and on a phone that is two more rows to scroll past for nothing.
They stay on the homepage, where they are the only place that information
appears.

The ground is the warm canvas rather than white. Stay is white, Eat & Drink
is white and near-black, this one is the calm one. Three pages, three grounds.

### Full-screen bands

Five sections are exactly one screen tall and measured to be: **our story,
dining, Colombo our way, sustainability and the closing call**. Each is one
photograph or one idea, which is the only reason a full screen is worth
taking. Below 900px they all revert to content height, because a phone
screen full of one thing is a wall, not a view.

The dining band was the fiddly one: an `auto` first row inside a
`min-height` grid swallows all the spare height, which put a large hole
under the heading. The fraction belongs on the second row, and then the
three columns fill what is left and finish exactly level.

### The header

Transparent over the film, **charcoal** (`#1E1E1B`) once you scroll, with the
white wordmark and white links throughout. **Book now is red** in both states.

### The brass is gone

The gold was tried and dropped. What replaced it:

| Was | Is |
|---|---|
| brass fill on Book now | `#C0222E`, the red in the logo mark |
| brass eyebrows and stamps on light | `#9E1B25`, the same red gone deeper |
| brass stamps on dark | `#E8E5DF`, a warm off-white |
| brass icon strokes | `#5E5E56`, a mid grey |

The red is the red in the mark on the logo, so the one accent on the page
points back at the brand rather than away from it. Everything else is
charcoal and neutral. The tokens are still *named* `--brass-*` because forty
rules reference them; they are redefined once at the top of section 14 rather
than renamed in every one.

### The hero, and the wash over it

The photograph is the tray of stones, oil, salt and towels beside the water
— a spa at a glance, where the earlier frame was the building with a pool in
front of it. Because its foreground is bright rather than dark, the hero
carries `.phero--deep`: a wash across the whole frame in the manner of the
homepage hero, rather than the top-and-bottom gradient the other two
subpages use. The class is scoped to this page; `/stay/` and `/eat-drink/`
keep the lighter scrim until someone asks otherwise.

### The header over a short hero

`measureStick()` in `main.js` used to put the header into its solid state at
a fixed distance down the page. That worked on the homepage, whose hero is a
full screen tall, and failed on the subpages, whose heroes are shorter and
whose copy sits at the foot of the frame: white type slid underneath a still
transparent header. It now measures instead, and turns the header solid ten
pixels before the first line of hero copy would reach it. Measured on load,
on resize and once the webfonts settle; never inside the scroll frame.

### The name

The spa was **Amber Spa** and is now **The Court Spa**, everywhere: headings,
title tag, meta description, Open Graph, alt text, the schema `name` and its
`@id` (`#court-spa`), the menu reader, `llms.txt` and the homepage. Nothing on
the site says Amber Spa any more; the only *Amber* left is the restaurant.

The old name was the reason to change it. **Amber Poolside** is a restaurant,
so one word was doing two unrelated jobs, and a guest reading "Amber" could
not tell whether they were being sent to lunch or a massage. **The Court Spa**
takes its name from the garden court the whole building is arranged around,
which is also where the site's design direction comes from.

Two loose ends the rename leaves behind:

- The therapist in the first ritual photograph is wearing a uniform
  **embroidered "Amber Spa"**. It is small and soft at the size it runs, but
  it is there. The alt text no longer names it.
- The menu is now expected at `assets/menus/court-spa-menu.pdf`. Nothing has
  to change in the code when the file arrives.

### Where the gym and the pools went

On this page, in an **And the rest of it** band beneath the spa: the plunge
pool and jacuzzi, the lap pool, the fitness room, and **sunrise yoga on the
roof**.

From 1000px the four run across on shared rails, the same two-level subgrid as
the offers on the Eat & Drink page, so the names and the paragraphs line up
whatever their lengths. Two across below that, one on a phone.

The yoga is arranged on request at Cloud Café before it opens. **Its
photograph is a placeholder**: a still lifted from the hotel's own yoga video,
which was filmed in the garden rather than on the roof. It is honest about the
practice and silent about the place, and the alt text claims nothing it does
not show. It should be replaced with a photograph of a real sunrise session
before any advertisement points at this card. An AI-generated image was asked
for and is the wrong answer here: a fabricated picture of a room the hotel
actually has is a claim, not a placeholder.

They are here rather than on a page of their own because a guest thinking
about the spa is already thinking about the water. A **Facilities page is
planned separately**, so the footer link points at `/facilities/` and carries
`data-soon` until that page exists — it deliberately does not point at
`#facilities` on this page.

That page earns its place when it also carries the dull necessary things:
parking, transfers, laundry, the library, business services. It is a page for
people who have already booked, which is why it belongs in the footer rather
than the navigation.

### The spa menu

`assets/menus/court-spa-menu.pdf`, 613 KB, supplied by the hotel. The reader
opens it in the page; the fallback panel it used to show is now only what
appears if the file is ever missing.

### The menu reader

It is a **panel, not a full screen**. Stretched edge to edge on a 1920 monitor
an A4 page becomes something nobody wants to read, so the panel is capped at
58rem (928px), centred, on a dimmed and lightly blurred backdrop. On a phone
it takes 96% of the width.

The bar carries the title, a **Download** button, *Open full size*, and close.
The download names the file after the menu rather than after our folder
(`The-Court-Spa-menu.pdf`), and it hides itself if the file is missing,
because offering to download something that is not there is worse than not
offering. On a phone *Open full size* is hidden: a download opens the phone
browser own PDF view anyway, so it was the same tap twice.

### Treatment requests

The form runs the full width of the band rather than sitting in a column
beside the text: four short fields to a row on a wide screen, two on a
tablet, one on a phone. Beside the text it was a tall narrow stack with half
the band left empty.

The spa form and the table form on `/eat-drink/` are the same code. Everything
either side of the middle lines is identical, so `requestForm()` in `pages.js`
handles both and switches on the form's id. The spa message carries
**Treatment**, **Staying with us**, **Date**, **Time**, **People** and notes;
the table message carries **Where** and **Guests**. One press opens WhatsApp
to +94 76 668 0971 prefilled and posts the same details to the endpoint.

### What still needs a real answer

| Where | What is missing |
|---|---|
| Opening hours | The stamp says 10:00 → 20:00 and it is an assumption. Confirm the first and last appointment, then correct the stamp, the Good to know list and the schema together. |
| Treatment list | The six options in the form are the treatments named on the homepage. Replace them with the real names and durations from the spa menu. |
| Prices | None are published, deliberately. |
| Sunrise yoga | A photograph of a real session on the roof. The current image is from the garden. Confirm too whether there is a price or it is arranged case by case. |
| The uniform | The first ritual photograph shows an "Amber Spa" uniform. Reshoot or crop once the new name is on the uniforms. |

## The blog  ·  /blog/ and /blog/<slug>/

Eight entries a month, ninety-six a year, and the whole point of the design is
that neither of those numbers makes the page slow or the work manual.

### One address per entry, which was the deciding question

The original brief asked for the full article to open in a panel rather than
send the reader to another page. Google needs an address per article, or an
entry cannot be indexed, cannot be linked to and cannot collect a backlink.
**Both are true here**, and the order matters:

- Every entry is a real, complete page at `/blog/<slug>/`, with its own
  `<title>`, meta description, canonical, Open Graph card, `BlogPosting`
  structured data and previous/next links. That page is what Google indexes
  and what a backlink points at.
- The listing links to it with an ordinary `<a href>`.
- `assets/js/blog.js` intercepts that click, fetches the real page, puts the
  article into a panel over the listing and swaps the address bar to the
  entry's own URL with `history.pushState`. Back, bookmark, copy-link and
  share all behave, because the address is genuine rather than invented.
- With scripts off it is a plain page load. Nothing is lost.

If the fetch fails for any reason at all, the code stops trying to be clever
and sends the visitor to the real page.

### The listing is in the HTML, not built by JavaScript

Every card is ordinary markup with an ordinary link, so a crawler and a reader
with no JavaScript both get the complete list. Search and both filters read
the cards that are already in the page, which is why there is no `posts.json`:
a second copy of the same data is a second thing to drift.

**Twelve entries are shown at a time.** The rest are in the markup but hidden
by script on load, so they are crawlable and cost nothing: every card image is
`loading="lazy"`, and a hidden card fetches nothing at all. Tested at
twenty-six entries: **zero images fetched on load**, twelve shown, twelve more
per click, and the count restarts whenever a filter changes so a narrow result
never inherits a wide one's paging.

### Adding a post: the whole thing, start to finish

Say you have written a post about Ceylon tea and you have two photographs to
go with it. Four steps, three of them double-clicks.

#### 1. The two photographs

Rename them for what they are, **lower case, dashes instead of spaces**:

```
ceylon-tea.jpg          the big one, for the top of the post
tea-plantation.jpg      the one that goes in the middle
```

Then drop them into these two folders:

```
blog\_new-pictures\header\   ceylon-tea.jpg
blog\_new-pictures\inside\   tea-plantation.jpg
```

**Header** means the wide picture behind the title. **Inside** means a picture
in the body of the post. Use the biggest originals you have: a header wants at
least 1600 pixels across, an inside picture at least 1100. A photograph
straight off a phone is fine.

#### 2. Double-click `blog\add-pictures.cmd`

It crops the header to 16:9 and the inside one to 3:2, makes every size the
site needs, and names them:

```
ceylon-tea.jpg       ->  bl-ceylon-tea-hero-560.jpg
                         bl-ceylon-tea-hero-900.jpg
                         bl-ceylon-tea-hero-1600.jpg
tea-plantation.jpg   ->  bl-tea-plantation-700.jpg
                         bl-tea-plantation-1100.jpg
```

They land in `assets\img\`. It turns a sideways phone photograph the right way
up, tidies up capitals and spaces in a filename, and warns you if an original
is too small rather than making a soft picture. **You never rename or resize
anything by hand.**

#### 3. Write it in `blog\compose.html`

Open that file in a browser. Paste the heading, the summary and the words the
way you would write an email. For the pictures use the names from step two
**without the size**:

- Main picture: `bl-ceylon-tea-hero` (start typing and it offers the list)
- Second picture: `bl-tea-plantation`

In the body, put `[image 2]` on a line of its own where that picture should
appear. `## ` starts a sub-heading, `**words**` makes them bold, and
`[words](/stay/)` makes a link.

Press **Write the post**, then **Copy it**. Open `blog\_src\posts.txt` in
Notepad and paste at the very bottom. Save.

#### 4. Double-click `blog\publish.cmd`

That rewrites the listing, the new post&rsquo;s own page, every other post&rsquo;s
next and previous links, the feed and the sitemap, all together.

If something is wrong it says so in plain words and publishes nothing: a
picture that is not there, a missing heading, a date in the future.

#### 5. Put it on Hostinger

The site is plain files, so this is a copy, not a deployment. Three things
changed, and it is safe to upload all three every time:

```
assets\img\      the new pictures
blog\            the listing, the new post, the feed
sitemap.xml
```

**Through hPanel**, which is the easier way: log in to Hostinger, open
**Files > File Manager**, go into `public_html`, and drag those in, replacing
what is there. Folders merge; existing files are overwritten.

**Through FTP**, if you would rather: the details are in hPanel under
**Files > FTP Accounts**. Upload into `public_html`. Any FTP program will do.

If you are not sure what changed, upload the whole project folder. Nothing on
this site is generated on the server, so replacing everything is always safe.

#### Afterwards

Give Google the sitemap once, in Search Console, at
`https://www.colombocourthotel.com/sitemap.xml`. You only ever do that once;
every post after that is found automatically, because the builder adds it to
the sitemap for you.

You can empty `blog\_new-pictures` whenever you like. The finished pictures
are in `assets\img` and the originals are not needed again.

### In short

```
1.  rename two photos, drop them in blog\_new-pictures
2.  double-click  blog\add-pictures.cmd
3.  write it in   blog\compose.html   ->  paste into blog\_src\posts.txt
4.  double-click  blog\publish.cmd
5.  upload assets\img, blog and sitemap.xml to public_html
```

#### blog/compose.html

A page that does the formatting so nobody has to learn any. It is not on the
site: it is `noindex`, disallowed in `robots.txt` and returned as a 404 by
`.htaccess`, so it can sit in the folder without being reachable.

Paste the heading, the summary and the body the way you would write an email.
It works out the web address from the heading, fills in today&rsquo;s date,
counts the words for a reading time, turns straight quotes into proper ones,
and writes the picture markup at both sizes with the right `srcset`, `sizes`,
dimensions and lazy loading. Sub-headings are a line starting `## `, bold is
`**like this**`, a link is `[words](/stay/)`, and `[image 2]` drops the second
picture in where you want it. The main picture offers the list of images that
are actually built wide enough to be a header.

#### blog/publish.cmd

Double-click it. It rewrites `blog/index.html`, every `blog/<slug>/index.html`,
`blog/feed.xml` and the blog block of `sitemap.xml` **together**, so those
things cannot end up disagreeing. Posts sort by date on their own, so the
order in the source file does not matter, and every post&rsquo;s next and
previous links are recalculated each time.

If Perl is not on the machine it says so and where to get it, rather than
flashing a black window and vanishing.

#### What it refuses to publish

The builder stops with a named error rather than writing a half-built page:

- a post dated in the future, because Google reads that as a spam signal
- a post missing any of the required fields, naming the field
- **a post naming a picture that is not on disk at every size the markup will
  ask for**, naming the file it looked for

That last one is the guard worth having. Getting an image name wrong produces
a page that looks correct to whoever wrote it and a broken picture to
everybody else. Tested: naming an inline image as the header stops the build
and prints the filename it wanted.

#### The honest limit

There is no way to make a **purely static site** pick up a file dropped in a
folder: something has to write the listing, and on this hosting that something
is the command above. If you want true drop-and-publish, there are two real
options and both are changes of setup rather than of code:

- **Move the hosting to one that builds on push** (Cloudflare Pages, Netlify).
  Commit the post, the site rebuilds itself. `build.pl` is already the build.
- **Put a CMS in front of it** (Decap, Sveltia). A login page, a rich text
  editor, and the same build runs afterwards. That is a project, not an
  afternoon.

Until then: two buttons and a double-click.

### Where the chrome comes from

`blog/_tpl/_chrome-head.html` and `_chrome-foot.html` were extracted from a
real page, so the header, the mobile menu, the footer, the cookie banner and
the dock bar on a journal page cannot drift from the rest of the site. **If you
change the site header, extract them again** rather than editing them here.

### What a crawler gets

| | |
|---|---|
| `sitemap.xml` | the listing and every entry, with `lastmod`, rewritten by the builder |
| `blog/feed.xml` | RSS, so the journal can be syndicated and picked up |
| `BlogPosting` | on each entry, with `datePublished`, `articleSection`, `wordCount` and the image |
| `Blog` + `ItemList` | on the listing, newest first |
| `BreadcrumbList` | on both, three levels deep on an entry |
| `robots.txt` | `/blog/_src/` and `/blog/_tpl/` disallowed; they are not pages |

### Two things worth deciding

**It is not in the main navigation.** It is linked from the footer of every
page, which is real internal linking, but a section publishing eight times a
month would earn its place in the header. That is a change to six pages, so it
is flagged rather than made.

### The post page has a header of its own

A post used to begin with its title on a white column, which produced two
faults at once: the fixed navigation is transparent until you scroll, so it
had nothing to be legible against, and the page started halfway down with
nothing holding it. The title block now sits in a **shorter version of the
hero every other page opens with**, over the post&rsquo;s own picture with the
same wash on it. The navigation is readable, the page is anchored, and the
picture is doing a job rather than sitting in a box.

It is 74svh rather than a full screen. On a listing the photograph is the
invitation; on a post the reader came for the words, and a whole screen of
picture before the first line is a toll.

The measure is set in two places on purpose. The **base** is
`calc(44rem + var(--gut) * 2)`, about 704px of text, and that is what the
panel uses: widening a column inside a 56rem panel only pushes it against the
edges. The **full page** takes `calc(50rem + var(--gut) * 2)`, about 800px,
because it has the room. Both carry `var(--gut) * 2` because `.wrap` adds a
gutter each side, and capping the box rather than the text is what made the
first attempt a hundred pixels narrower than intended.

At 800px the longest line runs to roughly **93 characters**, against the 70 to
80 that reads most easily. That is a deliberate call, made twice now, and the
1.7 line-height carries it; if it ever reads long, the fix is one number in
`.page--post .post__col`.

### The listing hero sat lower than every other page

Worth writing down because the cause is not obvious. A hero text block is
anchored to the **foot** of the band, so how high the heading sits is decided
by how tall the block is. Every other page has a row of buttons under the
standfirst; the listing has none, so its block was 179px shorter and its
heading started 179px lower.

The fix is extra foot padding on that hero rather than inventing a row of
buttons for it. Measured against `/stay/`: heading within **2px** at 900
tall and **3px** at 1080. At 720 it is 30px out, because the two blocks wrap
differently at squat heights and one linear value cannot match both.

### Contrast

Measured on both page types, and on the brightest header of the twenty, which
is the wedding picture: white linen and flowers under a white marquee.

| | Worst reading | |
|---|---|---|
| Listing hero | **6.8:1** | the breadcrumb |
| Post header | **5.8:1** | the breadcrumb, after the wash was deepened |
| Post headline | **7.3:1** | |
| Body copy | **8.1:1** | |
| Everything else | **4.9 to 16:1** | the lowest is the small grey dates and captions |

The post header wash was deepened once during the build: on that wedding
picture the breadcrumb measured 4.72:1, which passes and is too close to the
floor to leave alone when twenty more pictures are coming.

## The Events page  ·  /events/

Two audiences on one page: a couple planning a wedding and a company booking
a board meeting. Splitting them into two pages would have halved the search
weight of both, so the page serves both and lets each find its own way in.

### The grounds

Nine bands, and the client set the colour of each of them by eye over several
rounds. Where it landed:

| | |
|---|---|
| Hero, the films, the closing band | photograph or charcoal |
| Why us, three rooms, the six spaces, the enquiry, the questions | **white** |
| How many guests, what we will change | linen |

White runs two bands deep in two places, which normally reads as one long
band. It does not here, because every one of these holds a whole screen: the
reader arrives at one section at a time and the content changes completely
even when the ground does not. Worth knowing if a band is ever allowed to
shrink below a screen, because that is the point at which the pairs would need
a rule between them.

### The idea: three different rooms

The brief said the venue is not a traditional Colombo space and that a guest
can change the whole atmosphere. That is a claim, and claims are cheap, so it
is made as evidence: **a board meeting in the Scarlet Room, a proposal on the
roof, and a wedding in the courtyard.** Three rooms, three completely
different evenings, one small hotel. Each picture is a link into the space it
was taken in, so the section is also the fastest way into the six below it.

The first version used the same courtyard three times, which proved the
courtyard could change but left the other five rooms unseen. This version
proves the same point and does the navigation as well. The
courtyard-as-a-wedding-then-a-Batman-birthday story now lives in the note
underneath, where it costs a sentence instead of a screen.

There are no day-and-time labels over the pictures. They were tried and cut:
three timestamps on three photographs read as a schedule the reader was
supposed to decode, and the pictures say it without them.

All the photographs are the hotel's own, from real evenings.

### How many of you are there

The fact sheet has a capacity table with six columns. A table of that shape
was tried on /stay/ and read like a timetable, so the same data is put here as
the question people actually arrive with: four size bands, each naming the
rooms that take it, each with a photograph of one of them.

It was radio buttons at first, showing one answer at a time. That worked and
looked wrong: three-quarters of a full-height band was empty while somebody
worked out which button to press. All four answers are on screen now, so the
section is read rather than operated. No script at all.

The four cards are laid on a **subgrid**, so the number, the room label and
the paragraph sit on the same three lines across all four. That is also where
this section's one real bug was: a subgrid inherits its parent's row gap, so
the 48px gap meant for the space *between* cards was also opening between the
picture, the number, the label and the paragraph *inside* every card, four
times over. It made the section 144px taller than the screen and left exactly
the airy, disconnected look the redesign was meant to remove. Row gap is zero
under the subgrid now, and the space between the two rows on a tablet comes
back as padding on the card instead.

Hovering a card creeps its picture forward, which is the only thing on the
page that moves without being asked.

### The six spaces, and their galleries

Six cards. The courtyard, Cloud and the Scarlet Room run full width as lead
cards, because they are what most enquiries are about; the Loft, Grape
Expectations and the library sit in the row underneath.

Those three sit side by side, so their paragraphs run to different lengths and
their capacity figures used to land at three different heights. The card body
is a flex column now with the paragraph taking the slack, which puts the
figures on one line across all three however the copy reflows. The capacity
labels were also shortened until none of them wraps at the narrowest
three-column width, because a label that wraps on one card and not the others
puts the whole row out again.

A bug lived in that row for three rounds, and it is worth recording because of
how it was found. When the Scarlet Room was promoted to a lead card it was
given the lead card's *layout* but kept the small card's **type**. Two things
were wrong and only one was fixed the first time:

| | The courtyard and Cloud | The Scarlet Room, as promoted |
|---|---|---|
| Opening line | `.space__lede`, Playfair italic 21px | none, straight into body copy |
| Name | `h2 h2--sm`, **41.6px** | `h3`, **31.2px** |

Nothing was broken and nothing measured wrong; the card simply looked smaller
than the two above it. Every check on this page samples colour, position and
height, and none of them compares a heading in one card against the same
heading in another, so all three passed every time. The client caught it twice
from the shape of the page, the second time with the two numbers.

The Scarlet Room now carries both: the same opening line and the same 41.6px
name as the other two, with its paragraph lengthened by a clause so the three
bodies run to the same depth. All three lead cards measure identically at
1440 and at 1920. **The lesson worth keeping: a check that samples each card
on its own cannot see a card that is out of step with its neighbours.**

The three lead cards carry **photograph galleries** built the same way as the
room galleries on /stay/: every frame lives in an inert `<template>` inside
the card it belongs to, and the lightbox in `pages.js` reads it on demand.
Fourteen extra photographs are available from this page and **none of them is
requested until somebody opens a gallery.**

### The events menu and the conference package

Two cards: a rule down the left, the kind of document over its name, one
paragraph, one button. Both open in the reader panel the restaurant and spa
menus use, rather than downloading themselves at a visitor who only wanted a
look. The download button is in the panel's own bar, so the choice stays with
them.

Two earlier versions were built and cut, and the reasons are worth keeping.

The first was two paragraphs and two buttons, which read as prose rather than
as documents. The second went the other way: a **cover rendered from page one
of each PDF**, three bullet points each, and the real prices off the menu
itself. It was accurate and it was wrong for the page. A cover is a picture of
a piece of paper, which is a dull thing to put next to photographs of a
courtyard at night, and prices on a page whose whole argument is *tell us what
you want and we will write it* answers a question nobody has got to yet. Both
went.

What is left says the thing the client actually wanted said: there is a menu
for every kind of occasion, and the chef will write one that is not on it. The
prices are in the PDF, one click away, where somebody who wants them will
look. The two paragraphs are written to the same length so the pair reads as a
pair, and measured equal at 768, 1024, 1440 and 1600.

### The films

Six vertical films, because vertical is how they were shot, on the one dark
band of the page. This is the part that could have made the page slow, so it
does not: **each tile is a poster of about 45 KB and a button, and the film is
created and fetched only when somebody presses play.**

Pressing one opens a **player over the page** rather than swapping the film in
where the tile was. A visitor can go to the next film, back to the previous
one, or close it, without losing their place on the page behind; Escape and
the arrow keys work, tab stays inside the panel, and closing puts the focus
back on the tile they came from. When one film ends the next one starts.

The arrows sit **either side of the film**, not under it, so it is obvious
from the first frame that there are five more behind it. The middle column of
that row is sized `auto`, so it takes exactly the width the film works out to
at the height of the row and the arrows land beside the picture rather than
out at the edges of the screen. On a phone there is no room for that, so they
go over the film's own edges, clear of its controls.

The `<video>` element is **built when the panel opens and removed when it
closes**, which stops the download as well as the film. Only one exists at a
time.

Measured on a clean load: **15 requests, 641 KB, and no video, no PDF and no
gallery photograph in the page at all.** Six films totalling 8.3 MB and two
PDFs of 1.1 MB cost nothing until they are wanted.

The sources were 26 MB and 63 MB originals. Each is trimmed to about fourteen
seconds and re-encoded at 540px wide, which brings them to 1.1 to 1.8 MB.

### The closing band

The picture behind it is **the courtyard at night, mid-reception**: lanterns in
the trees, flame torches by the water, people standing about with drinks. It
replaced a general night shot of the hotel, because the band asks what the
night is for and this one answers it. Measured on the real pixels under the
text, the heading reads at **6.7:1** and the line under it at **5.7:1**.

A photographic ground was tried on the enquiry band as well, and taken off
again: two picture bands in a row, with the closing band immediately after,
turned the end of the page into wallpaper. The form sits on white and the
photograph does its work once.

### The enquiry

One form, both audiences: the first field is whether this is private or for
work, and it changes the first line of the message rather than the fields, so
nobody has to fill in a different form to ask the same question.

On send it opens a prefilled WhatsApp message to the first events number, and
the confirmation offers the second number and an email copy, so a missed
message is not a lost enquiry. Set `eventEndpoint` in `main.js` and the same
details are also posted quietly to an inbox or CRM.

`main.js` now exposes its config as `window.CCH_CFG`, and `events.js` reads
the WhatsApp numbers from there rather than keeping a second copy. They cannot
drift apart.

### Things to confirm

| | |
|---|---|
| The Scarlet Room figures | **The conference package PDF and the fact sheet disagree.** The PDF says 650 sq ft, a long table for 15, classroom for 20 and theatre for 25 to 30. The fact sheet says 625 sq ft, boardroom 25, classroom 25, theatre 30. The page and the structured data both print the fact sheet's figures, because that is what the rest of the site uses. One of the two documents needs correcting, and whichever wins should be changed in both places at once. |
| The TikTok handle | The films link to Instagram and to `tiktok.com/@colombo_court_hotel`, given by the client. It is **not in the footer yet**, where Instagram, Facebook and Tripadvisor are; adding it there is a change to every page and is worth doing in one pass. |
| Grape Expectations | No capacity has ever been published for it. The page describes the room and its hours without a number, and it is deliberately **left out of the structured data**, because a guessed capacity in schema is worse than none. Send a number and it goes in. |
| The Loft | The fact sheet says 45 seated but only 30 for drinks, which is the wrong way round for almost every room. Both figures are printed as given. Worth checking. |

The brief for this page asked for Grape Expectations and the Loft, both of
which an earlier instruction had ruled out. The later instruction wins and
both are on the page.

### Contrast

Measured on every band, including the dark one and the player.

| | Worst reading | |
|---|---|---|
| Hero | **9.7:1** | the ceremony photograph is lamplit and dark |
| Reel captions | **10.2:1** | measured on the real pixels under the gradient |
| The dark band and the player | **10.0:1** | white and pale grey on charcoal |
| The size cards | **6.0:1** | the small grey room labels, the lowest on the page |
| The closing band | **6.7:1** | measured on the real pixels of the courtyard at night |
| The two documents | **6.7 to 16:1** | the lowest is the small label over each name |
| Everything else | **5.5 to 16:1** | |

Three failures were caught and fixed during the build. The form legend and the
form hint were written in a light-ground grey and put on the dark enquiry
card, where they measured **2.85:1**; they take the card's own label colour
now, at 6.3:1. The day-and-time labels in the three-occasions section and the
room labels on the size cards both landed at 4.6 to 4.9:1 on their warm
grounds, which passes and passes narrowly; both are darker now, at 5.7 and
6.0:1.

A fourth thing was caught by measuring rather than looking: the day-and-time
label was losing its size and spacing to an older `.three__i p` rule of higher
specificity, so it was rendering at body size. That is the recurring lesson on
this site, and it is why every check here is a number.

## The Our Story page  ·  /our-story/

Six chapters, numbered One to Six, each holding a screen, read in order. The
numbers are there because this genuinely is a sequence, which is the only
reason to number anything.

### The spine

Everything on the page is one argument told six ways: **the hotel is made of
things that were kept.** Five buildings kept rather than demolished. Brick
kept, timber kept, tractor seats kept. Scrap metal kept and grown into a tree.
Carbon kept out of the air. Rooms all different because the buildings were.

That spine is why the page holds together as a read rather than a list of
facts about a hotel, and it is why the closing chapter can say *thirty-one
rooms, and the same faces* without it sounding like a service promise: by then
it is the sixth instance of the same idea.

### The hero

The scrap steel sculpture in the atrium, shot from below against the glass
roof, rather than the front door. It is the most distinctive thing on the
property, it is made of rubbish, and it states the page's argument in one
picture before a word is read.

It is also the hardest hero on the site to make legible: a bright skylight
occupies the upper half. The wash was rebuilt for it and then **every text
element was measured against the real pixels underneath it**, not against the
frame: breadcrumb 6.6:1, headline 12.9:1, standfirst 14.5:1, buttons 18.4:1.

The hero text sits at **exactly** the same height as /events/ and /stay/,
measured to the pixel at 1440 by 900: crumb at 444, title at 493, buttons
ending at 819.

### Where the facts came from

Almost all of the story is from the hotel's own **Brand Book**, which is the
first document on this site to name the architect and the artist:

| | |
|---|---|
| Five buildings | The property is an amalgamation of five abandoned buildings and old houses, joined rather than cleared |
| Sunela Jayewardene | The environmental architect who designed it |
| Prageeth Manohansa | The Sri Lankan sculptor whose scrap metal work stands through the hotel |
| Salvaged brick, reclaimed timber, tractor seat stools | The material list |
| Luxury Green Hotel, Indian Ocean | World Luxury Hotel Awards, from the 2026 Fact Sheet |

Both people are in the structured data as `Person` nodes linked from the page
by `mentions`, because an answer engine asked *who designed Colombo Court*
should be able to find the name attached to the building rather than infer it.

### Four things the documents disagree about

Writing this page meant reading the Brand Book properly for the first time,
and it does not agree with the rest of the site. **Nothing below has been
guessed and nothing has been quietly changed.** These need a decision.

**1. Five old buildings, or two office buildings.**
The Brand Book says the hotel is "an amalgamation of five abandoned buildings
and old houses". Four places on this site say it was two office buildings:

- `/events/index.html` (the Why us paragraph)
- `/blog/what-carbon-neutral-actually-means/`
- `/blog/why-our-rooms-face-inward/`
- `/blog/eco-friendly-hotels-in-colombo/`

The Our Story page follows the **Brand Book**, because it is the client's own
document and it is specific. The other four have been left alone rather than
rewritten on one document's word. If the Brand Book is right, all four need
changing, and *Why our rooms face inward* needs more than a phrase swapped:
its whole argument rests on office windows facing the street.

**2. 2011 or 2014 for the certification, and 2012 for the build.**
The site says CarbonNeutral since 2011, South Asia's first city hotel, which is
also what the previous website said. The Brand Book says built in 2012 and
certified "since 2014". A hotel cannot be certified a year before it is built,
so at least one of those dates is wrong. The Our Story page keeps **2011**,
because that is what the rest of the site and the old site both say, and it
deliberately **gives no build year at all** rather than print a pair of dates
that contradict each other.

**3. Thirty-one rooms or thirty-two.** *Resolved: 31, confirmed by the client.*
The Brand Book's 32 is out of date. The site already says 31 everywhere.

Items 1 and 2 are with the hotel's Directors. Until they answer, leave the
four "two office buildings" pages and the 2011 date as they are.

**Water bottles.** The client confirmed that plastic bottles are sometimes
used when the glass bottling cannot keep up with demand. So no page may claim
zero plastic. The Our Story facts row no longer does (it shows local produce
instead), the Our Story paragraph says glass *wherever we can*, and the blog
post *What carbon neutral actually means* no longer says "ours is zero".

**4. A photograph in the image library says COLOMBO COURTYARD.**
`Colombo Court Images/Ambience/461024_393773713985819_2050305530_o.jpg` is a
dusk shot of the building from the street with a sign reading *Colombo
Courtyard*. It is a good archival photograph and it was **not used**, because
a former name on a sign would confuse a guest. Worth knowing it is in there.

### A naming trap worth recording

The first version of this page used `.story__*` for its classes. The homepage
already has a `.story` band, defined in **v2.css**, which loads after
pages.css and therefore wins. Nothing errored; the new page would simply have
inherited a full-bleed dark treatment meant for a different section. The
classes are `.chap__*` now. **Check both stylesheets for a class name before
using it, not just the one you are writing in.**

## The Facilities page  ·  /facilities/

The page reads in the order a stay happens, so the structure is the story:
**arriving, settling in, mornings, the quiet hours, the practical things**,
then the questions.
Each chapter holds a screen. The chapter marks are the stage of the stay
rather than numbers, because the stage is the information.

### Why it is built like this

A facilities page is usually a grid of forty icons, which is complete and
unreadable. This one is written to be read top to bottom, so a guest ends up
knowing what the stay will be like rather than holding a list. Hours sit on
the cards they belong to, the quick questions are answered at the end, and an
answer engine finds every published hour in the structured data.

The shared chapter styles (`.chap__*`, `.split`) come from Our Story. New
components: `.kit` (the in-room list, plain text because /stay/ already has
the icon grid), `.facil` (the pools and gym, on a subgrid) and `.svc` (the
practical things, on a subgrid).

### Where the facts came from, and what is deliberately not said

Hours come from the **2026 Fact Sheet**, page 6: lap pool and jacuzzi 07:00 to
20:00, gym 07:00 to 20:00. The Court Spa's 10:00 to 20:00 is from /wellness/.
Airport distance and time, parking, check-in and check-out, the in-room list,
the pillow types, and which rooms have a bath, a Dolce Gusto and an iron are
all from the Fact Sheet's room table.

Nothing is stated that no document states. In particular the page does
**not** give:

| Not stated | Why |
|---|---|
| The price of an airport transfer | Not published; the page says the fare is confirmed at booking |
| Laundry turnaround | Not published; the page says we will tell you when it can be back |
| Plunge pool hours | The Fact Sheet gives hours for the pool and jacuzzi only, so the plunge pool card says *Beside the spa* |
| Library, concierge and in-room dining hours | Not published |
| The number of parking spaces | Not published |

Send any of these and they go in, including into the structured data.

### Structured data

`WebPage`, `BreadcrumbList`, the `Hotel` (same `@id` as the homepage) with
fifteen `amenityFeature` entries, and `FAQPage`. Where hours are published the
feature carries them as `hoursAvailable`, so an answer engine asked *what time
does the pool open at Colombo Court* has the answer attached to the pool
rather than buried in a paragraph. The ten questions are lifted from the page
by the build script, so the visible answers and the structured ones cannot
drift.

### The library band

It started as flat charcoal with two buttons. The client asked for something
with the feeling of the room instead, so the band is now the library in
colour and texture rather than a picture of it:

- a **walnut** ground, darkening from top left to bottom right
- a warm pool of **lamplight** behind the photograph
- a fine **paper grain** over everything, an inline SVG noise filter, so it
  costs no request (the CSP already allows `data:` images)
- a soft **vignette**, and a **brass hairline** top and bottom like the edge
  of a shelf
- the photograph hung like a framed print, with a brass line set off it

Text colours moved warm to match: cream paragraphs, a brass chapter mark.
Because the texture is layered, contrast was measured against the **lightest
colour the layers can produce** at every sampled point, with the grain
assumed at full strength and the darkening vignette ignored. A paragraph would
still read at 7.0:1 even at the brightest spot in the whole band.

The buttons went and the space went to reading: the library's size, and a
paragraph about Grape Expectations for when the quiet hour runs into the
evening. The spa and the wine lounge are linked inline in the text instead.
The band holds its screen with 10px to spare at 1440 by 900.

### At a glance, and why it was cut

The first build ended with a list of every facility and its hours. It repeated
the cards above it almost line for line, and the client asked whether it was
needed. It was not: the hours are on the cards, the questions at the end
answer the common ones, and the structured data carries every published hour
for answer engines. It went.

Two knock-on changes. The *behind the walls* sustainability note moved up to
close the practical things, and the questions band changed from linen to
white, because without the list between them two linen bands would have sat
next to each other.

### Four things measuring caught

| | Found | Fixed |
|---|---|---|
| Mornings | four portrait cards plus a heading ran **35px taller than a 900px screen** | the pictures go square on wide screens; the band now fits with 40px to spare |
| Hero | the text sat **30px higher** than Events and Stay, because the standfirst ran to three lines and the block is bottom-anchored | standfirst cut to two lines; crumb and title now at exactly 444 and 493, as on the other pages |
| Mornings standfirst | three lines beside a two-line heading | shortened twice until it held two |
| Library heading | three lines | shortened to two |

### Contrast

| | Worst reading | |
|---|---|---|
| Hero | **7.0:1** | breadcrumb, on the real pixels of a lamplit window; headline 13.7:1, standfirst 14.7:1 |
| Closing band | **6.4:1** | headline on the real pixels of a sunlit pool; the line under it 7.8:1 |
| The library band | **6.7:1** | the brass chapter mark, against the lightest point the texture can make; paragraphs 8.8:1, headline 11.5:1 |
| Everything else | **6.7 to 16:1** | the lowest is the small uppercase hours over each card and the lobby caption |

### Links that now go somewhere

Every footer on the site had *Facilities* pointing at /facilities/ with a
coming-soon interceptor. All thirty have been turned into plain links. The page
is in the sitemap and in `llms.txt`, which now has a **Facilities and their
hours** section.

### Two things to confirm

| | |
|---|---|
| The spa's name | The 2026 Fact Sheet calls it **Amber Spa**, and the spa photographs show an Amber logo. The website calls it **The Court Spa** everywhere, including /wellness/. One of them is out of date. |
| The origin of the building | The 2026 Fact Sheet, page 2, says the hotel was "originally developed using repurposed office buildings". That supports the site's existing *two office buildings* wording over the Brand Book's *five old buildings and houses*, and is worth putting in front of the Directors with the rest of that question. |

## The Sustainability page  ·  /sustainability/

It has its own address rather than sitting under Our Story. It was built at
/our-story/sustainability/ first and moved at the client’s request, before it
was ever published, so there is nothing to redirect. Our Story is how the
hotel was made; this is how it is run. The footer's *Sustainability* link and the homepage's *Our approach* button both go straight to it, and it is in the
sitemap and in `llms.txt`.

### The spine

The headline is **A lighter footprint, year after year.** (Two earlier
versions were turned down: *Counted, not claimed* was too clipped, and *A
lighter footprint in the heart of Colombo* ran to three lines and lifted the
hero text 74px above every other page.) Every chapter
moves one step further out, from the certificate to the beach:

| Chapter | Ground | What it covers |
|---|---|---|
| The certificate | white | CarbonNeutral since 2011, South Asia's first city hotel, measured again every year, and the honest order of work: measure, reduce, offset what is left |
| The building | linen | the buildings kept, salvaged brick, reclaimed timber, tractor-seat stools, scrap-metal sculpture, the living wall on the tower |
| Sun, rain and shade | white | solar-heated water, rainwater harvesting, water recycled to the garden, LED lighting, the courtyard as the cooling system |
| What leaves the building | linen | water bottled in glass (and the honest note about plastic), waste weighed, recycled paper, the towel card |
| Beyond the gate | forest texture | plant giveaways, beach clean-ups, buying locally |

### What it deliberately does not say

- **What the buildings used to be, or how many.** That question is with the
  Directors. The page says only that the buildings on the corner were kept
  and joined.
- **A build year.** Same reason.
- **Zero plastic.** Plastic bottles are used in weeks when the glass bottling
  cannot keep up, and the page says so in plain words.
- **Anything specific about the plant giveaways and beach clean-ups.** No
  document or photograph gives dates, places, partners or numbers. They are
  described in general terms only. Send photographs and details and they go
  in, with a picture in the forest band.

### The forest band

The same idea as the library band on /facilities/, in a different key: a deep
forest ground, three soft pools of light as if through a canopy, a fine grain
(an inline SVG, no request), a vignette and a pale green hairline top and
bottom. Contrast was measured against the lightest colour the layers can make
at every sampled point: the small green chapter mark is lowest at 6.2:1, the
paragraphs 8.7:1, and a paragraph would still read at 6.8:1 at the brightest
spot anywhere in the band.

### A correction this page forced

Photographs in the image library show a card in the bathrooms: *We care about
the Environment*, towels fresh on arrival, a towel on the floor is changed.
Two blog posts had said the hotel has **no** towel card, and one called towel
cards "a laundry saving dressed as a moral position". Both were wrong about
this hotel and have been corrected, in the source file, the built pages, the
blog listing, its search index and the RSS feed.

### Contrast

| | Worst reading | |
|---|---|---|
| Hero | **7.2:1** | breadcrumb, on the real pixels of a blue sky and leaves; headline 15.0:1 |
| Closing band | **7.9:1** | headline on the real pixels of the courtyard pool |
| Forest band | **6.2:1** | the green chapter mark, worst case |
| Everything else | **6.0 to 16:1** | the lowest is the caption under the sculpture |

### A site-wide fix made at the same time

Following a link to part of a page, such as /events/#sp-grape, landed the
target under the fixed header, and a web font arriving a moment later could
push it further. Two changes, both site-wide:

1. `scroll-padding-top: 6.5rem` on `html` in styles.css, so every jump to a
   section leaves room for the header (74px on desktop, 61px on a phone).
2. A short block in main.js (15b) that lines the target up once more when the
   fonts are ready and again on load, unless the visitor has already started
   scrolling.

## The Experiences page  ·  /experiences/

A guide to Colombo from the hotel's front door. The homepage already
promised six guides as cards; this page delivers all six on one address, each
as its own section, and the cards now link straight to them:

| Homepage card | Lands on |
|---|---|
| 48 Hours in Colombo | `/experiences/#48-hours-in-colombo` |
| Where We Eat | `/experiences/#where-we-eat` |
| Art &amp; Culture | `/experiences/#art-and-culture` |
| Where We Shop | `/experiences/#where-we-shop` |
| Colombo After Dark | `/experiences/#colombo-after-dark` |
| Hidden Colombo | `/experiences/#hidden-colombo` |
| Discover Colombo (button) | `/experiences/` |

The nav and footer *Experiences* link on every page went from the homepage
section to this page (32 files, plus the chrome template).

### Why one page rather than seven

Seven thin pages would each have had a few hundred words and would have
competed with each other in search. One substantial page answers the queries
people actually type, *things to do in Colombo*, *where to eat in Colombo 3*,
*Colombo at night*, and each section still has its own shareable address. The
blog carries the long versions and every section links to the right post, so
the page is a hub rather than a duplicate.

### Thinking like the three readers

- **The guest** gets a plan they can follow: a numbered two-day order, short
  lists rather than essays, and the practical things that ruin a day if
  nobody mentions them (temple dress, Poya days, metered tuk-tuks).
- **The hotel** is woven in where it genuinely belongs, not bolted on: Cloud
  Café as the end of the evening, Amber Poolside for breakfast and high tea,
  the spa for the afternoon, the concierge for the things not on any list.
- **Search and answer engines** get the places as an `ItemList` of
  `TouristAttraction` entries and nine questions as `FAQPage`, lifted from the
  visible text by the build script so they cannot drift.

### What it deliberately does not say

- **No walking times.** The blog posts say Independence Square and Galle Face
  Green are fifteen minutes on foot. From 32 Alfred House Avenue that looks
  optimistic, and no document confirms it. This page says only that
  everything is a short tuk-tuk ride. Worth checking the blog posts against a
  map before launch.
- **No opening hours, prices or phone numbers for other businesses**, in the
  text or in the structured data, because those go stale. The only hours on
  the page are the hotel's own bars, from the 2026 Fact Sheet.
- **The places named are long-established.** Barefoot, Paradise Road, Laksala,
  Ministry of Crab at the Dutch Hospital, Number 11 and the Lionel Wendt are
  all well known, but none of them is the hotel's. **Have someone on the team
  confirm they are all still open and as described before launch**, and check
  that Number 11 still takes visits by appointment.

### Contrast

| | Worst reading | |
|---|---|---|
| Hero | **7.8:1** | breadcrumb, on the real pixels of the city lights; headline 13.7:1 |
| Closing band | **6.4:1** | headline on the real pixels of the rooftop by day |
| After dark band | **8.0:1** | pale grey on charcoal |
| Everything else | **6.0 to 16:1** | the lowest is the small uppercase day label on the plan and the photo captions |

### A repair made at the same time

Adding the Experiences line to `llms.txt` with a one-line Perl edit that did
not declare UTF-8 double-encoded every accent and dash already in the file:
every accent and every dash already in the file was garbled into two or three
stray characters, in 23 places. All 23 were decoded back. **Any edit to a text file on this site must
read and write it as UTF-8** (`perl -CSD`, or explicit `:encoding(UTF-8)`
layers), and should be followed by a scan for mojibake.

## Measurement: GA4, Clarity, Meta Pixel and the Conversions API

Nothing that measures or advertises loads until a visitor presses *Accept all*.
After that, every tool whose ID is set starts, and one function counts each
named action in all of them. The IDs go in **one place only**:
`assets/js/main.js`, `CFG.tags`.

| Setting | Where to find it |
|---|---|
| `ga4Id` | Google Analytics > Admin > Data streams > Measurement ID (`G-...`) |
| `clarityId` | Microsoft Clarity > Settings > Setup > Project ID |
| `metaPixelId` | Meta Events Manager > Data sources > the pixel > Pixel ID |
| `linkDomains` | SiteMinder's booking domain once it is live, so GA4 follows a guest into the booking |
| `capiEndpoint` | leave as `/api/meta-capi.php` |

### The named actions

| Action | GA4 event | Meta event | Counted where |
|---|---|---|---|
| Book now, a room's Book button | `booking_click` | InitiateCheckout | main.js, pages.js |
| WhatsApp opened | `whatsapp_click` | Contact | every wa.me link |
| Phone tapped | `phone_click` | Contact | every tel: link |
| Email clicked | `email_click` | Contact | every mailto: link |
| Directions | `directions_click` | FindLocation | Google Maps links |
| Menu opened | `menu_open` | ViewContent | the menu reader |
| Offer clicked | `offer_click` | OfferClick (custom) | links to #offers and #whats-on, or `data-offer` |
| Film opened | `video_open` | VideoOpen (custom) | the Events films |
| Enquiry, table or spa request sent | `generate_lead` | Lead | the three forms |
| Newsletter | `sign_up` | CompleteRegistration | footer form |
| Reading depth, gallery, social | `scroll_depth`, `gallery_open`, `social_click` | none | GA4 and Clarity only |

Every event carries `placement` (header, phone_menu, phone_bar, footer, hero,
closing_band or the section id), so a report can tell a WhatsApp press in the
header from one in the footer. In GA4 mark `booking_click`, `whatsapp_click`,
`phone_click` and `generate_lead` as key events, and register `placement`,
`room`, `offer` and `menu` as custom dimensions, or GA4 will not show them.

### Meta: pixel and Conversions API together

Each Meta event is sent twice with one event ID: by the pixel in the browser
and by `api/meta-capi.php` on the server. Meta counts it once, and still gets
it when an ad blocker or Safari stops the pixel. The relay accepts only this
site, only the events above, only after consent, and at most 120 events a
minute per visitor. It sends the event, the page, `_fbp`/`_fbc`, IP address
and browser type; never a name, email or phone number.

**The access token never goes in main.js.** On Hostinger, make a folder
`cch-private` beside `public_html`, copy `api/meta-capi-config.sample.php`
into it as `meta-capi-config.php`, and fill in the pixel ID and token.
`.htaccess` refuses any `meta-capi-config*.php` inside the site. There is no
PHP on the build computer, so the relay has not been run: test it on Hostinger
with the code from Events Manager > Test events (events marked "Server").

Measured in the browser with the real tools replaced by recorders: before
consent nothing loaded (not even the YouTube stand-in); after *Accept all*
GA4 received consent and config, Clarity its consent signal, Meta its init and
PageView; and WhatsApp, phone, email, directions, Book now, a room button and
an offer each reached all three, with the pixel and the server copy sharing
one event ID. *Essential only* revokes all three and removes their cookies.

The Cookie Policy lists what this now sets (GA4, Clarity including `CLID` and
`MUID`, `_fbp`, `_fbc`) and explains Clarity's recordings and the Conversions
API. Check the table against the live tools before launch.

### Fixed on the way

- `loadTags()` read `window.CCH_CONSENT_TAGS`, but every page set
  `window.CCH_TAGS`, so no tag would ever have loaded. Both are gone; the IDs
  live in `CFG.tags`.
- The YouTube stand-ins mounted after 1.2 seconds whatever the cookie answer
  (and read the wrong storage key). They now wait for consent.
- pages.js had its own `track()` that ignored consent, and counted WhatsApp
  separately. One function now, in main.js.

## Where you are in the navigation

main.js marks the link to the current page with `aria-current="page"` in the
header, the phone menu and the footer, on every page including ones built
later. The header draws a 2px rule under it, the phone menu shows it in brass
with a short rule (9.1:1 on the menu), the footer underlines it.

## Cross-browser and cross-OS fixes

Audited against Safari/iOS 15.4+, Chrome, Edge and Samsung Internet from 2022,
Firefox 100+, on macOS and Windows.

| Problem | Who saw it | Fix |
|---|---|---|
| Menu PDFs blocked | everyone | CSP `frame-src 'self'` |
| Offer and treatment cards out of order | Safari 15, Chrome before 117 | subgrid rules behind `@supports` |
| Old CSS/JS for a year after a deploy | returning visitors | `?v=20260911` on every CSS and JS link |
| Full-screen bands collapse | Chrome before 108, Firefox 100 | `vh` line before every `svh` |
| Sticky columns do not stick | Safari 15 | `overflow-x` removed from `body` |
| Page scrolls behind menu, lightbox, menu reader | everyone, most on iPhone | lock set on `html` too |
| Logo and buttons under the notch | iPhone in landscape | `env(safe-area-inset-*)` |
| Pale system select box | Safari on Mac | `appearance:none` with a drawn chevron |
| Short, centred date and time fields | iPhone | iOS-only rule |
| Blank PDF in a frame | Android, iOS | menus open in their own tab on touch screens |
| Scroll cue and day/night button off centre | Chrome 100-103 | `transform` instead of `translate` |
| No blur | Safari before 18 | `-webkit-backdrop-filter` |
| Zoom stuck after a tap | iPad | picture zooms inside `@media (hover:hover)` |
| Heavier text in Firefox on Mac, grey tap flash, page jump on Windows | | smoothing, tap colour, `scrollbar-gutter:stable` |

**When CSS or JS changes, change `?v=20260911` in every page** (one find and
replace across the folder).

## Every page at ten widths

All 36 pages, including the new 404, were loaded at 320, 375, 414, 768, 1024,
1280, 1366, 1440, 1920 and 2560 pixels and checked for sideways overflow,
anything past the screen edge, clipped headings, missing images and the header
navigation colliding or wrapping. The navigation fits on one row from 1024px
and hands over to the menu button below that. Three real faults were found and
fixed:

- **Homepage, every width up to 1280px:** the "Colombo, our way" band is a grid,
  and its content would not shrink below the looped rail (twelve cards), so the
  heading, the lede and the rail itself ran off the side of a phone.
  `.sec--exp>*{min-width:0}`, and `.sec--exp>.railwrap{width:100%}` because its
  auto side margins otherwise size it to all twelve cards.
- **GDPR, Privacy and 404 at 320px:** email and web addresses could not wrap.
  `overflow-wrap:anywhere` on clause text and the facts band.

## SEO housekeeping

- Descriptions on the ten main pages, the blog and the four legal pages cut to
  143-158 characters, so Google shows them whole.
- A 404 page (`/404.html`, noindex) with the same header, hero and footer, and
  `ErrorDocument 404` switched on in `.htaccess`.
- Every sitemap entry now has a `lastmod`; `/api/` is disallowed in robots.txt.
- Still worth doing: several blog post titles run past 60 characters and
  their descriptions past 160 (edit `blog/_src/posts.txt` and rebuild).

## Testing in Safari's engine and Edge

The site is tested with Playwright in **WebKit** (the engine inside Safari on
Mac, iPhone and iPad) and **Microsoft Edge**. It covers every page in the
sitemap plus a real 404, as an iPhone, an iPad, a Mac at 1440, an Android
phone at 320 and a laptop at 1280. It checks layout, images, fonts and
script errors, then eleven behaviours: the cookie banner, carousel, phone
menu, current-page marker, menu reader, room gallery, Events films, FAQ,
legal contents links, select boxes, and the whole tracking chain after consent.

- Tools (outside OneDrive and outside this folder, never uploaded):
  `C:\Users\User\AppData\Local\cch-tools\` holds portable Node.js 24 LTS and
  the test script `site-tests\run.mjs`. Playwright's browsers are in
  `%LOCALAPPDATA%\ms-playwright`.
- Report: `Desktop\Claude\site-tests-report\report.html`, with screenshots.
- Run again, from Git Bash:

      export PATH="/c/Users/User/AppData/Local/cch-tools/node-v24.21.0-win-x64:$PATH"
      cd /c/Users/User/AppData/Local/cch-tools/site-tests
      SITE_ROOT="<path to colombo-court>" OUT_DIR="<path to site-tests-report>" node run.mjs

**Firefox could not be tested on this computer.** Playwright's Firefox
build stops at start-up with a Windows side-by-side error (`mozglue`
assembly), even from a fresh download. Smart App Control is off, no
code-integrity block is logged and the Visual C++ runtimes are installed.
Check Firefox on another computer, or with a cloud browser service.

## Marketing tools (not part of the website)

`Desktop\Claude\marketing-tools\` sits beside this folder and is never uploaded:

- `utm-builder.html`: campaign link builder, plus the URL parameters line for Meta Ads.
- `looker-studio-dashboard.md`: the six-page dashboard, chart by chart.
- `SETUP-GUIDE.md`: GA4, Clarity, Meta Events Manager and the Conversions
  API, Pixel Helper, Tag Assistant, Search Console, Bing Webmaster Tools and
  Google Business Profile, with the launch-day order.

## The legal pages  ·  /terms-and-conditions/  /privacy-policy/  /cookie-policy/  /gdpr-compliance/

All four footer links now open pages with the same header, full-screen hero
and footer as the rest of the site, with no differences. The header starts
transparent over the photograph and turns solid on scroll, as on
/experiences/, and the header and footer markup is byte-identical to that page
(checked), apart from `aria-current` on the footer link of the page you are
on. The old legal layout (no hero, a solid cream header, text in a 52rem
column) is gone from `pages.css`; the new one is section 26 of `v2.css`.

### Built from one script

`legal-build.pl` (scratchpad) writes all four pages from the shared chrome in
`blog/_tpl/`. Each clause is written as

    @@ id | label in the contents | heading

so the contents list, the numbering and the section ids are generated
together and cannot drift apart. `@@!` gives a clause the full width (the
cookie table). To change the wording, edit the script and run it again rather
than editing the four pages by hand.

### The layout: the full width, without long lines

| Band | What it holds |
|---|---|
| Hero | photograph, breadcrumb, two-line heading, two-line standfirst, a button into the document and *Ask us on WhatsApp* |
| Facts and contents (linen) | who the document applies to, when it was updated, who to ask; the numbered contents in three columns |
| The document (white) | one row per clause: number and heading on the left (5 of 12 columns, staying in view while its clause is read), text on the right (7 of 12) |

At 1440 the text column is 706px, about 74 characters a line, so the page uses
its whole width without any line running too long to read. The cookie table
takes the full 1,282px. Below 1100px each clause stacks, heading above text;
on a phone the table scrolls inside itself and nothing else moves sideways.

Hero photographs, none used anywhere else on the site: the lobby (Terms), the
arched door over the courtyard pool (Privacy), the lounge (Cookies) and the
green wall sign at the entrance (GDPR), as `lg-*-hero-900/1400/1900.jpg`.

### Measured

- hero text at crumb 444, title 493 at 1440x900 on all four, as on every other page
- worst pixel under the hero text, over photograph and scrim: breadcrumb 5.87:1, heading 12.95:1, standfirst 14.56:1
- flat colours: the lowest pair is the crimson hover on linen, 5.32:1; body text 9.62:1
- JSON-LD valid on all four; every contents link resolves; no duplicate ids; link audit clean
- no horizontal overflow at 375, 1024 or 1440

### The wording: the hotel's own, plus the owner's decisions

Terms and Privacy are the hotel's published text from the previous website,
moved across with British spelling, obvious typing slips corrected, ranges in
words and links added. The decisions given on 11 September 2026 are applied
across the whole site, not only on these pages:

| Point | Now reads | Where |
|---|---|---|
| Early check-in, late check-out | subject to availability and chargeable | Terms, homepage FAQ, /stay/ (FAQ and note), /facilities/ (FAQ, Arriving text and fact card), llms.txt |
| Carbon neutral | South Asia's first city hotel certified CarbonNeutral | Terms, homepage, /our-story/, /sustainability/ (meta, JSON-LD, hero, facts, FAQ), the blog posts, blog index, feed and blog source, llms.txt |
| Booking engine | SiteMinder (eMarketingEye removed) | Privacy Policy, Cookie Policy (booking a room), GDPR page (booking a room, who else sees it) |
| Data controller | Colombo Courtyards (Pvt) Ltd, trading as Colombo Court Hotel & Spa | GDPR page, matching the Privacy Policy |

The old `.html` addresses are still redirected in `.htaccess` in one hop.

### Still open

| | Legal text says | The rest of the site says |
|---|---|---|
| Check-out | 11:00 | 12:00 noon (2026 Fact Sheet); the owner will confirm |
| Cancellation | Terms: 24 hours. Privacy: 7 days from 20 December to 5 January, 48 hours otherwise | not stated |
| Spa name | Privacy: Amber Spa | The Court Spa |
| Consent to cookies | Privacy: "by using the Site, you consent" | nothing runs until you accept |

The GDPR page still needs its legal read and three details (a named contact,
the retention period under Sri Lankan tax law, the processors in the
reservation chain); the note is an HTML comment at the foot of that page. The
cookie table must be checked against the real Tag Manager container before
launch.

### Films and cookies

The YouTube films are stand-ins. Once they are replaced with video files
hosted on this site, they play whether or not a visitor accepts cookies: a
file served from our own domain sets no cookie and sends nothing to anyone
else. At that point remove the `data-yt` placeholders, the YouTube entries in
the Content Security Policy and the *Films* paragraph in the Cookie Policy.

### A bug found while writing the Cookie Policy

`pages.js` and `v2-home.js` check `localStorage['cch-consent'] === 'all'`
before mounting a YouTube film, but the banner stores its choice under
`cch-consent-v1` as `{ value, exp }`. So after a reload, a visitor who accepted
never sees the film. It is left as it is because both YouTube films are
temporary and come out before launch. If a film ever stays, read the consent
through the same function the banner uses.

### Fixed on the way: two `<main>` elements

Our Story, Facilities, Sustainability, Experiences and the first build of the
legal pages each opened `<main id="main">` twice, because the shared chrome
already opens it and each page build opened it again. The duplicate is gone;
every page now has one `<main>` and one `</main>`.

## The homepage guides carousel now loops

"Colombo, our way" used to run to its last card and jump back to the first.
It is now a continuous loop, built the same way as the Eat & Drink sliders: one
copy of the six cards is appended (hidden from screen readers, out of the tab
order, images still lazy), and whenever the scroll passes the start of the
copy it is moved back by exactly one set, which lands on identical pixels.

Measured, all five moves land where they should: forward from the last card
onto the copy of the first; forward again folds back and moves on; back from
the first card, and from anywhere inside it, steps round to the last; and back
from half way into the copy folds first. The first version of the loop missed
that last case and would have stopped at the first card; measuring caught it.

## Photography

Every image is the real hotel, sized and compressed from the originals in
`Desktop/CCH Images` and `Desktop/Colombo Court Images`. Blue-hour and night
frames were desaturated to about 0.75 so page and photography read as one
place. When the new shoot arrives, replace files in `assets/img/` keeping the
same names and widths and nothing else needs to change.

---

## Placeholders to replace before launch

Every one of these is marked in the source with `[PLACEHOLDER]`,
`[INTEGRATION]` or `DEPLOY STEP`.

| Where | What | File |
|---|---|---|
| `CFG.bookingUrl` | The live booking-engine URL and its query keys. It currently points at the hotel's existing eZee/IPMS link, unverified. | `assets/js/main.js` |
| `CFG.eventEndpoint` | Optional. Set it and the event enquiry is also posted silently to the hotel's inbox or CRM, alongside the WhatsApp message. | `assets/js/main.js` |
| `CFG.brevoEndpoint` | Brevo. Either the hosted-form URL on the `<form action>` or an endpoint that posts to Brevo API v3. Field names already match Brevo defaults: `EMAIL` and `OPT_IN`. Keep double opt-in on for EU visitors. | `assets/js/main.js`, `index.html` |
| `gtmId` | Google Tag Manager container ID. | `index.html` head |
| `metaPixelId` | Meta Pixel ID. | `index.html` head |
| `og:image`, `og:url` | Absolute URLs. Patch at deploy. | `index.html` head |
| Reviews | Six placeholder reviews ship as the fallback. See "Tripadvisor" below. | `index.html` §09 |
| Room count | The brief says 31 rooms; Booking.com lists 32 including 15 suites. The page and the schema both say 31. Confirm. | `index.html` |
| Rating | "4.9 from 2,400+ reviews" in the reviews stamp is illustrative. Confirm the real figures. | `index.html` §09 |
| Opening hours | Breakfast opens at 07:00, as confirmed by the hotel; the 10:30 close is still unconfirmed. Lunch from 12:30, high tea, and Cloud open daily to 23:30 are as briefed. | `index.html` §04 |
| Room sizes | Settled from the 2026 fact sheet: 475, 704, 475, 320, 275 and 275 sq ft. | `stay/index.html` |
| Social URLs | Facebook, Instagram and LinkedIn handles are inferred from the brand name. Confirm each. | `index.html` footer and schema |
| Subpages | Every `data-soon` attribute is an interim router. See below. | `index.html`, `assets/js/main.js` |
| Hero film | A real clip is in place: `assets/media/hero.mp4` (landscape, 2.6 MB) and `assets/media/hero-portrait.mp4` (phones, 1.8 MB), cut from the hotel poolside footage. Replace both with the commissioned shoot and re-cut `hero-still-*.jpg` from frame one of each so the poster keeps matching. | `assets/media/` |

**GDS codes are live, not placeholders.** Amadeus `CMBCCO`, Sabre `219123`,
Apollo/Galileo `F3389`, Worldspan `CMBCC`, taken from
`colombocourthotel.com/gds.html`.

### The `data-soon` links

Links to `stay/`, `eat-drink/`, `wellness/`, `experiences/…` and `our-story/`
already carry their real future URLs. Until those pages exist, one block in
`main.js` intercepts them: `data-soon="book"` opens the booking engine
(right for room links), anything else scrolls to the matching section.

**Delete that block the day the subpages ship.** The markup needs no other
change. It is labelled `[DELETE THIS BLOCK]`.

Three legal pages are linked and must exist before launch:
`terms-and-conditions/`, `privacy-policy/`, `cookie-policy/`.

### The event enquiry and WhatsApp

On send, the form validates, then opens a prefilled WhatsApp message to
**+94 77 005 8779** containing name, contact number, email and the enquiry.
The success panel then offers a second button for **+94 77 208 9230** and an
email copy to `reservations@colombocourthotel.com`. Both numbers live in one
place, `CFG.eventsWhatsApp`.

The WhatsApp window is opened inside the click handler, so no browser treats
it as a popup. If a visitor has WhatsApp blocked, the two buttons in the
success panel still give them a way through.

### Tripadvisor reviews

The slider reads `window.CCH_REVIEWS` if a feed has set it, otherwise it uses
the markup in the page. Set it before `main.js` runs:

```js
window.CCH_REVIEWS = [
  { stars: 5, text: "…", name: "Helena R.", meta: "London · March 2026" }
];
```

Three to ten entries all work. The slider drops anything under 5 stars, keeps
the first ten in the order it is given, and builds its own dots and rotation.
Keep the in-page markup as the fallback for when the feed is down and for
visitors with JavaScript off.

**What the page does and does not do.** It rotates on its own every 7 seconds,
pauses on hover, focus and off screen, and shows only 5-star entries. It
cannot reach Tripadvisor by itself: Tripadvisor has no public review API, so
something has to fetch the reviews and set `window.CCH_REVIEWS`. Two ways to
do that, both a small job for the developer who deploys the site:

1. **A scheduled job.** A cron task or serverless function pulls the reviews
   through the Tripadvisor Content API (or a licensed aggregator such as
   Elfsight, Trustindex or Reviews.io), keeps the newest ten that are 5 stars,
   writes them to a small JSON file, and the page loads that file. Newer
   reviews push out older ones automatically because the job always writes the
   current top ten.
2. **A widget script.** Any of those aggregators also ship a drop-in script.
   That is faster to set up but styles itself, so it will not match this page.
   Option 1 keeps the design.

Either way, nothing in the markup changes.

### The photo galleries

One gallery is left, at The Court Spa. It runs the generic component: add or
remove `<img class="gal__img">` children inside the `[data-gal]` block, give
the first one `is-on`, and nothing else changes. It advances every 5.2 seconds
and pauses while a visitor hovers, focuses or swipes. Reduced motion stops it
on the first frame.

Everywhere else the photographs are now still, and the film is the only thing
in the block that moves. That was a deliberate reversal: the restaurants and
the events block briefly had a film plus two rotating frames each, and the
section stopped reading as calm. Where a picture needs to be still, use
`<figure class="frame">` inside `.msplit__stack` — it holds a 16:9 box and
crops to fill.

**No arrows, no dots.** The galleries carry no visible controls: the picture
is the whole interface. Hover pauses, swipe steps, and a visitor who has asked
their system for reduced motion gets a still photograph. The component still
builds dots from `alt` text if a `[data-gal-dots]` element is put back, so
this is a markup decision rather than a one-way door. `.gnav` survives in the
stylesheet because the Experiences rail and the review slider still use it.

**How many images.** There is no maximum in the code. Two to four per gallery
is what the shape wants — these are quiet passes, not a slideshow, and a
visitor should not have to wait a minute to see the last frame. Below two the
block becomes a plain photograph, which is the correct behaviour for a single
image. Copy the shape of the ones already there: two widths (300 / 580 for the
9:16 restaurant frames, 420 / 820 for the 16:9 events frames, 470 / 700 / 1000
for the square spa frame), `loading="lazy"`, `width` and `height`, and a real
`alt`. The `alt` is what a screen reader gets, so an empty one is a gap.

### The films

A `<video class="reel" data-reel='["a.mp4","b.mp4"]'>` plays its clips end to
end and then round again. Any number of files is fine and they play in order;
one file still loops. Nothing is fetched until the block is within 240px of
the screen, the poster is what a visitor sees until the first frame can
actually play, and the film pauses itself when scrolled away. Reduced motion
loads nothing at all and leaves the poster.

There are three clips at present, one each for Amber Poolside, Cloud Café and
events, all 9:16 and all cut from footage shot in portrait, so nothing is a
crop of a crop. They are muted, have no audio track at all, and carry no
controls, so they read as moving photographs rather than as video a visitor
has to manage. Keep replacements short (7 to 9 seconds), 9:16, 540 × 960, and
under about 1.2 MB each; re-cut the poster from frame one so the swap from
poster to film is invisible. On a phone the film box is capped at 4:5 — a
full-bleed 9:16 is 600px of one screen, which is more than any single picture
on this page has earned.

The Experiences rail is separate and uncapped: add `<article class="card">`
children and it keeps stepping four at a time, looping back to the start. The
reviews slider is the one place with a hard limit — when a Tripadvisor feed
populates `window.CCH_REVIEWS`, main.js keeps the newest ten five-star
entries. Reviews written into the markup by hand are not capped.

---

### The one thing that moves without being asked

BOOK NOW in the header carries a slow light across itself every eight
seconds: one sweep, low contrast, no scale, no colour change, no bounce. It
is `@keyframes sheen` in section 5 of the stylesheet, and it is deliberately
the only unprompted motion on the page — everything else waits for a scroll,
a hover or a press. Adding a second one costs the first its effect.
Reduced motion removes it with the rest of the animation.

## Consent, analytics and privacy

Nothing non-essential runs until the visitor chooses. The banner appears
1.2 seconds after load, stores the choice for twelve months in
`localStorage`, and only "Accept all" loads GTM and the Meta Pixel. The
footer has a "Cookie settings" button that reopens the banner.

One helper, `track(name, params)`, is used for `begin_checkout`,
`generate_lead` and `sign_up`. It is silent without consent and maps to the
right Meta event names automatically.

## Accessibility

Skip link, real landmarks, one `h1` and a clean heading order, visible
crimson focus rings, 44px touch targets under `pointer: coarse`, labelled
form fields with inline errors, `aria-live` on the review slider, and a
focus-trapped mobile menu that closes on Escape.

The photo galleries carry no arrows or dots by choice. What replaces them:
the rotation pauses under the cursor and on focus, a swipe steps it on a
phone, and `prefers-reduced-motion` stops it dead on the first frame, which
is the state a visitor who cannot tolerate movement actually needs. The
review slider and the Experiences rail keep their arrows, so nothing that
carries words is auto-only.

Measured worst-pixel contrast for the hero type over the photograph, with
every scrim layer applied and the text shadows ignored: headline 8.1:1,
subline 7.9:1, the button 9.8:1, the nav 5.9:1. Over the sustainability
photograph: headline 19.0:1, lead 16.9:1, body 13.0:1. Meta text is 5.2:1 on
the warmest canvas stop.

Reduced motion is honoured in both directions, live. Turning it on mid-visit
pins every scroll-driven element to its finished state; turning it off
re-arms them.

## Performance

The first view at 1280px is about 310 KB: the hero poster, two logos, the
fonts and the code. Films are never part of it, and neither are their
stills. A `<video poster>` is fetched the moment the element parses, whatever
`preload` says, so each film keeps its still as a lazy `<img>` underneath and
fades the video in over it. That one change took the first view from 605 KB
back to 310 KB. The hero film (2.6 MB
landscape, 1.8 MB portrait) is fetched once the poster has painted; the five
venue and event clips (2.8 MB together) are fetched only when their block
comes within 240px of the screen, and all of them are dropped entirely under
reduced motion. A visitor who reads the hero and leaves downloads none of
them. Everything else is deferred. Images carry `srcset`, `sizes`,
intrinsic `width`/`height` and `loading="lazy"` below the fold; the hero is
preloaded with `fetchpriority="high"`. One stylesheet, one script, no
third-party JavaScript before consent.

Two things to do on the server:

1. **Enable gzip or brotli.** HTML, CSS and JS are 124 KB uncompressed and
   about 26 KB compressed.
2. **Add AVIF and WebP.** No encoder was available on this machine, so the
   images ship as tuned JPEGs. Converting them and wrapping each `<img>` in
   a `<picture>` with AVIF and WebP sources roughly halves image weight. The
   markup is already shaped for it.

## CMS readiness

Nothing is baked into the JavaScript. Every editable string lives in the
HTML as its own element with a stable class:

- rooms: one `<li class="room">` each, with `.h4`, `.room__meta`,
  `.room__copy`, `.room__cta`
- venues: one `<article class="venue">` each, with `.venue__lead`, `.tags`
  and a `[data-gal]` gallery
- experiences: one `<article class="card">` each
- events: a `[data-gal]` gallery plus `.events__copy`
- reviews: one `<figure class="quote">` each, or the feed above
- hour stamps: `.stamp__t` and `.stamp__l`
- GDS codes: one `<li>` each in `.gds`

Any headless or block CMS can map onto that directly. Images are swapped by
replacing files, not by editing markup.

## Extending to the subpages

The visual language carries: the canvas light ramp, the hour stamp, the
`.sec` rhythm, the `.h2`/`.lede`/`.prose` scale, `.btn` and `.link`, the
card and room patterns, the `[data-gal]` gallery, the espresso surfaces. A
subpage is a new `index.html` in its folder that reuses
`assets/css/styles.css` and `assets/js/main.js` unchanged.

Planned architecture, already reflected in the links:

```
/                       home
/stay/                  suites · super-deluxe · deluxe · offers
/eat-drink/             cloud-cafe · amber-poolside · menus
/wellness/              spa · treatments
/experiences/           48-hours-in-colombo · where-we-eat · art-and-culture
                        where-we-shop · colombo-after-dark · hidden-colombo
/events/                weddings · meetings · private-dining
/facilities/            pool · gym · library · parking · transfers
/offers/                stay offers and dining offers, one page
/blog/                  the blog, linked from Discover in the footer
/our-story/             sustainability · design · people · gallery
/contact/
```

## Local preview

Any static server works. There is no Node on this machine, so a one-file
PowerShell server was used during the build; anything equivalent is fine.

## Homepage, version two  ·  a trial

`index.html` is running a trial palette and layout. Everything it needs lives
in two files that only it loads:

| File | What it does | Loaded by |
|---|---|---|
| `assets/css/v2.css` | redefines the tokens, so the header, buttons, footer and type follow without being rewritten; adds the new sections | `index.html` **and** `/wellness/` |
| `assets/js/v2-home.js` | the restaurant card that changes every six seconds, and the stand-in hero film | `index.html` only |

**To go back:** delete the lines in `index.html` and `wellness/index.html`
that point at them. The version-one homepage, stylesheet and script are kept
whole in `_backup-v1/`, and `robots.txt` disallows that folder so it can
never be indexed as a page.

`/stay/` and `/eat-drink/` do not load either file, so they keep the
version-one palette and the 1320px measure until they are converted too.

### The palette

Charcoal, brass, and one sage green used once. **Text is charcoal, never
green.** Green is a ground, not ink.

| Token | Value | Where |
|---|---|---|
| `--char` | `#1E1E1B` | the solid header, the dark bands |
| `--sage` | `#A3A390` | the one green. The dining band, with dark text on it |
| `--linen` | `#F4F2ED` | the light ground |
| `--paper` | `#EFEDE6` | the footer, as version one had it |
| `--brass` | `#B08A46` | rules, borders, icon strokes. Never body text |
| `--brass-ink` | `#7A5C22` | brass as text on the light ground |
| `--brass-l` | `#D8B872` | brass as text on charcoal |
| `--brass-btn` | `#C9A45C` | brass fill, for **Book now** over the film |

The ink is a neutral charcoal (`#22221F`) with no green cast, so the reading
does not tint. `--crimson` still exists because the markup names it in a
dozen places; it is now brass, which is why link hovers went brass rather
than red without a single line of markup changing.

**The sage is a mid-tone**, so black on it tops out near 6:1. Everything on
that band was set by eye first and one line failed at 3.45:1; the values in
the file are the corrected, measured ones. Do not lighten them.

### Contrast, measured rather than assumed

| Where | Ratio |
|---|---|
| Our story, white on the photograph | **7.2:1** worst pixel, 19.5:1 mean |
| The bar on scroll, white on charcoal | 16.7:1 |
| Book now, white on red | 6.0:1 |
| Dining and events, ink on warm sand | 13.4:1 |
| Dining band, body / meta on sage | 5.6:1 / 5.0:1 |
| Sustainability, body on the dark wash | 12.5:1 |
| Stay lede, events copy, questions | 14–16:1 |
| Why Colombo Court, eyebrow / body | 5.6:1 / 8.1:1 |
| Footer meta | 4.7:1 |
| **Book now**, ink on brass | 7.4:1 |

The lowest number on the page is 4.7:1. AA wants 4.5:1.

The story wash has been taken down twice at the client's request and is now
at the AAA line rather than well past it. If it is lightened again, re-run
the canvas measurement first: below 4.5:1 the section stops being readable
for a lot of people, and it is the first thing anyone reads.

The story scrim is measured rather than eyeballed: the photograph is bright
and busy under the words, so the number above comes from drawing the image
and both gradients into a canvas at the real rendered size and walking every
pixel behind the text box for the worst case. Re-run it if the photograph
changes.

### Width and type

`--max` went from 82.5rem (1320px) to **105rem (1680px)**. On a 1920 screen
that leaves 120px of air each side instead of 300. Body type went from 17px
to **18px**, which is the readable floor once the page is that wide.

The lede beside a section heading is now `justify-self:end`, so it finishes
at the right edge of the container rather than floating in the middle of it.

### The hero

Full bleed, the film, nothing over it but the header. The page still has
exactly one `<h1>` and it opens the section below.

**[TEMPORARY] `data-yt` appears on two frames, and neither carries our own
footage.** On the homepage hero it is an Aman film; on the Suite band at
`/stay/` it is Kumu Beach, Balapitiya, by Teardrop Hotels. Both are there so
the directors can see the treatment with a moving picture in place, and
**both must come out before launch**, along with the three YouTube exceptions
added to the Content-Security-Policy in `.htaccess`. Search the whole site for
`data-yt` rather than trusting this list. Delete `data-yt` and
`data-yt-start` and the hotel's own cut (`data-film`) plays again with no
other change.

It runs through YouTube's iframe API rather than a plain embed for one
reason: the frame is revealed only once the player reports it is actually
PLAYING, so the poster frame, the big play button and the buffering spinner
are never seen. Controls, keyboard, fullscreen and the related-video grid are
all off, the frame is overscaled so YouTube's own title bar falls outside it,
and the end of the clip is seeked back to the start point by hand because the
`loop` parameter is unreliable on a single video.

The hotel's own cut is three of its clips with cross-fades: 18.9 seconds at
2.6 MB, the same weight the old 6.5-second clip carried.

`data-stick="70"` tells the header to go solid at 70px rather than waiting
for the foot of the hero, because a hero carrying no words has nothing for
the header to cover.

### The two warm bands

Dining and events sit on `#F5EBDF`. In version one those two sections had no
background of their own and the scroll-driven canvas showed through, which is
where the colour comes from; here it is fixed rather than interpolated. Ink
on it is 13.4:1, which is better than anything the sage could carry.

### The sections

- **Our story** is one photograph running the full width and height of the
  screen, with the words on it, and the page's `<h1>`.
- **Why Colombo Court** is five facts with drawn icons, on linen.
- **Dining** is version one's layout, simplified: the two restaurants side by
  side, each with **one 16:9 film and nothing beside it**, on the warm sand
  ground. The portrait film with two stills alongside was doing three things
  where one would do; a single wide frame reads as a pair of equals.

  The films are `ed-amber.mp4` and `ed-cloud.mp4`, the 16:9 cuts the Eat &
  Drink page already uses. The portrait cuts and the four stills are still in
  `assets/` because `_backup-v1/index.html` uses them; delete them only if
  the version-one rollback is abandoned.

  The band is 1002px against a 900px screen. Holding 16:9 exactly and running
  a little over was the deliberate choice over cropping the film to fit.
- **Sustainability** is back to the version-one treatment, at full height.
- **Events** lost its five-item list; the copy runs the full column width and
  the buttons stand where the list was.
- **Good to know** is ten questions beside one still, all ten mirrored in the
  `FAQPage` block.
- **Make Colombo yours** is full height with a heavier wash.

### On reviews and structured data

The visible **4.9 from 2,400+ reviews** is not marked up as
`aggregateRating`, deliberately. Google does not show review rich results for
self-serving reviews, which is what a hotel publishing its own score on its
own site is, and the markup carries a manual-action risk for no gain. The
figure is in the visible text, which is what answer engines read anyway.

The ten-question `FAQPage` is the real win on this page: it is the format
answer engines quote, and four of the questions were added because they are
what a traveller actually types.

### The logo

`assets/img/logo-w-*.png` is the full-white lockup, made from `CCH Logo.png`
by flattening every visible pixel to white and keeping the alpha. It is used
in both header states, so the mark never changes colour on scroll.
`logo-g-*.png` is the same lockup in charcoal-green, used as the
organisation logo in the page schema.

### The stand-in film and the local one

They used to race: the hotel's own cut started, then the YouTube stand-in
replaced it a second later, which read as a glitch. While `data-yt` is on the
hero, `main.js` does not load the local film at all, so the still holds until
the stand-in is genuinely playing. **This is a symptom of the demo, not of
the design** — take `data-yt` off and only one film ever loads.

## Legal pages

`gdpr-compliance/index.html` is the first of them, on the shared chrome. It
is written rather than borrowed: what is collected, the lawful basis for
each, who else sees it, how long it is kept, the eight rights, and how to
use them. British English, plain sentences, no clause numbering.

A legal page has no picture behind the header, so `.page--legal` makes the
header solid from the first pixel; white type on cream is nothing at all.

**Three things are still bracketed on it and it needs a legal read before it
goes live:** the named contact for data protection requests, the retention
period Sri Lankan tax law actually requires, and the list of processors in
the reservation chain.

The footer links **Terms & Conditions**, **Privacy Policy** and **Cookie
Policy** still point at pages that do not exist. They need writing too.

## The Wellness page in version two

`/wellness/` loads `v2.css` after `styles.css` and `pages.css`, so it gets
the charcoal header, the red call to action, the 1680px measure, the 18px
type and the version-one footer for nothing. Only the shapes that page does
not share are written out, in section 15 of that file.

- The **hero runs the full screen**, and its heading is now *The Court Spa. /
  Where Colombo goes quiet.* rather than the line about clocks. The sub sits
  on two lines.
- **And the rest of it**: the lede is two lines, and all four card
  paragraphs were rewritten to the length of the fitness room, which was the
  one that said enough and stopped. They measure six lines each.
- **Good to know** is eight questions beside a still, at full screen height,
  all eight mirrored word for word in the `FAQPage` block. The four new ones
  are about treatment length, what to wear, pregnancy, and what happens
  afterwards, because those are what people type before booking a treatment
  somewhere they have never been.
- **Put the day down** runs the full screen.

### Three contrast failures the full-height change introduced

Making a band full height moves its text out of the middle of the picture
and into whichever part of it happens to be under the new position. Three
places went from comfortable to failing without anything about the wash
changing:

| Where | Was | Is |
|---|---|---|
| Wellness hero | 3.9:1 | **7.1:1** |
| Wellness closing band | 3.0:1 | **6.3:1** |
| Homepage closing band | 3.2:1 | **7.2:1** |

All three were found by sampling **the box the words actually occupy**
rather than the frame as a whole. An earlier measurement of the wellness
hero read 19.7:1 because it sampled the top third, where there is no text.
**Measure the text block, not the picture** — the method is in the canvas
snippets used throughout this file's history, and it should be re-run
whenever a photograph or a section height changes.

Everything else on the page sits between 4.7:1 and 16:1.

### The bar going solid

`data-stick` on the hero says at what scroll depth the header turns solid,
and `main.js` reads it from whichever hero the page has (`.hero` on the
homepage, `.phero` on the subpages). **Both are set to 70.**

Without it the subpages measured a threshold from where the hero copy sits,
which was right when the hero was short and wrong the moment it went full
height: the copy moved to the foot of the screen and the bar stayed
transparent two thirds of the way down the page.
