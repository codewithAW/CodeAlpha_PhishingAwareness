import type { Lesson } from "../types";
export const lessons: Lesson[] = [
  {
    title: "Phishing fundamentals",
    topic: "Foundations",
    intro: "Recognize the request behind the disguise.",
    principle:
      "Phishing impersonates a trusted person or service to persuade you to disclose information, transfer money or take another risky action. Spear phishing targets one recipient or team. Accurate personal details can come from public information.",
    example:
      "A message names your course and instructor, then asks you to approve an unexpected file share. The details establish familiarity, but they do not verify the request.",
    action:
      "Open the course portal from your bookmark. Check whether the instructor posted the file there.",
  },
  {
    title: "Reading suspicious email",
    topic: "Email signals",
    intro: "Look past the display name and inspect the request.",
    principle:
      "Expand sender details and compare the address with a known contact. Examine the reply-to address. Even a genuine mailbox can be compromised. Ask whether the attachment or approval fits an expected workflow.",
    example:
      "A supplier replies inside an existing invoice thread with new bank details. The conversation history is genuine, but the payment change still needs independent approval.",
    action:
      "Call the supplier on the number already held by finance before changing payment details.",
  },
  {
    title: "Websites and deceptive URLs",
    topic: "URL literacy",
    intro: "Identify the destination before trusting the page.",
    principle:
      "The hostname follows the scheme and ends before the path. In desk.northstar.example, desk is a subdomain of northstar.example. Real suffixes can contain multiple labels, such as co.uk. HTTPS encrypts the connection to the displayed host. A copied logo or certificate cannot establish brand ownership.",
    example:
      "In https://northstar.example.billing-desk.example/pay, the familiar name sits inside a subdomain. The controlling training domain is billing-desk.example.",
    action:
      "Visit the service using a saved bookmark or official app. Treat a shortened destination as unknown until independently verified.",
  },
  {
    title: "Pressure and impersonation",
    topic: "Social engineering",
    intro: "Spot attempts to bypass your judgment.",
    principle:
      "A message may invoke a senior leader, deadline or penalty to make normal checks feel inconvenient. Secrecy removes the colleague who might spot a mistake. A familiar voice or personal detail cannot authorize a transaction.",
    example:
      "A caller claiming to be your team lead needs a gift purchase during a meeting and asks you to keep the surprise quiet.",
    action:
      "Pause the purchase and contact the lead through your existing workplace directory. Apply the normal approval process.",
  },
  {
    title: "Texts, calls and QR codes",
    topic: "Mobile threats",
    intro: "Verify unexpected requests across channels.",
    principle:
      "Smishing uses text messages. Vishing uses calls or voice messages. Caller ID and message threads can be misleading. A QR code can hide a web address until scanned. Check the preview and watch for replacement stickers on public signs.",
    example:
      "A sticker covers the printed payment code on a parking meter. The page it opens resembles the regular parking service.",
    action:
      "Use the parking app you already have or a payment method verified on the original sign.",
  },
  {
    title: "Prevention and response",
    topic: "Incident response",
    intro: "Build safeguards and act quickly after a mistake.",
    principle:
      "Use unique passwords and MFA. Passkeys and security keys bind authentication to the intended site. Deny unexpected approval prompts. If you entered a password, open the genuine service independently, change it, and work with support to revoke active sessions.",
    example:
      "After submitting a password, you notice the portal address differs from your bookmark. The tab closes before you can inspect it further.",
    action:
      "Report the timing and actions to your response team. Change reused passwords, review recovery settings and follow device guidance.",
  },
];
