# Verification

Checks ran on Windows using Node 24.21, npm 11.19 and a local Chromium headless shell. The browser suite exercised the compiled production files.

| Check | Observed result |
| --- | --- |
| Dependency installation | The public registry was unreachable. An offline npm install completed using existing packages and cache data. npm ls --depth=0 resolved all declared dependencies. A fresh internet download was unverified. |
| npm run lint | Oxlint exited successfully. |
| npm run typecheck | Strict TypeScript check passed. |
| npm test | Six unit tests passed. |
| npm run build | Production HTML, CSS and JavaScript generated. Vite reported third-party use-client directive warnings. |
| npm run test:e2e | One Chromium end-to-end suite passed on the final production bundle. |
| Desktop overview | Inspected rendered desktop screenshot at 1280 × 900. |
| Print styling | Chromium print media hid the navigation. Physical printing and native print dialog interaction were unverified. |

## Functional coverage

| Test case | Expected and observed result |
| --- | --- |
| Answer all six module checks | Each correct answer unlocks the next step and saves one completion |
| Work through all eight inbox messages | Correct classification and complete indicator set earn each completion |
| Examine all eight URL previews | Correct domain and address pattern earn each completion |
| Explore the six social scenarios | Safe decisions complete cases. A tested unsafe initial action followed by recovery earns no completion |
| Finish a randomized assessment | Fifteen distinct questions, correct total, and fifteen review entries |
| Retry with every answer incorrect | Second attempt scores zero and the previous perfect score remains the best |
| Reload the results page | Lesson completion and both assessment attempts remain available |
| Open mobile navigation at 375 px | Overview opens and the page fits the viewport horizontally |
| Cancel or confirm reset | Cancel preserves the record. Confirm clears lessons, cases and attempts |
| Malformed persistence fixtures | Decoder ignores invalid JSON, unsupported versions, invalid IDs, repeated lesson IDs and malformed attempts |
| Domain parsing and indicator equality | Helper distinguishes a deceptive subdomain from the registered training domain and rejects unsupported input |
| Question bank and sampling | Six topics represented, correct options exist, each draw contains unique questions, source array remains unchanged |

## Reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright-core install chromium
npm run test:e2e
```

Alternatively set `CHROMIUM_PATH` to a compatible installed Chromium executable before running the end-to-end test. Browser installation requires network access. The suite reads dist files directly into intercepted browser requests at a reserved origin, so verification can run without a listening HTTP port. It interacts with rendered controls and real localStorage. Serving dist over loopback was blocked in the verification sandbox.

For a submission walkthrough, also try a keyboard-only session, use print preview on your own paper size, and check your target mobile browser. Screen-reader usability and cross-browser rendering were not formally audited.
