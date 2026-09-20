# Product QA and Reliability Receipt

## Automated on every deployment

GitHub Actions runs `npm ci`, `npm run check`, and `npm run build` before publishing. The check fails if core measurement, decision-rule, disclosure, economics, ownership, limitation, or simulated-evidence labels disappear.

## Implemented reliability behavior

- The core plan, configured state, and locked state persist across refreshes.
- Unavailable browser storage does not prevent planning or measurement-safe navigation.
- Missing live event data falls back to clearly labeled concept data.
- Empty searches provide a recovery message.
- Users must cast a vote before locking a destination.
- Matching remains unavailable until a destination is locked.
- Crew-status sharing can be removed.
- Dialogs support Escape, contained keyboard focus, and focus restoration.
- Status messages use an assistive-technology live region.
- Keyboard focus is visually prominent.

## Manual checks not claimed until a person completes them

| Check | Browser/device | Date | Initials | Result/issue |
|---|---|---|---|---|
| Complete core flow with mouse | Chrome desktop |  |  |  |
| Complete core flow keyboard-only | Chrome desktop |  |  |  |
| Screen-reader labels and dialog order | NVDA/VoiceOver |  |  |  |
| Mobile layout | iPhone-size viewport |  |  |  |
| Mobile layout | Android-size viewport |  |  |  |
| Empty search recovery | Any |  |  |  |
| Refresh after locked plan | Any |  |  |  |
| Storage unavailable | Private/restricted context |  |  |  |
| Authentication error state | Any |  |  |  |
| Report/block/status removal | Any |  |  |  |

## Release rule

CI success proves that automated checks and the production build passed. It does not prove visual quality, assistive-technology usability, or real-user comprehension; those remain manual evidence.

