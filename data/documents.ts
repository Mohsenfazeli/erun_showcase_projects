/**
 * SAMPLE DOCUMENTS for the fictional company "Northwind Coastal Supply"
 * Written for the demo; not real policies.
 */

export interface DocSection {
  id: string;
  heading: string;
  text: string;
}

export interface CompanyDoc {
  id: string;
  title: string;
  sections: DocSection[];
}

export const KB_COMPANY = "Northwind Coastal Supply";

export const DOCUMENTS: CompanyDoc[] = [
  {
    id: "handbook",
    title: "Employee Handbook",
    sections: [
      { id: "HB-1.1", heading: "Working hours", text: "Standard working hours are 37.5 hours per week, Monday to Friday. Core collaboration hours are 10:00 to 15:00 Pacific time; outside those hours, staff may set their own schedule with their manager's agreement." },
      { id: "HB-1.2", heading: "Hybrid and remote work", text: "Employees may work remotely up to three days per week. Teams agree on at least one common office day. Fully remote arrangements require Director approval and a signed remote work agreement." },
      { id: "HB-2.1", heading: "Vacation", text: "Full-time employees receive 15 days of paid vacation per year, increasing to 20 days after three years of service and 25 days after seven years. Vacation requests should be submitted in the HR portal at least two weeks in advance. Up to five unused days may be carried over to the next year." },
      { id: "HB-2.2", heading: "Sick days and personal days", text: "Employees receive 7 paid sick days and 2 paid personal days per calendar year. For absences longer than three consecutive days, a note from a health practitioner may be requested. Sick days do not carry over." },
      { id: "HB-2.3", heading: "Statutory holidays", text: "The office is closed on all BC statutory holidays. Employees who are required to work on a statutory holiday receive time-and-a-half pay plus a day in lieu." },
      { id: "HB-3.1", heading: "Professional development", text: "Each employee has an annual learning budget of $1,500 for courses, certifications and conferences. Requests above $500 require manager approval. Employees who leave within six months of a reimbursed certification may be asked to repay 50% of its cost." },
      { id: "HB-3.2", heading: "Performance reviews", text: "Performance check-ins happen quarterly, with a formal annual review in January. Salary adjustments take effect on April 1." },
      { id: "HB-4.1", heading: "Parental leave top-up", text: "After one year of service, employees on maternity or parental leave receive a top-up to 80% of base salary for up to 17 weeks, in addition to government benefits." },
    ],
  },
  {
    id: "travel",
    title: "Travel & Expense Policy",
    sections: [
      { id: "TE-1.1", heading: "Pre-approval", text: "All business travel requires manager pre-approval through the travel request form. Travel outside Canada and the United States also requires Director approval." },
      { id: "TE-2.1", heading: "Flights", text: "Book economy class for flights under six hours. Premium economy is allowed for flights over six hours. Flights should be booked at least 14 days in advance where possible through the company travel portal." },
      { id: "TE-2.2", heading: "Hotels", text: "Hotel limits are $250 per night in Vancouver, Toronto and Calgary, $300 per night in New York and San Francisco, and $200 per night elsewhere (CAD, before taxes). Exceptions need manager approval in advance." },
      { id: "TE-3.1", heading: "Meals and per diem", text: "The daily meal per diem is $75 CAD for travel within Canada and $90 CAD for international travel. Receipts are not required for per diem. Alcohol is not reimbursable except at approved client events." },
      { id: "TE-3.2", heading: "Mileage and ground transport", text: "Use of a personal vehicle is reimbursed at $0.70 per kilometre. Taxis and rideshares are reimbursed with receipts; public transit is encouraged where practical." },
      { id: "TE-4.1", heading: "Submitting expenses", text: "Submit expense claims within 30 days of the expense date through the expense app, with itemised receipts for anything over $25. Claims submitted after 60 days may not be reimbursed. Reimbursement is paid with the next payroll run." },
      { id: "TE-4.2", heading: "Corporate card", text: "Employees who travel more than four times per year may request a corporate card. Personal expenses must never be charged to the corporate card." },
    ],
  },
  {
    id: "it",
    title: "IT & Security Policy",
    sections: [
      { id: "IT-1.1", heading: "Equipment", text: "Each employee receives a company laptop, refreshed every three years. A one-time home office allowance of $600 is available for monitors, chairs and accessories." },
      { id: "IT-1.2", heading: "Passwords and MFA", text: "Use the company password manager for all work accounts. Multi-factor authentication is mandatory for email, the HR portal and all client systems. Never share passwords, even with IT staff." },
      { id: "IT-2.1", heading: "Lost or stolen devices", text: "Report a lost or stolen device to the IT help desk within one hour at helpdesk@northwind.example or by calling the IT line. IT will remotely lock and wipe the device." },
      { id: "IT-2.2", heading: "Public Wi-Fi", text: "When working from cafés, airports or hotels, always connect through the company VPN. Do not work with client data on shared or public computers." },
      { id: "IT-3.1", heading: "AI tools", text: "Only company-approved AI tools may be used with internal or client information. Never paste client data, personal information or source code into public AI chatbots." },
    ],
  },
];

export const ALL_SECTIONS = DOCUMENTS.flatMap((d) => d.sections.map((s) => ({ ...s, docId: d.id, docTitle: d.title })));

export const STARTER_QUESTIONS = [
  "I've been here 4 years. How much vacation do I get?",
  "What's the hotel limit for a trip to Toronto?",
  "How long do I have to submit an expense claim?",
  "I lost my laptop at the airport. What should I do?",
  "Can I use ChatGPT with customer data?",
];
