# Simulated Usability Review

## Evidence classification

This is a heuristic walkthrough using hypothetical personas. It is design preparation, not user research, observed behavior, validation, traction, or rubric evidence. No real participant, completion rate, quotation, or test outcome is represented here.

## Method

The team walked through the core task from the perspective of three deliberately different hypothetical users and looked for clarity, sequencing, trust, accessibility, and error-prevention problems.

## Scenario A: indecisive group organizer

The organizer wants a quick answer but sees maps, matches, deals, rides, and accounts competing for attention.

Likely friction:

- The core finish condition may be unclear.
- Matching can become an attractive detour before the destination is chosen.
- "Crew vote" may sound optional rather than the task's final step.

Changes made:

- Added a visible three-step progress path.
- Changed the primary language to "Vote + lock plan."
- Locked social matching until a destination is chosen.
- Added completion feedback after configuring the plan.

## Scenario B: privacy-conscious tester

The tester may interpret polished crowd, profile, verification, and offer content as real.

Likely friction:

- Modeled and fictional content could be mistaken for observed activity.
- "Here now" may feel permanent or difficult to undo.
- The reporting path may be unclear.

Changes made:

- Added a prominent concept-data disclosure.
- Made crew status removable by selecting it again.
- Added report and block controls.
- Added a limitations document and safer demo language.

## Scenario C: task-focused first-time user

The tester may reach the vote and press the final button without actually casting a vote because demo votes are already shown.

Likely friction:

- A pre-populated winner makes the user's required action ambiguous.
- The test could record a destination lock without measuring a real choice.

Changes made:

- Disabled the final lock button until the user casts a vote.
- Changed the participant count from "your vote is next" to "ready to lock" after selection.
- Labeled the vote as step three of three.

## Accessibility heuristic

Changes already made include visible keyboard focus, Escape dismissal, focus containment in dialogs, focus restoration, semantic status announcements, and explicit button labels. These changes still require testing with keyboard-only users and assistive technology.

## Hypotheses for real testing

These are predictions to test, not findings:

1. At least half of qualified groups will lock a destination within five minutes.
2. Fewer groups will enter the matching section before completing the planning task because it is gated.
3. Requiring an explicit vote will produce cleaner behavioral evidence but may slightly increase completion time.
4. Some users may still confuse selecting a map marker with choosing the final destination.

## Real-test priority

During the first real sessions, watch whether participants:

- understand that step one begins with the primary CTA;
- know what to inspect before voting;
- recognize that selecting a marker does not lock a plan;
- find and complete the vote without coaching;
- understand which data is modeled;
- correctly identify the finished state.

