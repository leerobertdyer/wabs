# Write a Bad Song

A songwriting habit tool. It starts as a better voice memo app built for songwriting, used first by its author, and grows into a community later if it proves useful.

Core idea: a monthly deadline plus permission for the song to be bad. A rough draft is the point.

> Labels used below: **(decided)** was settled during design, **(proposed)** is a suggestion not yet confirmed, **(parked)** is for later and not part of the first build.

---

## Direction (decided)

- Build this first as a tool for myself and prove it's useful before looking for users.
- Extend it to others later.
- Build the data with community intent from day one: every song has a user ID and a private-by-default visibility flag, and prompts are shared, so moving to a community needs no restructuring.
- Expect a small, word-of-mouth user base. The app also doubles as a way to build community in the Charlotte tech and music scenes and to keep me writing.

---

## Phase 1: personal songwriting tool (decided)

A better voice memo app built for songwriting.

### Build checklist

- [ ] **Recording spike first.** Prove recording works on a real device (calls, screen lock, backgrounding) before building any UI. Write the file to disk as soon as recording stops.
- [ ] **Easy record.** Open the app and record in a tap or two. Save locally first so it works offline.
- [ ] **Archive types.** Riff, lyrics, and both (name undecided: "song idea" or "WIP").
- [ ] **Marked songs.** A single `is_marked` boolean with a one-tap toggle and a filter. Today I put an emoji in a voice memo title, and any emoji works as a keeper flag. The toggle icon can be a fire emoji.
- [ ] **Import existing iPhone voice memos** so the app doesn't start empty:
  - Multi-select audio files from the Files app, copy them into app storage, and read each duration.
  - Always copy, never move. The originals stay in Voice Memos.
  - A memo with any emoji in its title imports as marked, after a confirmation step showing how many will be marked. Leave titles as they are.
  - The import preview shows a total size estimate and warns before copying. I have thousands of memos, at roughly 1 MB per minute of audio.
  - Android import is deferred because it is harder to test.
- [ ] **Backup in v0.** I'd be afraid to use the app without it.
  - Only recordings created in the app are synced to the cloud, not imported copies.
  - Marked imports are also backed up.
  - Proposed: one-way (device to cloud) with a restore on an empty install.
  - Proposed: sync metadata for imported memos too (text is tiny), so marks and notes survive.
  - Proposed: show a per-recording "backed up" indicator.
- [ ] **Personal deadline with notifications.** These are essential: "Have you written anything this week?" and "Time for a quick 10 minute guitar session?"
- [ ] **Timed sessions.** A built-in time box for quick, low-pressure sessions to write an idea or play an instrument.
- [ ] **Resurfacing old ideas.** Scope undecided (everything, only marked songs, or lyrics too).
- Not for now: heat-map calendar, which is likely overkill.

### Proposed details (not yet confirmed)

- **Prompt generator:** constraint-based, no AI. Random combinations of key, time signature or feel, point of view, two random words, structure, and starting instrument. Keep riff prompts and lyric prompts separate. Seed by month so everyone gets the same combo later with nothing stored. Build a small version first and see whether it gets used; consider AI theme seeds only after that.
- **Time box:** a 10-minute countdown with record built in, ending in "save whatever you got." A finished session counts as activity for the weekly check, and "minutes this week" replaces a heat map.
- **Resurfacing:** one random idea older than 30 days each week as a notification, favoring unmarked items since marked ones are already visible. Actions: mark it, keep it, or "not for me" (removes it from the pool). Lyrics-only could be a setting.

### Suggested before touching code (proposed)

- [ ] **Three screens, hand-sketched:** Record (home), Library (list, type filter, marked filter), Song detail (playback, title, type, notes, marked toggle).
- [ ] **Colors and fonts:** pick a palette and one or two fonts, put them in a single tokens file, timebox it, then stop.
- [ ] **Type names:** pick riff / lyrics / song idea and rename later.
- [ ] **Definition of done for v0:** for example, "I recorded 5 real ideas in a week, marked one, and got one reminder."
- [ ] **One test platform first:** whichever phone I carry.
- [ ] **Build budget:** a visible edge, such as 2-3 weekends for v0.
- [ ] Build every screen ugly first and put it on my phone before polishing anything.

### Suggested data conventions (proposed)

- UUIDs generated on the device, not auto-increment, so rows can sync later without remapping.
- A `deleted_at` timestamp instead of hard deletes, with a "Recently Deleted" screen. A cleanup pass purges rows and audio older than 30 days. Delete the audio at purge, not at first delete, so undo works.
- Relative file paths, because iOS can change an app's container path between installs and updates.
- A `source` field (recorded or imported), plus the original title and date, on every row.
- Backup as a change log: each local change goes into an outbox with a UUID, a worker pushes it with retries, and the server stamps each change with an increasing counter. Restore is then a "pull everything since 0." Metadata conflicts use last write wins per field with server time. Two-way multi-device sync is out of scope for now.

---

## Phase 1 pitfalls to avoid

- **Recording reliability:** calls, locking the screen, or backgrounding can kill a recording. Spike recording first.
- **Sync:** the hardest part of app-building. Keep it to the simplest form in v0: backup of recordings created in the app, behind the storage-provider interface, not two-way sync across devices.
- **Notifications:** use local scheduled notifications instead of server push. The weekly reminder can reschedule itself whenever a recording is saved.
- **Apple builds:** free developer accounts expire after about 7 days, so budget the $99/year early. Expect a development build instead of Expo Go once audio and notifications are in play.
- **Losing to Voice Memos on speed:** time the cold start from opening the app to recording.
- **Building the community layer early:** the user ID and visibility columns are enough, with no sharing UI.
- **Import size:** thousands of memos can mean several GB. Show the estimate and warn before copying.

### Dogfooding rule (proposed)

The app exists to get me writing, and building it can quietly replace writing. Build more only after the first part works well enough (functional, not perfected). Keep a running friction list and build only what's on it. Tripwire: do a build session only after capturing at least one idea with the app that week.

---

## Deferred until Phase 1 is proven

- Bulk "mark all titles containing ___" box: type a word or symbol, see the match count, and mark all matches. Works in the import preview or as a library action.
- Suggested repeated tokens: auto-detect symbols or words repeated across many titles and offer to mark them. Only worth building if a second user appears, since it needs a stoplist and an accept/reject screen.

---

## Phase 2: sharing (planned)

- Public share link and song page for any track.
- A public "this month's prompt" page so anyone can write along without an account.
- writeabadsong.com, an existing static site, is the public posting ground and share space. The monthly prompt can come from the seeded generator, so the site and the app show the same prompt with no server.
- Much later (around v4): log in on the website to reach personal recordings from outside the phone.

---

## Phase 3: community and competition (parked)

Everything in this section was decided during design but is not built. It becomes relevant only if the personal tool proves useful and people ask to join.

### Core idea

- Audience: songwriters (including me) who want a reason to finish rough drafts.
- Why it works: deadline pressure plus "a rough draft is the point."
- One shared feed for everyone, with no groups.
- Feeder idea: still open, with a bounded way for players to find me for production or mixing.

### Monthly rounds (decided)

Each month is a standalone round: one MAIN song earns most of the points, and extra songs add a small bonus.

- Anyone can join at any time and gets a full, winnable month.
- Post any time until midnight on the last day of the month (one time zone for the group).
- Songs are recorded in the app: a rough phone recording of a rough draft.
- Songs go live in the feed right away. No anonymity and no voting window.
- One MAIN song per player earns the biggest share of points.
- Additional songs earn a small bonus, capped.
- Highest monthly points wins the month.

### Prompts (decided)

Prompts are optional and unscored. A toggle on upload marks a song as a prompt entry.

- No points and no validation. Checking prompt-following was a monthly chore, and AI judging was rejected as hollow and unable to judge musical prompts like a key or time signature.
- The feed can filter to prompt entries, so the takes on a theme sit together.
- The winner's featured-song pick comes from the prompt entries.
- Profile stat: prompts answered (for example 7 of 12), self-tagged.
- A main song counts whether or not it follows the prompt.

### Cadence (leaning monthly)

Monthly is the committed pace. One song a month was already a stretch, so weekly would likely become an obligation.

- Extra songs already reward anyone who wants more reps.
- Ideas discussed, not decided: optional weekly sketch prompts that earn a small bonus and never break a streak; one free skipped month per quarter (streak grace); a rolling 30-day score instead of fixed months.

### Season and prize (decided)

A season is six months, scored on each player's best 4 months, with one first-place prize at the end.

- Season score = sum of a player's best 4 monthly scores out of 6.
- Highest overall score wins the season (not most monthly wins).
- One first-place prize per season. No monthly prizes, since time and money are limited.
- Monthly winner perks (non-material, still being decided): writes next month's prompt, a badge and Hall of Fame entry, and picks a "song of the month" spotlight.

### Rewards and sustainability (decided)

The app should be painless and self-sustaining while still rewarding. Part of the reward is the songs and the habit itself.

- Season champion gets status only: a permanent badge, a spot on a Wall of Champions, and profile flair.
- Production is a paid service, not a prize: a "book a session with me" option priced to be worth my time, with a hard cap on slots per month.
- A tangible prize is still undecided.

Monthly recognition (proposed): spread across automatic awards so one player doesn't take everything.

- Highest total points
- Most comments given
- Most prompts answered
- Longest streak

With caps in the points table, several heavy posters may tie at the top, so a single winner is not guaranteed.

Possible once-a-year three-month competition with a tangible prize, only if I have the time and motivation. It would need to run on the same automated points, with no judging, no production, and a prize fixed in advance.

Automation ideas under consideration, so nothing needs me each month:

- A fallback prompt bank if the winner doesn't submit a prompt in time
- A scheduled monthly rollover that locks the month, totals points, awards badges, names the winner, and sends notifications
- Private invite-code groups, with a report button and auto-hide after several reports, to keep moderation light

### Points (decided direction, numbers not final)

Scoring is effort-based, since the app is a habit tool and not a talent show. Points come from posting and from engaging with other players' songs.

| Activity | Points | Cap per month |
| --- | --- | --- |
| Main song posted | 10 | 1 |
| Extra song | 2 each | 3 |
| Early bonus (main song posted by mid-month) | 2 | 1 |
| Thoughtful comment | 1 each | 5 |
| Streak (consecutive months with a main song) | 2 per month in the streak | none |
| Listening to a song (most of the track, no skipping) | 1 each | 5-8 (to decide) |

A comment only counts if the commenter completed a listen (most of the track, no skipping) and wrote at least 15 words. Free reactions (hearts) that score nothing are an idea to consider.

Listening is tracked by played time on the server, so skipping and scrubbing don't count. The cap keeps listening from becoming the main way to win.

### Voting (dropped)

Voting and assigned listening batches were set aside as too much to juggle and not a rolling experience. Without voting there is no best-song judgment, so the winner is the player with the most points.

### AI-generated music

Fully AI-generated songs count as cheating. Synths, beats, and loops with human vocals are fine. In-app recording keeps entries as rough human drafts. Since the main reward is the habit itself, cheating has little payoff, so the plan is a written rule on an honor system, with checks added only if cheating appears.

---

## Open questions

- [ ] Prompt generator: build it at all? Custom prompts may not inspire, and an AI skill with rules (no repeats, nothing cheesy) is untested.
- [ ] Name for the "both" archive type.
- [ ] What resurfacing covers: everything, only marked songs, or lyrics too.
- [ ] Keep 6-month seasons, or go month to month only (which may remove the need for a prize).
- [ ] Confirm the monthly cadence; consider a rolling 30-day score.
- [ ] Tangible prize: needed at all, or only for an occasional three-month competition?
- [ ] Final point values and caps, including the listening cap.
- [ ] Monthly recognition: one winner, or several automatic awards.
- [ ] Free hearts/reactions that score nothing?
- [ ] Local (Charlotte) filter, and whether cohorts or leagues are ever needed.
- [ ] Tech: Cloudflare R2 for audio, Postgres, Node server for presigned uploads.