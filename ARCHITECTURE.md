# Architecture

CyberShield Academy is a static Vite application using React, strict TypeScript, React Router, Tailwind CSS and Lucide icons. The browser renders the entire learning experience. Hash routing permits deep links on static hosts without server rewrites.

| Area | Responsibility |
| --- | --- |
| src/main.tsx | Application shell, navigation, route focus, responsive menu and route registration |
| src/pages/Learning.tsx | Landing page, module dashboard, knowledge checks and lesson completion |
| src/pages/Labs.tsx | Case selection, classification, indicator matching, branch consequences and verification |
| src/pages/Assessment.tsx | Random question selection, answer navigation, submission and review |
| src/pages/Progress.tsx | Derived statistics, print view, history and confirmed reset |
| src/components/UI.tsx | Shared choices, actions, lab cards, headings and curriculum icons |
| src/data | Authored lessons, question bank, answers, explanations and local case fixtures |
| src/types.ts | Typed contracts for lessons, questions, attempts and progress |
| src/hooks/useProgress.tsx | Shared progress context, browser storage access, write failure handling and cross-tab notifications |
| src/utils/training.ts | Validation, scoring, sampling and fixture-domain logic |
| src/style.css | Tailwind entry, layout, navigation, component styles, print and motion preferences |
| tests | Unit suite and production-bundle Chromium workflow |

## Data flow

1. The provider reads the versioned localStorage record. The decoder validates lesson and case IDs, question IDs, attempt lengths and answer ranges. Invalid entries are discarded. Unreadable or incompatible records start empty.
2. Pages read typed content and keep unsubmitted choices in component state. A completed lesson or lab adds a unique ID. An assessment submission records its randomized question order, selected answer indices and timestamp.
3. The provider publishes the new state to React and persists it locally. If writing fails, the page displays a session-only notice. Other tabs receive storage events. Concurrent writes use last-write-wins.
4. The results view recalculates scores from stored choices. Topic statistics aggregate actual submitted answers. A topic with no answers remains unassessed. Strength means at least 80% correct. Coursework completion requires six modules and one submitted assessment. Lab completion is reported separately.
5. Reset replaces the record with an empty versioned record after explicit confirmation.

## Boundaries

The URL helper handles only the supplied HTTPS fixtures on the reserved .example suffix. It intentionally has no network lookup, general public-suffix parser, or real-site safety verdict. The inbox and site previews render plain text. The branching lab has no send, purchase, sign-in or external action.

Question IDs and answer order are persistence contracts. If future edits change an existing question’s scoring meaning, introduce a storage migration or new question ID.
