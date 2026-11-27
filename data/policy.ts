/**
 * General, plain-language summaries of common BC business topics, used for the
 * offline fallback and as reference links. Not legal advice; rules change, so
 * always check the official sources linked here.
 */

export interface PolicyTopic {
  id: string;
  title: string;
  keywords: string;
  answer: string;
  keyPoints: string[];
  sources: { title: string; url: string }[];
}

const ESB = { title: "BC Employment Standards Branch", url: "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards" };

export const POLICY_TOPICS: PolicyTopic[] = [
  {
    id: "overtime",
    title: "Hours of work and overtime",
    keywords: "overtime hours work daily weekly time and a half double time 8 40 12 shift",
    answer:
      "Under BC's Employment Standards Act, most employees earn overtime after 8 hours in a day or 40 hours in a week. Hours over 8 in a day (or 40 in a week) are paid at 1.5 times the regular wage, and hours over 12 in a day are paid at double time. Some jobs and industries have different rules, and managers and certain professionals may be excluded.",
    keyPoints: ["Overtime after 8 hours/day or 40 hours/week", "Time-and-a-half for overtime; double time after 12 hours in a day", "Some occupations are excluded or have special rules", "Averaging agreements can change how overtime is calculated"],
    sources: [ESB],
  },
  {
    id: "stat-holidays",
    title: "Statutory holidays",
    keywords: "statutory holiday stat holidays day off holiday pay canada day bc day christmas truth reconciliation",
    answer:
      "BC has 11 statutory holidays: New Year's Day, Family Day, Good Friday, Victoria Day, Canada Day, B.C. Day, Labour Day, National Day for Truth and Reconciliation, Thanksgiving, Remembrance Day and Christmas Day. Boxing Day and Easter Monday are not statutory holidays in BC. Eligible employees who get the day off receive an average day's pay; those who work it are paid time-and-a-half plus an average day's pay.",
    keyPoints: ["11 statutory holidays in BC", "Eligibility generally requires working 15 of the 30 days before the holiday", "Working the holiday: 1.5x wages plus an average day's pay", "Boxing Day is not a BC statutory holiday"],
    sources: [ESB],
  },
  {
    id: "vacation",
    title: "Vacation time and vacation pay",
    keywords: "vacation annual leave holiday pay 4% 6% weeks two three years",
    answer:
      "After 12 months of employment, BC employees are entitled to at least 2 weeks of vacation, rising to 3 weeks after 5 years. Vacation pay is at least 4% of gross earnings, rising to 6% after 5 years. Vacation must be taken within 12 months of being earned.",
    keyPoints: ["2 weeks after 1 year; 3 weeks after 5 years", "Vacation pay: 4%, then 6% after 5 years", "Employees earn vacation pay from day one, even before they can take vacation time"],
    sources: [ESB],
  },
  {
    id: "sick-leave",
    title: "Sick leave",
    keywords: "sick leave illness paid sick days injury unpaid days",
    answer:
      "Employees covered by the Employment Standards Act are entitled to 5 paid sick days and 3 unpaid sick days each year once they have worked for the employer for 90 days. Employers may ask for reasonably sufficient proof of illness. Employers can offer more generous sick leave.",
    keyPoints: ["5 paid + 3 unpaid sick days per year", "Available after 90 days of employment", "Paid at an average day's pay"],
    sources: [ESB],
  },
  {
    id: "termination",
    title: "Ending employment and final pay",
    keywords: "termination fire firing quit resign notice severance compensation length of service final pay layoff",
    answer:
      "If an employer ends employment without just cause, the employee is generally entitled to written notice, pay in lieu of notice, or a combination, based on length of service: 1 week after 3 months, 2 weeks after 12 months, 3 weeks after 3 years, plus 1 week for each additional year up to a maximum of 8 weeks. Final wages are due within 48 hours if the employer ends employment, or within 6 days if the employee quits. Common-law notice may be higher than these minimums.",
    keyPoints: ["Notice or pay in lieu scales with service, up to 8 weeks", "Final pay: 48 hours (employer ends) or 6 days (employee quits)", "Different rules can apply to group terminations", "Employment contracts and common law may give more"],
    sources: [ESB],
  },
  {
    id: "minimum-wage",
    title: "Minimum wage",
    keywords: "minimum wage pay rate hourly increase june",
    answer:
      "BC sets a general minimum wage that is reviewed and typically adjusted each year on June 1, tied to inflation. There are separate rules for some groups, such as live-in camp leaders and app-based gig workers. Because the rate changes, check the current figure on the BC government website rather than relying on a number you've seen elsewhere.",
    keyPoints: ["Adjusted annually, usually on June 1", "Applies to most employees, including part-time and students", "Separate rates exist for some occupations"],
    sources: [ESB],
  },
  {
    id: "business-licence",
    title: "Business licences",
    keywords: "business licence license permit city municipal open shop vancouver home-based inter-municipal",
    answer:
      "Business licences in BC are issued by municipalities, not the province. Most cities (such as Vancouver, Burnaby or Surrey) require a licence for any business operating within city limits, including many home-based businesses. Some regions offer an Inter-Municipal Business Licence for mobile businesses (like trades) that work across several cities. Certain activities, such as food service or liquor, need additional permits.",
    keyPoints: ["Licences come from your city or municipality", "Home-based businesses usually still need one", "Inter-municipal licences cover mobile trades across participating cities", "Zoning and other permits may also apply"],
    sources: [
      { title: "BC government: Starting a business", url: "https://www2.gov.bc.ca/gov/content/employment-business/business" },
      { title: "City of Vancouver", url: "https://vancouver.ca" },
    ],
  },
  {
    id: "registration",
    title: "Registering or incorporating a business",
    keywords: "register incorporate incorporation corporation sole proprietorship partnership business name registry name approval",
    answer:
      "In BC you can operate as a sole proprietorship, partnership or corporation. Sole proprietors using a name other than their own, and partnerships, register with BC Registries. To incorporate, you usually reserve a name (or use a numbered company) and file an incorporation application with BC Registries. You will also need a federal Business Number from the CRA for tax accounts.",
    keyPoints: ["Choose a structure: sole proprietorship, partnership or corporation", "Register or incorporate through BC Registries", "Get a CRA Business Number for tax accounts", "Speak to an accountant about the tax implications of each structure"],
    sources: [
      { title: "BC Registries and Online Services", url: "https://www.bcregistry.gov.bc.ca" },
      { title: "BC government: Starting a business", url: "https://www2.gov.bc.ca/gov/content/employment-business/business" },
    ],
  },
  {
    id: "sales-tax",
    title: "GST and PST",
    keywords: "gst pst sales tax hst register collect 30000 small supplier provincial federal tax 5% 7%",
    answer:
      "BC businesses deal with two sales taxes. GST (5%) is federal and administered by the CRA; you must register once your taxable sales exceed $30,000 over four consecutive calendar quarters (the small supplier threshold), and you can register voluntarily before that. PST (7% general rate) is provincial and applies to many goods and some services and software; businesses that sell or lease taxable goods or services in BC generally need to register with the province. Many items are exempt from PST, such as most basic groceries and restaurant food.",
    keyPoints: ["GST 5% (federal, via CRA); register above $30,000 in four consecutive quarters", "PST 7% general rate (provincial)", "PST registration depends on what you sell, not on revenue", "Keep receipts with GST numbers to claim input tax credits"],
    sources: [
      { title: "CRA: GST/HST for businesses", url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html" },
      { title: "BC Provincial Sales Tax (PST)", url: "https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/pst" },
    ],
  },
  {
    id: "hiring",
    title: "Hiring your first employee",
    keywords: "hire hiring first employee payroll worksafebc cpp ei deductions remit td1 roe",
    answer:
      "Before hiring, open a payroll program account with the CRA. You'll deduct income tax, CPP and EI from wages, add the employer's share of CPP and EI, and remit them to the CRA. You must also register with WorkSafeBC for workplace insurance coverage. New employees fill out TD1 forms, you keep payroll records, and you issue T4 slips each year and a Record of Employment when someone leaves.",
    keyPoints: ["Open a CRA payroll account", "Deduct and remit income tax, CPP and EI", "Register with WorkSafeBC", "Follow BC Employment Standards for pay, hours and leave"],
    sources: [{ title: "WorkSafeBC", url: "https://www.worksafebc.com" }, ESB],
  },
  {
    id: "privacy",
    title: "Customer privacy (PIPA)",
    keywords: "privacy personal information data customer pipa consent breach collect store",
    answer:
      "Most private-sector organizations in BC are covered by the Personal Information Protection Act (PIPA). In short: collect only the personal information you need for a clear purpose, get consent, keep it secure, let people access their own information, and keep it only as long as needed. Some federally regulated businesses fall under the federal PIPEDA instead.",
    keyPoints: ["PIPA covers most BC private-sector organizations", "Collect only what you need, with consent", "Safeguard data and limit how long you keep it", "Designate someone responsible for privacy"],
    sources: [{ title: "Office of the Information and Privacy Commissioner for BC", url: "https://www.oipc.bc.ca" }],
  },
];

export const POLICY_STARTERS = [
  "When do I have to pay overtime in BC?",
  "Is Boxing Day a stat holiday in BC?",
  "Do I need to charge GST as a small business?",
  "What do I need to do before hiring my first employee?",
  "Do I need a business licence for a home-based business?",
];
