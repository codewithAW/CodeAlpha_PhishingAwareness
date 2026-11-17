export const signals = [
  "Unverified payment change",
  "Unrelated destination",
  "Pressure to skip checks",
  "Unexpected attachment",
  "Request for a sign-in code",
];
type Mail = {
  sender: string;
  address: string;
  subject: string;
  body: string;
  destination: string;
  context: string;
  flags: number[];
  finding: string;
};
export const inbox: Mail[] = [
  {
    sender: "Fern Accounts",
    address: "billing@fern.example",
    subject: "Revised settlement details",
    context:
      "Fern is an existing supplier. Your policy requires a callback for account changes.",
    body: "Thanks for settling invoice 107. Our receiving bank has changed since the last order. Please update the payment record before the next transfer.",
    destination: "No link included",
    flags: [0],
    finding:
      "Even an existing supplier mailbox can be compromised. Verify the change with your previously recorded finance contact.",
  },
  {
    sender: "Campus Library",
    address: "desk@library.example",
    subject: "Your reserved title is ready",
    context: "You reserved a book yesterday and chose email notifications.",
    body: "The copy of Field Notes you reserved is at the west desk. Bring your library card by Friday. You can view the hold in your usual library account.",
    destination: "No link included",
    flags: [],
    finding:
      "The hold matches an action you initiated and requires no online disclosure. Check in your library app if uncertain.",
  },
  {
    sender: "Orbit Workspace",
    address: "notices@orbit-support.example",
    subject: "Workspace storage review",
    context: "Your work portal is orbit.example.",
    body: "Your shared drive is due for review. Use the storage console listed below to retain your workspace.",
    destination: "https://orbit.example.quota-desk.example/review",
    flags: [1],
    finding:
      "The controlling domain is quota-desk.example. Check storage from the bookmarked work portal.",
  },
  {
    sender: "Mina | Operations",
    address: "mina@orbit.example",
    subject: "A quick favor before the meeting",
    context: "Purchases normally require two approvals.",
    body: "Please buy gift vouchers for the panel now. Keep it between us and skip the purchase queue so the surprise works.",
    destination: "No link included",
    flags: [2],
    finding:
      "Secrecy and bypassing approvals are the strongest clues. Call Mina using the staff directory.",
  },
  {
    sender: "Facilities Desk",
    address: "office@orbit.example",
    subject: "Urgent: west stairwell closed",
    context:
      "Facilities regularly sends building notices. A posted sign confirms the closure.",
    body: "Water is leaking near the west stairwell. Use the east exit today. Sorry for the inconvinience.",
    destination: "No link included",
    flags: [],
    finding:
      "Urgency and a typo also appear in legitimate alerts. Here the independent sign corroborates a practical safety instruction.",
  },
  {
    sender: "Project Archive",
    address: "records@parcel-desk.example",
    subject: "Notes from your review",
    context: "You have no project with this sender and no scheduled review.",
    body: "I attached the amended review notes as requested. Please open the accompanying archive for the agenda.",
    destination: "Attachment label: review-notes.zip (simulation)",
    flags: [3],
    finding:
      "The unexplained attachment and missing context warrant a report. Verify with the project owner through work chat.",
  },
  {
    sender: "Account Care",
    address: "support@help-counter.example",
    subject: "Follow-up on your recovery case",
    context: "You did not open a recovery case.",
    body: "A sign-in code has just been issued. Our agent needs the code to close the recovery case.",
    destination: "No link included",
    flags: [4],
    finding:
      "A code can authorize a login. Do not share it. Review activity directly in the official service.",
  },
  {
    sender: "Studio Calendar",
    address: "events@studio.example",
    subject: "Workshop moved to Room B",
    context: "You registered yesterday through the studio.example events site.",
    body: "Your printmaking workshop now meets in Room B. The updated room is also on the listing in your studio account.",
    destination: "https://events.studio.example/workshops",
    flags: [],
    finding:
      "Expected context and a matching host support the message. Confirm the room using your original registration.",
  },
];
export interface Site {
  title: string;
  service: string;
  url: string;
  choices: string[];
  signal: string;
  why: string;
}
export const siteSignals = [
  "Expected service host",
  "Brand in subdomain",
  "Similar spelling",
  "Hidden destination",
  "Brand in path",
];
export const sites: Site[] = [
  {
    title: "Workspace review",
    service: "orbit.example",
    url: "https://orbit.example.notice.example/review",
    choices: ["orbit.example", "notice.example", "example.notice.example"],
    signal: siteSignals[1],
    why: "Read the hostname from the right. Orbit appears below notice.example.",
  },
  {
    title: "Library holds",
    service: "library.example",
    url: "https://holds.library.example/books",
    choices: ["holds.library.example", "books.example", "library.example"],
    signal: siteSignals[0],
    why: "Holds is a subdomain of the expected library domain. Verify that the action also fits your request.",
  },
  {
    title: "Member statement",
    service: "fern.example",
    url: "https://ferrn.example/members",
    choices: ["fern.example", "ferrn.example", "members.example"],
    signal: siteSignals[2],
    why: "The extra r changes the domain. HTTPS secures the connection to that lookalike.",
  },
  {
    title: "Shared schedule",
    service: "studio.example",
    url: "https://short.example/a7x",
    choices: ["studio.example", "a7x.example", "short.example"],
    signal: siteSignals[3],
    why: "Only the shortening service is visible. Open the studio calendar independently.",
  },
  {
    title: "Campus records",
    service: "campus.example",
    url: "https://files.example/campus.example/records",
    choices: ["files.example", "campus.example", "records.example"],
    signal: siteSignals[4],
    why: "Text after the hostname is a path. It gives the campus no control over files.example.",
  },
  {
    title: "IT service desk",
    service: "orbit.example",
    url: "https://eu.help.orbit.example/tickets",
    choices: ["eu.help", "orbit.example", "help.orbit.example"],
    signal: siteSignals[0],
    why: "Both eu and help sit under orbit.example. Assess the requested action separately.",
  },
  {
    title: "Benefits review",
    service: "benefits.example",
    url: "https://beneflts.example/annual",
    choices: ["annual.example", "benefits.example", "beneflts.example"],
    signal: siteSignals[2],
    why: "The letter l replaces i. Use the known HR portal to find benefits.",
  },
  {
    title: "Parcel collection",
    service: "parcel.example",
    url: "https://parcel.example.dispatch.example/pickup",
    choices: ["parcel.example", "dispatch.example", "example.dispatch.example"],
    signal: siteSignals[1],
    why: "The visible parcel label belongs to a subdomain of dispatch.example. Verify using the original order.",
  },
];
export interface Scenario {
  title: string;
  setting: string;
  request: string;
  safe: string;
  risky: string;
  reason: string;
  verified: string;
  recovery: string;
  finish: string;
  mistake: string;
}
export const scenarios: Scenario[] = [
  {
    title: "The changed invoice",
    setting: "Finance desk",
    request:
      "A familiar supplier sends new banking instructions hours before a transfer.",
    safe: "Hold the transfer and call the number on file",
    risky: "Update the bank record immediately",
    reason: "A payment change needs independent confirmation.",
    verified: "The supplier says the instructions did not come from finance.",
    recovery: "The draft payment now lists an unverified account.",
    finish: "Freeze the change and notify finance",
    mistake: "Let the payment settle first",
  },
  {
    title: "The night shift",
    setting: "Help desk",
    request:
      "A caller claiming to be IT asks you to approve a login during maintenance.",
    safe: "Deny the prompt and contact the internal desk",
    risky: "Approve the prompt to finish maintenance",
    reason: "Approving can grant someone access to your account.",
    verified: "The internal desk confirms there is no maintenance ticket.",
    recovery:
      "The prompt disappeared after approval. Access may have been granted.",
    finish: "Report the event and review active sessions with IT",
    mistake: "Ignore it because prompts have stopped",
  },
  {
    title: "Family emergency",
    setting: "Personal phone",
    request:
      "A voice note from an unfamiliar number says your cousin needs emergency travel money.",
    safe: "Call your cousin on their saved number",
    risky: "Transfer the fare to the supplied account",
    reason: "Voice and urgency are insufficient identity checks.",
    verified: "Your cousin answers and is safe at home.",
    recovery: "You have initiated a transfer to an unverified recipient.",
    finish:
      "Flag the impersonation and contact the payment provider if money moved",
    mistake: "Send a second amount to confirm delivery",
  },
  {
    title: "The lobby visitor",
    setting: "Reception",
    request:
      "A visitor carrying heavy boxes asks to follow you through a staff door.",
    safe: "Direct the visitor to reception for a badge",
    risky: "Hold the secure door without checking",
    reason: "A plausible story cannot establish building authorization.",
    verified: "Reception cannot find a delivery appointment.",
    recovery: "The visitor has entered without a recorded check-in.",
    finish: "Notify reception or building security",
    mistake: "Give the visitor a staff badge",
  },
  {
    title: "Conference check-in",
    setting: "Event entrance",
    request:
      "A sticker on the registration board points to a new QR check-in page.",
    safe: "Ask the staffed desk to verify the code",
    risky: "Use the page and enter account details",
    reason: "A replacement sticker can redirect participants.",
    verified: "The organizer says the sticker is unauthorized.",
    recovery: "You submitted sign-in information to the unverified page.",
    finish: "Alert the organizer and secure any exposed account",
    mistake: "Share the sticker with other attendees",
  },
  {
    title: "The executive favor",
    setting: "Team chat",
    request:
      "A new account with your director’s photo asks for gift cards and secrecy.",
    safe: "Check through the director’s established work channel",
    risky: "Send voucher codes to the new account",
    reason: "Secrecy removes oversight and voucher codes transfer value.",
    verified: "The director confirms the new account is an impersonator.",
    recovery: "The codes may already have been redeemed.",
    finish: "Report the account and notify the issuer about any exposed codes",
    mistake: "Send a replacement code on request",
  },
];
