# Hangtime

A polished landing page and interactive concept MVP for group-based social discovery. Hangtime helps existing friend groups discover compatible groups going out nearby based on destination, plans, and vibe.

## Run locally

Dependencies are already installed in the prepared project folder. Start the presentation server with:

```powershell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser.

If dependencies ever need to be restored:

```powershell
npm install
```

## Pitch Demo

The **Pitch Demo** button is fixed in the bottom-right corner of the landing page. It jumps directly to the first product screen, “Who’s out tonight?”

The demo supports:

- Selecting tonight’s crew
- Setting a vibe and intent
- Browsing, skipping, viewing, and matching groups
- Reviewing a group profile and trust signals
- Opening a combined group chat
- Confirming a meetup or sending a custom message
- Moving backward and restarting at any time

See [PITCH_GUIDE.md](PITCH_GUIDE.md) for a timed presentation path.

## Production check

```powershell
npm run build
npm run preview
```

The project uses React and Vite with no backend, authentication, external APIs, or remote image dependencies.
