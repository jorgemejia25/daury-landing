import type { Dictionary } from "./es";

const en: Dictionary = {
  meta: {
    title: "Daury · Family caregiving, organized",
    description:
      "Daury is the app for caring as a family: medication reminders with voice alerts, AI prescription reading, shift handoffs between caregivers and reports for the doctor. Made in Guatemala.",
    shortDescription: "The easy way to care for someone you love, together as a family.",
    keywords: [
      "Daury",
      "caregiver app",
      "elderly care",
      "medication reminder",
      "family caregiving",
      "care coordination",
      "nursing homes",
      "doctor report",
      "health app",
      "Guatemala",
    ],
    ogAlt: "Daury: the easy way to care for someone you love, together as a family.",
  },
  nav: {
    features: "Features",
    plans: "Pricing",
    faq: "FAQ",
    contact: "Contact",
    earlyAccess: "Early access",
    howItWorks: "How it works",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    main: "Main",
    mobile: "Mobile menu",
    home: "Daury, go to home",
    skip: "Skip to content",
    language: "Language",
  },
  hero: {
    title: "Caregiving is like putting together a puzzle.",
    lead: "The easy way to care for someone you love, together as a family.",
    primary: "Start for free",
    secondary: "How it works",
  },
  how: {
    eyebrow: "How it works",
    title: "Support at every step of caregiving",
    steps: [
      { title: "It tells you what's next and how to do it", text: "One activity at a time, with clear steps read out loud. No medical jargon." },
      { title: "You don't care alone", text: "Bring in your family, hand off the shift with a voice note and ask for backup when you need it." },
      { title: "It flags what changes", text: "Log how the day went with one tap. Daury spots patterns and prepares the report for the doctor." },
    ],
  },
  features: {
    label: "Features",
    routine: {
      tag: "Daily routine",
      title: "Every pill, right on time",
      text: "Reminders with voice alerts and a step-by-step guide for every activity of the day.",
      example: "Sample routine",
      items: ["Losartan", "15-min walk", "Metformin"],
    },
    ai: {
      tag: "AI-powered",
      title: "Snap the prescription and you're done",
      text: "Daury reads the medications and builds the activities. You just confirm.",
    },
    family: {
      tag: "Teamwork",
      title: "The whole family, in the loop",
      text: "Every caregiver sees what's next and who already did it. Shift changes come with notes and to-dos.",
      bubble: "gave the 1:00 pm pill. Mom ate well.",
    },
    doctor: {
      tag: "For the doctor",
      title: "Show up to the appointment with everything",
      text: "Adherence, mood and incidents in a report you can send or export to PDF.",
      week: "This week",
      days: "Mon – Sun",
      send: "Send to doctor",
    },
    perks: ["Built for Latin America, now in your language", "Read-aloud and large text", "Protected health data"],
  },
  stat: {
    label: "Fact",
    text: "of caregivers keep track of everything from memory alone.",
  },
  pricing: {
    title: "Start for free",
    sub: "And grow when your family or care center needs it.",
    perMonth: "/mo",
    freePrice: "$0",
    freeCurrency: "USD",
    free: {
      desc: "For any family ready to get started.",
      items: [
        "Routines and reminders with voice alerts",
        "Step-by-step guide read out loud",
        "Daily mood and activity log",
        "Emergency mode with key info and medication",
        "Works offline",
      ],
    },
    plus: {
      tag: "Families",
      desc: "For families with several caregivers or complex treatments. Or $79.90 per year (2 months free).",
      everything: "Everything in Free, plus:",
      items: [
        "Care circle with multiple caregivers",
        "Shift handoff with voice notes and backup requests",
        "Expanded AI prescription reading",
        "Detected patterns and PDF report for the doctor",
      ],
    },
    business: {
      desc: "Clinics, residences and senior care centers. Up to 20 patients, $3.23 per additional patient.",
      items: [
        "Staff roles and permissions",
        "All patients in one place",
        "Continuity across shifts and staff changes",
        "Family reports with no manual work",
        "Onboarding and support included",
      ],
    },
    award: {
      alt: "The Daury team receiving first place at the ILAN Innovation Awards in Guatemala",
      badge: "Team Daury",
      tag: "First place",
      title: "First-place winner of the ILAN Innovation Awards in Guatemala",
      text: "The ILAN University Innovation Awards are granted by the Israel Latin American Network (ILAN) Foundation. They recognize university student projects for their innovation, social impact and growth potential.",
    },
  },
  story: {
    eyebrow: "Our story",
    title: "Daury was born among friends",
    lead: "We are a group of friends from the University of San Carlos of Guatemala.",
    p1: "Daury came from our own stories: everyone on the team has cared for, or watched someone care for, a loved one at home. It also came from what we see in our community, where caring for someone you love is usually done with whatever is at hand.",
    p2: "The name comes from “Daughter”, the Pearl Jam song that inspired us.",
    facts: [
      "Made at USAC, Guatemala",
      "Inspired by the team's personal stories",
      "Designed for the problems of our community",
    ],
  },
  faq: {
    title: "Frequently asked questions",
    subBefore: "Don't see yours?",
    subLink: "Write to us",
    subAfter: "and we'll get back to you.",
    items: [
      {
        q: "Can I try Daury without creating an account?",
        a: "Yes. You can sign in as a guest. Your data stays only on that phone until you create your account with Google, Apple, phone or email.",
      },
      {
        q: "Do I need internet to use it?",
        a: "Not always. Daury saves everything on the phone and syncs when the connection comes back.",
      },
      {
        q: "How does my family join?",
        a: "From the app you share a link or a code. Each person joins the care circle with their role, and shifts are handed off with notes and to-dos.",
      },
      {
        q: "What does the doctor receive?",
        a: "A report with adherence, medication, incidents and suggested questions for the appointment. Send it from the app or export it to PDF.",
      },
      {
        q: "When can I start?",
        a: "We're opening early access in stages. Leave us your email or WhatsApp and we'll let you know when it's your turn.",
      },
    ],
  },
  cta: {
    tag: "Early access",
    title: "No one should care alone.",
    lead: "Request access to Daury for your family or your care center.",
  },
  form: {
    title: "Save your spot",
    iam: "I am…",
    roles: { family: "Family", center: "Care center", professional: "Healthcare professional" },
    contactLabel: "Email or WhatsApp",
    placeholder: "you@email.com",
    submit: "I want access",
    sending: "Sending…",
    successTitle: "Done, you're on the list!",
    successText: "We'll reach out at {contact}.",
    errors: {
      invalid: "Enter a valid email or WhatsApp number.",
      unavailable: "We couldn't sign you up right now. Write to us at {email}.",
      generic: "Something went wrong. Please try again in a moment.",
    },
  },
  contact: {
    title: "Let's talk",
    cards: [
      { subject: "Family inquiry", title: "Families", text: "Questions about getting started, inviting your family or using the app.", cta: "Write to us" },
      { subject: "Business plan demo", title: "Clinics and centers", text: "Discover the Business plan for senior care centers and clinics.", cta: "Request a demo" },
      { subject: "Partnerships and press", title: "Partnerships and press", text: "Universities, insurers, media and partner organizations.", cta: "Contact us" },
    ],
  },
  footer: {
    claim: "Family caregiving, organized. Made in Guatemala.",
    product: "Product",
    help: "Help",
    nav: "Footer",
    country: "Guatemala",
    madeWith: "Made with love for those who care",
  },
  notFound: {
    meta: "Page not found",
    title: "This piece doesn't fit.",
    text: "The page you're looking for doesn't exist or has moved.",
    back: "Back to home",
  },
};

export default en;
