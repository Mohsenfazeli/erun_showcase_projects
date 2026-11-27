/**
 * SAMPLE customer emails for a fictional online retailer, "Northwind Coastal Supply".
 * Includes pre-written triage results used when the AI is unavailable.
 */

export const CATEGORIES = ["Billing", "Order & delivery", "Technical issue", "Account access", "Sales inquiry", "Returns & refunds", "Feedback"] as const;
export const URGENCIES = ["Low", "Medium", "High", "Critical"] as const;
export const SENTIMENTS = ["Positive", "Neutral", "Frustrated", "Angry"] as const;
export const TEAMS = ["Billing team", "Fulfilment & logistics", "Technical support", "Account security", "Sales", "Customer success"] as const;

export interface TriageResult {
  category: (typeof CATEGORIES)[number];
  urgency: (typeof URGENCIES)[number];
  sentiment: (typeof SENTIMENTS)[number];
  team: (typeof TEAMS)[number];
  summary: string;
  reasoning: string;
  reply: string;
}

export interface SampleEmail {
  id: string;
  label: string;
  from: string;
  subject: string;
  body: string;
  triage: TriageResult;
}

export const SAMPLE_EMAILS: SampleEmail[] = [
  {
    id: "double-charge",
    label: "Charged twice",
    from: "Priya S.",
    subject: "Charged twice for order #48213",
    body: "Hi,\n\nI placed order #48213 on Monday and I just noticed my credit card was charged twice ($212.40 each). I only placed one order. Can you please refund the duplicate charge? I'd like this sorted before my statement closes on Friday.\n\nThanks,\nPriya",
    triage: {
      category: "Billing",
      urgency: "High",
      sentiment: "Frustrated",
      team: "Billing team",
      summary: "Customer was charged twice ($212.40 x2) for order #48213 and wants the duplicate refunded before Friday.",
      reasoning: "Money taken in error with a stated deadline. Polite but concerned.",
      reply: "Hi Priya,\n\nThank you for letting us know, and I'm sorry for the worry. I can see why a duplicate charge of $212.40 on order #48213 is concerning.\n\nI've flagged this with our billing team to confirm the duplicate payment and issue a refund. You'll receive a confirmation email as soon as it's processed, and we'll aim to have it done before Friday. Depending on your bank, the refund can take a few business days to appear.\n\nIf you have any other questions in the meantime, just reply to this email.\n\nBest regards,\nNorthwind Coastal Supply Support",
    },
  },
  {
    id: "late-order",
    label: "Order hasn't arrived",
    from: "Mark T.",
    subject: "WHERE IS MY ORDER??",
    body: "This is ridiculous. I ordered a tent and two sleeping bags THREE WEEKS ago (order 47790) for a trip that starts Saturday. Tracking hasn't updated in 10 days. Nobody answered my last two emails. If it doesn't arrive by Friday I want a full refund and I'll be leaving a review about this.",
    triage: {
      category: "Order & delivery",
      urgency: "Critical",
      sentiment: "Angry",
      team: "Fulfilment & logistics",
      summary: "Order 47790 (tent + 2 sleeping bags) placed 3 weeks ago, tracking stalled for 10 days; customer needs it before a Saturday trip and has had no reply to two earlier emails.",
      reasoning: "Hard deadline in days, repeated unanswered contacts, refund and public review threatened.",
      reply: "Hi Mark,\n\nI'm really sorry. Three weeks without your order, stalled tracking and no reply to your earlier emails is not the experience we want for you, especially with your trip on Saturday.\n\nI've escalated order 47790 to our logistics team as a priority today. We're contacting the carrier for an exact location, and if we can't confirm delivery before Friday we'll offer to ship replacements by express at no cost or issue a full refund, whichever you prefer.\n\nI'll personally follow up with an update by end of day tomorrow at the latest.\n\nSincerely,\nNorthwind Coastal Supply Support",
    },
  },
  {
    id: "locked-out",
    label: "Locked out of account",
    from: "Jordan L.",
    subject: "Can't log in, 2FA codes not arriving",
    body: "Hello, I changed phones last week and now I can't get the two-factor codes to log into my account. I have saved payment details on there. Can you help me get back in? My email is the one I'm writing from.",
    triage: {
      category: "Account access",
      urgency: "Medium",
      sentiment: "Neutral",
      team: "Account security",
      summary: "Customer changed phones and no longer receives 2FA codes; needs help regaining account access.",
      reasoning: "Access blocked but no urgency stated. Requires identity verification, so routed to security.",
      reply: "Hi Jordan,\n\nThanks for reaching out. Sorry you're locked out after switching phones; that's a common issue and we can help.\n\nFor your security, our account team will first verify your identity. You'll receive a separate email from our security team with a short verification step. Once that's complete, we'll reset two-factor authentication so you can set it up on your new phone.\n\nPlease never send passwords or full card numbers by email.\n\nBest regards,\nNorthwind Coastal Supply Support",
    },
  },
  {
    id: "wholesale",
    label: "Wholesale inquiry",
    from: "Alicia M., Sea to Sky Outfitters",
    subject: "Wholesale pricing for our shop",
    body: "Hi there,\n\nI run a small outdoor shop in Squamish and we're interested in carrying your rain shells and trail packs for spring. Do you offer wholesale pricing, and what are the minimum order quantities? We'd be looking at roughly 40-60 units to start.\n\nCheers,\nAlicia",
    triage: {
      category: "Sales inquiry",
      urgency: "Medium",
      sentiment: "Positive",
      team: "Sales",
      summary: "Retailer in Squamish interested in stocking rain shells and trail packs (40–60 units) for spring; asks about wholesale pricing and MOQs.",
      reasoning: "Revenue opportunity with a seasonal timeline. Route to Sales for a quote.",
      reply: "Hi Alicia,\n\nThanks so much for thinking of us for Sea to Sky Outfitters. We'd love to talk about carrying our rain shells and trail packs this spring.\n\nI've passed your note to our wholesale team, who will send over our current wholesale price list, minimum order quantities and spring lead times within one business day. An order of 40–60 units is a great starting point.\n\nLooking forward to working together.\n\nBest,\nNorthwind Coastal Supply",
    },
  },
  {
    id: "feedback",
    label: "Happy customer",
    from: "Sam K.",
    subject: "Love the new jacket",
    body: "Just wanted to say the rain shell held up perfectly on the West Coast Trail last week. Bone dry for 7 days! One small thing: it would be great if the website showed the packed size of the jacket. Thanks!",
    triage: {
      category: "Feedback",
      urgency: "Low",
      sentiment: "Positive",
      team: "Customer success",
      summary: "Customer praises the rain shell after the West Coast Trail and suggests adding packed size to the product page.",
      reasoning: "Positive feedback with a useful product-page suggestion. No action needed urgently.",
      reply: "Hi Sam,\n\nThank you for taking the time to write! Seven dry days on the West Coast Trail is exactly what we hope for, and it made the team's day.\n\nGreat suggestion on the packed size, too. I've shared it with our product team so we can add it to the product page.\n\nHappy trails,\nNorthwind Coastal Supply Support",
    },
  },
];
