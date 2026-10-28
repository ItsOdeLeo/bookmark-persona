# Bookmark Persona

A Grok Bot template that reads your X account and makes a share card: the persona you show in public (your posts) vs. the one hiding in your saves (your bookmarks and likes).

**Try it:** https://x.ai/bot/n-19X3xySPROJG9JTLWAl (opens in the Grok Bot app)

| Private card | Detailed card |
|---|---|
| ![Private card](preview/card-en.png) | ![Detailed card](preview/card-en-detail.png) |

## How it works

1. **Read.** Through Grok Bot's X plugin, the Bot reads up to 200 of your posts, 300 bookmarks and 600 likes.
2. **Drop the noise.** Follow-for-follow posts, giveaways, bare "gm"s and one-word or single-emoji replies count for nothing.
3. **Tag every item.** Each item gets a pole, or no signal, on four axes. The Bot judges what an item says, never the act itself: posting isn't automatically outgoing, and saving isn't automatically private.

   | Axis | Question |
   |---|---|
   | E / I | Is it turned toward other people, or toward a thought of its own? |
   | S / N | Is it about concrete specifics, or about ideas and patterns? |
   | T / F | Does it run on logic or on feeling? |
   | J / P | Is it settled or still open? |

4. **Count.** Weights: original post 1, reply 0.5, bookmark 2, like 1. Each pole gets 3 extra points first, so a thin axis stays near 50% instead of jumping to 0% or 100%. The letter is the pole above 50%. Under 55%, the card tilts the letter and marks it as on the fence: run it again and it might flip.
5. **Render two cards.** The private card shows only your types, pets and a one-line summary. The detailed card adds two lines per side about your themes. You pick which one to post, and a "Post on X" link opens the composer with the text and template link filled in.

## Privacy

- Everything runs in your own Grok Bot. The template's creator never receives your data.
- The card data travels in the URL fragment of a local file and is rendered on your Bot's own computer.
- After each run, the Bot deletes the data it downloaded and saves nothing to memory.
- The cards never quote or name a specific post, bookmark or author.

## Files

- `card.html`: the 1080×1350 card. Data comes in the URL fragment as `#d=<base64url JSON>`; add `"detail": true` for the detailed card. Open `card.html#demo` or `card.html#demo=zh` to preview.
- `persona.js`: the 16 pets and their nicknames.
- `gallery.html`: all 16 pets on one image (`#zh` for Chinese).
- `skills/bookmark-persona-card/SKILL.md`: the skill that reads, scores and renders.
- `grok/INSTRUCTIONS.md`: the Bot's instructions for the template.
- `.cursor-plugin/plugin.json` and `assets/logo.png`: the plugin manifest and logo.
- `share.txt`: the template link the Bot puts in the share text.

| Type | Pet | Type | Pet |
|---|---|---|---|
| INTJ | black cube | ISTJ | canister in reading glasses |
| INTP | donut | ISFJ | heart |
| ENTJ | triangle | ESTJ | rocket |
| ENTP | speech bubble | ESFJ | cloud |
| INFJ | gem | ISTP | hex nut |
| INFP | sleepy moon | ISFP | paint drop in a beret |
| ENFJ | sun | ESTP | winking flame |
| ENFP | light bulb | ESFP | star in sunglasses |

## Hosting

Grok Bot templates only carry text, so the Bot downloads `card.html`, `persona.js` and `share.txt` from a public gist on every run: https://gist.github.com/ItsOdeLeo/f9019b6f40436571169eeaca4b481312. Updating the gist changes every card from the next run on, without republishing the template. The gist mirrors this repository.

## Plugin

This repository is also a skills-only plugin (`.cursor-plugin/plugin.json`). Add it to a Bot that has the X plugin connected, then ask for your persona card.

## Make your own

1. Fork this repository and host `card.html` and `persona.js` somewhere public, such as a gist.
2. Point the URLs in `skills/bookmark-persona-card/SKILL.md` at your copies.
3. Create a Bot in Grok, give it `grok/INSTRUCTIONS.md` as its instructions, install `skills/bookmark-persona-card/SKILL.md` as a skill and connect the X plugin.
4. Use **Create template** in the Bot's menu, then publish it.

Please keep the credit to @ItsOdeLeo on the card. If you publish a changed version, please give it a different name.

## License

- Code: MIT, see `LICENSE`.
- The 16 pet designs: CC BY-NC 4.0, see `LICENSE-ART.md`.

Just for fun. Not a personality test or psychological advice. Four-letter types are used informally. Nicknames and art are original.
