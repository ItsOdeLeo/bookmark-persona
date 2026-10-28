---
name: bookmark-persona-card
description: Read the owner's X posts, bookmarks and likes, guess a front-stage type (from posts) and a backstage type (from bookmarks and likes), and render the fixed Bookmark Persona share card as a 1080x1350 PNG. Use when the owner asks for their persona card, "read my bookmarks", "what's my backstage type", or says go on first run.
---

# Bookmark Persona card

You make one share card that compares two four-letter types (E/I, S/N, T/F, J/P):

- **Front stage**: who the owner is in public, judged from their own posts.
- **Backstage**: who they are in private, judged from their bookmarks and likes.

It's an entertainment game, not a personality assessment, and never claims to be one. Don't use the words "MBTI" or "Myers-Briggs" except in the disclaimer that's already on the card. Never store the owner's posts, bookmarks or likes in memory; use them only for the current card.

The card design is fixed and hosted. You only supply the data. Never redesign, restyle or rebuild the card yourself.

Card files (download both fresh on every run, into the same folder):
- `https://gist.githubusercontent.com/ItsOdeLeo/f9019b6f40436571169eeaca4b481312/raw/card.html`
- `https://gist.githubusercontent.com/ItsOdeLeo/f9019b6f40436571169eeaca4b481312/raw/persona.js`

Template link to share (`TEMPLATE_LINK` below): download it fresh on every run from `https://gist.githubusercontent.com/ItsOdeLeo/f9019b6f40436571169eeaca4b481312/raw/share.txt`. It's one line with a URL. If the download fails, or the line isn't an `https://` URL, leave the link out of the post text.

## 1. Read the data (X plugin)

1. Own profile: display name, handle, `profile_image_url`.
2. Own posts: page through up to 200. Skip pure reposts. Count replies but weigh original posts more.
3. Bookmarks: page through up to 300 (`max_results` + `pagination_token`).
4. Likes: page through up to 600 and use all of them. Bursts of low-signal likes (see step 2) are tagged `-`, so they don't take over the result.

Keep the counts you actually read. If X returns an error or the plugin isn't connected, tell the owner how to connect X and stop.

Minimums:
- Under 10 posts: still judge, but say in chat that the front stage is a low-confidence guess.
- Under 15 bookmarks and under 30 likes combined: tell the owner the backstage is too thin to judge, suggest they come back after bookmarking more, and stop.

## 2. Score two types

Score each side separately. Front stage uses posts only. Backstage uses bookmarks and likes.

**Judge what an item says, never the act.** Posting is always public and saving is always private. So "they posted it" never means E, and "they saved it" never means I. A reply, an @mention or a personal update isn't E by itself either.

**Tag every item, then count.** Don't judge from an overall impression. Go through the items one by one. For each item and each of the four axes, tag one pole or `-` (no signal).

Weights:

| Item | Weight |
|---|---|
| Original post | 1 |
| Reply | 0.5 |
| Bookmark | 2 (deliberate and private) |
| Like | 1 |

**Noise first.** Tag `-` on all four axes for items that say nothing about the person:
- follow-for-follow, "grow your account" and "let's connect" posts;
- giveaways and engagement bait;
- bare greetings such as "gm";
- a single emoji, or a one-word or one-phrase reply such as "😂", "Yes", "True", "This" or "Congrats!!".

**Then tag the rest.** E/I and S/N each ask a question that almost every item can answer, so give nearly every remaining item a pole on both. T/F and J/P can be `-` when an item doesn't show them.

| Axis | Question | First pole | Second pole |
|---|---|---|---|
| E / I | Is it turned toward other people, or toward a thought of its own? | **E**: speaks to people or a crowd: conversation, banter, asking the audience, shoutouts, invitations, meetups, news about people | **I**: a solo thought or a deep dive: notes, observations, explainers, tutorials, long reads, research, tools, with nobody addressed |
| S / N | Is it about concrete specifics, or about ideas and patterns? | **S**: facts, steps, numbers, prices, specs, how-tos, what happened today, hands-on detail | **N**: ideas, the future, meaning, theories, analogies, "what if", trends, absurd or abstract humor, philosophy |
| T / F | Does it run on logic or on feeling? | **T**: analysis, benchmarks, critique, debate, data, systems, efficiency | **F**: people, feelings, values, stories, encouragement, gratitude, wholesome or emotional content |
| J / P | Is it settled or still open? | **J**: plans, checklists, frameworks, routines, deadlines, firm verdicts | **P**: open questions, novelty-hopping, memes, playful tangents, unfinished ideas, many unrelated topics |

A launch, a drop or an "out now" post doesn't decide S/N by itself. Tag it by how it's told: specs and prices are S, a vision of what it changes is N.

**Count with a small-sample pull.** For each axis, add 3 to each pole's weighted total, then take the share: `share = (pole + 3) / (both poles + 6)`. With lots of signal this barely changes anything. With very little signal, it keeps the axis near 50%, so it shows as "on the fence" instead of jumping to 0% or 100%.

The letter is the pole above 50%. On an exact tie, pick the pole with the strongest single items. Keep the winning share as a whole number from 50 to 100. It goes on the card.

If fewer than 40 backstage items carry any signal, still make the card, but say in chat that the backstage is a low-confidence guess and that bookmarking more makes it sharper.

Don't force the two sides to differ. If they match, the card says so, and that's a valid result. Keep, for each axis, the two or three items that pulled hardest. Use them to explain the result in chat, but never on the card.

## 3. Write the words

All text goes on a public image, so follow these rules:

- **Language**: the language the owner writes to you in: `zh` for Chinese, otherwise `en`. If their message has no clear language (for example just "go"), use the majority language of their own posts. If they ask for the other language, re-render with the same types and scores. Write every line in the chosen language.
- **Two lines per side**: specific, playful, a light roast, about themes and habits. Max 60 characters in English, 24 characters in Chinese. Good: "Hoards 40-tweet threads on system design". Bad: "Is analytical". These only appear on the detailed card.
- **Verdict**: one line contrasting the two sides in general terms: their vibe, energy or style. It goes on both cards, so never name a topic, product, company, account or person. Max 80 characters in English, 30 in Chinese. Good: "Loud in the replies, quietly curious in private." Bad: "Posts like a quota analyst" (names a topic).
- **Privacy**:
  - Never quote, name or link a specific bookmarked or liked post, or its author.
  - Never mention health, sexuality, religion, politics, money troubles or named private people.
  - Describe themes only.
- **Tone**: no insults and no diagnosis. It's a game, not a personality test.
- **No guessed gender**: write lines without "he", "she", "his" or "her". Start with the verb instead ("Drops a repo link…").

## 4. Render the card

Build this JSON:

```json
{
  "lang": "en",
  "handle": "their_handle",
  "name": "Display Name",
  "avatar": "profile_image_url as returned",
  "front": { "type": "ENFP", "scores": [64, 81, 58, 70], "lines": ["...", "..."] },
  "back":  { "type": "INTJ", "scores": [77, 72, 69, 61], "lines": ["...", "..."] },
  "verdict": "...",
  "stats": { "posts": 120, "bookmarks": 214, "likes": 300 }
}
```

`scores` holds the winning share for each letter of `type`, in order. For example `[64, 81, 58, 70]` means E 64%, N 81%, F 58%, P 70%. Always send the real shares: the card marks every letter under 55% as "on the fence" by itself.

Download the two card files into one folder, for example `~/bookmark-persona-card/`. Overwrite old copies so you always use the latest design.

```bash
mkdir -p ~/bookmark-persona-card && cd ~/bookmark-persona-card
B=https://gist.githubusercontent.com/ItsOdeLeo/f9019b6f40436571169eeaca4b481312/raw
curl -fsSL -o card.html "$B/card.html" && curl -fsSL -o persona.js "$B/persona.js"
```

Encode the JSON as base64url of the UTF-8 bytes and put it in the URL fragment (after `#`):

```python
import base64, json, os
frag = base64.urlsafe_b64encode(json.dumps(data, ensure_ascii=False).encode()).decode().rstrip("=")
url = "file://" + os.path.expanduser("~/bookmark-persona-card/card.html") + "#d=" + frag
```

Render two PNGs from the same data:
- **Private card**: the JSON as above. It shows the types, pets, scores and verdict, but not the lines.
- **Detailed card**: the same JSON with `"detail": true` added. It also shows the two lines per side.

Screenshot each with headless Chrome:
- Viewport exactly 1080x1350, device scale factor 1.
- Wait until `html[data-ready="1"]` exists, up to 20 seconds.
- Save the full viewport as a PNG.

If `data-ready` is `error`, the JSON is wrong: fix it and retry. If the download fails, retry once, then tell the owner the card host is down. Don't improvise a different card.

## 5. Deliver

Send the owner:

1. Both PNGs, the private card first. Label them: the private card is safe to share and shows only the types and pets; the detailed card adds two lines per side about their themes. They pick which one to post.
2. How it was scored:
   - the percentage for each axis on both sides;
   - which letters flipped between front and back;
   - which letters are on the fence, meaning under 55%. The card shows them tilted. Frame this as part of the fun: they could flip if the owner runs it again, so invite them to try;
   - for the owner's eyes only, one or two of the items that pulled each flipped letter.
3. Ready-to-post text in the card's language, plus a one-tap "Post on X" link (see below). Tell them: save the card they picked, tap the link, attach the image, and post.

English post:
```
My posts say {FRONT}. My bookmarks say {BACK}. 👀

Grok read my X and found my backstage self. Get yours: TEMPLATE_LINK
```

Chinese post:
```
我发的帖子是 {FRONT}，我偷偷收藏的是 {BACK}。👀

让 Grok 读了我的 X，找到了我的幕后人格。你也来测：TEMPLATE_LINK
```

Keep the template link in the post: it's how friends get their own card. Don't add extra @mentions or hashtags.

If both types match, change the first line to "My posts and my bookmarks both say {TYPE}. No secret self here." / "我发的和我收藏的都是 {TYPE}，表里如一。".

**One-tap post link.** You can't post for the owner, so give them a link that opens X's compose box with the post text already filled in. Build it from the exact post text above, with the real template link in it:

```python
from urllib.parse import quote
post_link = "https://x.com/intent/post?text=" + quote(post_text, safe="")
```

Show it as a clear, tappable link labelled "Post on X". X can't prefill an image, so remind them to attach the card before posting.

Then clean up: delete the posts, bookmarks and likes you downloaded, and any other files from this run except the two card files. Keep nothing about the owner's data.

End with one line: it's just for fun, everything stayed inside their own Grok Bot, and nothing was posted or kept.
