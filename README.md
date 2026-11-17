# CyberShield Academy

Phishing awareness training built for CodeAlpha’s Cyber Security Internship, Task 2. The app teaches learners to inspect a request, verify it independently, and respond safely. Every exercise runs locally. Learners can begin without accounts or API keys.

## Run the app

Install Node.js 24 or later and open a terminal in the folder containing package.json.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For a production build, run `npm run build` followed by `npm run preview`.

The downloadable archive also includes the compiled `dist/` directory. With Python installed, preview it immediately from the project root, without installing npm packages.

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4173`. Keep using the same browser and address to see your saved progress.

## Training

- **Learning path** contains six lessons, annotated examples, practical actions, and knowledge checks. A correct check completes a module. Completed modules remain available for review.
- **Email detective** presents eight simulated messages. Classify the message and select every supported indicator. Leave indicators unchecked for a legitimate message.
- **URL detective** presents eight inert addresses and mock site previews. Choose the controlling training domain and the relevant pattern.
- **Decision lab** includes six two-stage scenarios. Unsafe initial decisions open recovery branches. Completing a case requires both a safe initial decision and an appropriate follow-up.
- **Assessment** draws 15 distinct questions from a bank of 30. Review earlier answers before submitting. Every submitted attempt has an answer review and explanations.
- **My progress** shows completed modules and cases, best score, history, and topic-level performance. Print an unofficial project summary or reset the local record with confirmation.

Progress belongs to the current browser and origin. Private browsing, clearing site data, or switching ports can change which record you see. Leaving an unfinished assessment discards that attempt. Messages, attachments, QR references, and destinations are simulated. The app collects no passwords, sends no mail, and makes no external training requests.

## Project guide

See [ARCHITECTURE.md](ARCHITECTURE.md) for structure and data flow, [TESTING.md](TESTING.md) for verification, and [REQUIREMENTS.md](REQUIREMENTS.md) for the internship checklist.

## Screenshots for submission

Capture the overview at desktop width, one detective case after feedback, a completed assessment review, and the progress page at mobile width. Use actual results from your own practice session. Keep the unofficial achievement label visible on any printed summary.

## Educational references

- Federal Trade Commission, [How to Recognize and Avoid Phishing Scams](https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams)
- Federal Trade Commission, [Phishing scams can be hard to spot](https://consumer.ftc.gov/consumer-alerts/2024/12/phishing-scams-can-be-hard-spot)
- CISA, [Implementing Phishing-Resistant MFA](https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf)

The fictional organizations and authored case exercises illustrate these defensive principles. All URL exercises use the reserved .example namespace.
