/**
 * Static placeholder data — will be replaced by Sanity-driven content in Phase 3.
 * Keeping the same field names so the migration is purely a fetch-source swap.
 */

export type Course = {
  slug: string;
  category: string;
  name: string;
  priceCurrent: string;
  priceOriginal?: string;
  features: string[];
  duration: string;
  featured?: boolean;
};

export const courses: Course[] = [
  {
    slug: "prelims-mains-complete",
    category: "Foundation Program",
    name: "Prelims + Mains Complete",
    priceCurrent: "₹45,000",
    priceOriginal: "₹47,000",
    features: [
      "CSAT & General Studies (Full Syllabus)",
      "English – Essay & Comprehension Classes",
      "Daily & Monthly Current Affairs Tests",
      "Mock Interview Preparation",
      "App Access for 24 Months",
    ],
    duration: "Duration: 18–24 Months",
  },
  {
    slug: "combined-course",
    category: "Prelims + Mains",
    name: "Combined Course",
    priceCurrent: "₹40,000",
    priceOriginal: "₹43,000",
    features: [
      "CSAT with Topic-wise Practice",
      "Static GK + Regular Chapter Tests",
      "Daily Current Affairs Coverage",
      "Monthly Current Affairs Test",
      "App Access for 15 Months",
    ],
    duration: "Duration: 12–15 Months",
    featured: true,
  },
  {
    slug: "prelims-crash",
    category: "Prelims Only",
    name: "Prelims Crash Course",
    priceCurrent: "₹20,000",
    priceOriginal: "₹22,000",
    features: [
      "Rapid Revision of All Prelims Topics",
      "Daily Full-Length Mock Tests",
      "Current Affairs Capsule (3 Months)",
      "PYQ Analysis & Strategy Sessions",
      "App Access for 6 Months",
    ],
    duration: "Duration: 4–6 Months",
  },
];

export type Testimonial = {
  initial: string;
  text: string;
  name: string;
  rank: string;
};

export const testimonials: Testimonial[] = [
  {
    initial: "L",
    text: "The structured approach at Aspire Academy was exactly what I needed. The daily tests kept me consistently prepared, and the faculty truly understood what MPSC demands.",
    name: "Lalrindika Ralte",
    rank: "MCS – Rank 4, MPSC 2024",
  },
  {
    initial: "Z",
    text: "Joining Aspire Academy was the best decision I made. The current affairs coverage and mock tests are unmatched. I cleared Prelims on my first attempt!",
    name: "Zosangzuali Hnamte",
    rank: "MCS – Rank 11, MPSC 2024",
  },
  {
    initial: "V",
    text: "The faculty here doesn't just teach — they mentor you through the entire process. I appreciated the small batch size because I could always ask questions without hesitation.",
    name: "Vanlalhruaii Pachuau",
    rank: "MCS – Rank 7, MPSC 2023",
  },
];

export type Resource = {
  icon: "clock" | "book" | "play" | "check";
  title: string;
  description: string;
  count: string;
};

export const resources: Resource[] = [
  {
    icon: "clock",
    title: "Daily Current Affairs",
    description:
      "Updated every morning with key national & Mizoram-specific developments.",
    count: "365+ Articles",
  },
  {
    icon: "book",
    title: "MPSC Notes",
    description:
      "Subject-wise notes covering the entire MPSC General Studies syllabus.",
    count: "50+ Topic PDFs",
  },
  {
    icon: "play",
    title: "Video Lectures",
    description:
      "Watch topic-wise videos by our expert faculty, available on YouTube.",
    count: "100+ Videos",
  },
  {
    icon: "check",
    title: "Mock Test Series",
    description:
      "Full-length and topic-wise tests modelled on actual MPSC pattern.",
    count: "200+ Questions",
  },
];

export type StrategyStep = {
  num: string;
  title: string;
  description: string;
};

export const strategySteps: StrategyStep[] = [
  {
    num: "01",
    title: "Understand the MPSC Syllabus & Exam Pattern",
    description:
      "Know what MPSC actually tests before you dive into preparation. Save months of misdirected effort.",
  },
  {
    num: "02",
    title: "Build a Solid Foundation",
    description:
      "Master Static GK, Indian Polity, Geography, Economy, and History in a structured sequence.",
  },
  {
    num: "03",
    title: "Stay on Top of Current Affairs",
    description:
      "Daily current affairs with monthly tests ensure you never fall behind on dynamic topics.",
  },
  {
    num: "04",
    title: "Practice & Revise Relentlessly",
    description:
      "Mock tests, PYQ analysis, and regular revision sessions to lock in learning and build exam confidence.",
  },
];

export type VideoLecture = {
  title: string;
  description: string;
  tag: string;
  duration: string;
  thumbStyle?: string;
  href: string;
};

export const videos: VideoLecture[] = [
  {
    title: "Indian Constitution – Fundamental Rights Explained for MPSC",
    description: "Comprehensive coverage of Part III with PYQ analysis",
    tag: "Polity",
    duration: "18:42",
    href: "https://youtube.com/@aspireacademymizo",
  },
  {
    title: "Monthly Current Affairs Roundup – May 2026 | MPSC Special",
    description: "All key events and developments relevant to MPSC 2026",
    tag: "Current Affairs",
    duration: "24:15",
    thumbStyle: "linear-gradient(135deg,#2E6B5A 0%,#1A3C34 100%)",
    href: "https://youtube.com/@aspireacademymizo",
  },
  {
    title: "How to Start MPSC Preparation from Scratch – Complete Roadmap",
    description: "A step-by-step guide for beginners starting their MPSC journey",
    tag: "Strategy",
    duration: "31:08",
    thumbStyle: "linear-gradient(135deg,#C9901C 0%,#1A3C34 100%)",
    href: "https://youtube.com/@aspireacademymizo",
  },
];

export type WhyItem = {
  icon: "compass" | "library" | "checkSquare" | "users";
  title: string;
  description: string;
};

export const whyItems: WhyItem[] = [
  {
    icon: "compass",
    title: "Expert Faculty with MPSC Experience",
    description:
      "Our teachers have firsthand knowledge of the MPSC exam pattern and marking scheme, giving you a genuine edge.",
  },
  {
    icon: "library",
    title: "Comprehensive Study Materials",
    description:
      "Carefully curated notes, previous year question analyses, and monthly current affairs designed specifically for MPSC.",
  },
  {
    icon: "checkSquare",
    title: "Daily Mock Tests & Analytics",
    description:
      "Identify weaknesses fast with regular topic-wise tests, full-length mocks, and personalized performance reports.",
  },
  {
    icon: "users",
    title: "Small Batches for Individual Attention",
    description:
      "We cap each batch at 80 students so every aspirant gets personalized guidance and direct access to faculty.",
  },
];

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#why" },
  { label: "Faculty", href: "#faculty" },
  { label: "Courses", href: "#courses" },
  { label: "Study Materials", href: "#resources" },
  { label: "Webinars", href: "#strategy" },
  { label: "Contact", href: "#contact" },
] as const;

export const featuresBand = [
  { icon: "🎓", num: "500+", label: "Students Enrolled" },
  { icon: "🏆", num: "20+", label: "MPSC Selections" },
  { icon: "📚", num: "100+", label: "Study Materials" },
  { icon: "✅", num: "95%", label: "Student Satisfaction" },
  { icon: "📅", num: "5+", label: "Years of Excellence" },
];

export const heroStats = [
  { num: "500", suffix: "+", label: "Students Trained" },
  { num: "95", suffix: "%", label: "Success Rate" },
  { num: "5", suffix: "+", label: "Years of Excellence" },
  { num: "20", suffix: "+", label: "MPSC Selections" },
];

/* ============================================
   "Our courses" mini cards (3 small icon cards under hero)
============================================ */
export type MiniCourseCard = {
  icon: "library" | "lightbulb" | "book";
  title: string;
  description: string;
  href: string;
};

export const miniCourseCards: MiniCourseCard[] = [
  {
    icon: "library",
    title: "Static GK",
    description:
      "Topic-wise notes covering Polity, History, Geography, Economy & more.",
    href: "#resources",
  },
  {
    icon: "lightbulb",
    title: "Current Affairs",
    description:
      "Daily national & Mizoram-specific updates with monthly comprehensive tests.",
    href: "#resources",
  },
  {
    icon: "book",
    title: "Study Materials",
    description:
      "Curated PDFs, mock tests, and PYQ analysis — built for the MPSC pattern.",
    href: "#resources",
  },
];

/* ============================================
   Why Choose – simple Chase-style bullets
============================================ */
export const whyBullets = [
  "Expert Faculty",
  "Comprehensive Study Material",
  "Mock Tests & Analytics",
  "Proven Results",
] as const;

/* ============================================
   Rotating headline + Webinar roadmap
============================================ */
export const rotatingWords = [
  "Regular Webinar",
  "Mock Interview",
  "Expert Guidance",
  "Live Q&A Session",
] as const;

export const roadmapPoints = [
  "The true essence of the MCS in light of the MPSC Syllabus and Previous years' questions",
  "How to begin preparation",
  "What to focus on in the foundation stage of your preparation",
  "How to study Current Affairs",
  "Qualities MPSC is looking for in an ideal candidate",
] as const;

/* ============================================
   "Learn THROUGH Videos" – 3 stat blocks
============================================ */
export type VideoStat = {
  num: string;
  suffix?: string;
  title: string;
  description: string;
};

export const videoStats: VideoStat[] = [
  {
    num: "5",
    suffix: "+",
    title: "Years of Expertise",
    description: "Years of expertise in training MPSC aspirants in Mizoram.",
  },
  {
    num: "100",
    suffix: "%",
    title: "Goal-Oriented Program",
    description:
      "Structured program designed to make sure you stay on track till the final interview.",
  },
  {
    num: "80",
    title: "Max Batch Size",
    description:
      "Small batch sizes for individual attention — every student matters.",
  },
];

/* ============================================
   Footer columns
============================================ */
export const footerQuickLinks = [
  { href: "/", label: "Home" },
  { href: "#courses", label: "Courses" },
  { href: "#resources", label: "Study Materials" },
  { href: "#strategy", label: "Webinars" },
  { href: "#why", label: "About Us" },
  { href: "#contact", label: "Contact" },
] as const;

export const footerPopularPages = [
  { href: "#courses", label: "Foundation Course" },
  { href: "#courses", label: "Combined Course" },
  { href: "#courses", label: "Prelims Crash Course" },
  { href: "#testimonials", label: "Success Stories" },
  { href: "#strategy", label: "Free Webinar" },
] as const;

/* ============================================
   Faculty
============================================ */
export type Faculty = {
  slug: string;
  name: string;
  subject: string;
  image: string;
};

export const faculty: Faculty[] = [
  {
    slug: "natalia-rosangliani-sailo",
    name: "Natalia Rosangliani Sailo",
    subject: "General Science & Geography",
    image: "/faculty/natalia-rosangliani-sailo.png",
  },
  {
    slug: "ngurauva",
    name: "Ngurauva",
    subject: "Maths & Reasoning",
    image: "/faculty/ngurauva.png",
  },
  {
    slug: "h-frankie-lalnunmawia",
    name: "H. Frankie Lalnunmawia",
    subject: "Maths & Reasoning",
    image: "/faculty/h-frankie-lalnunmawia.png",
  },
  {
    slug: "jonellie-vl-rinpuii",
    name: "Jonellie VL Rinpuii",
    subject:
      "Indian Polity, Governance, Internal Security & International Relations",
    image: "/faculty/jonellie-vl-rinpuii.png",
  },
  {
    slug: "gabriel-lalmuankima",
    name: "Gabriel Lalmuankima",
    subject: "Mizo",
    image: "/faculty/gabriel-lalmuankima.png",
  },
  {
    slug: "dr-c-zohmingsangi",
    name: "Dr. C. Zohmingsangi",
    subject: "EVS & General Science",
    image: "/faculty/dr-c-zohmingsangi.png",
  },
];
