import Link from "next/link";

export const instant = false;

const ROLES = [
  {
    title: "Software Development Engineer II (Backend)",
    company: "Amazon Web Services (AWS)",
    location: "Bengaluru, India",
    type: "Full-Time",
    batchEligible: "Graduates 2020 - 2024",
    postedBy: "Karthik Gowda (Class of '21)",
    email: "karthik.gowda@amazon.com",
    skills: ["Python", "Go", "AWS DynamoDB", "Microservices"],
  },
  {
    title: "AI Research & Development Intern",
    company: "Bosch Global Software Technologies",
    location: "Adugodi Campus, Bengaluru",
    type: "Student Internship (6 Months)",
    batchEligible: "Current 3rd & 4th Year B.Tech / M.Tech",
    postedBy: "Sneha Murthy (Class of '22)",
    email: "sneha.murthy@bosch.com",
    skills: ["Computer Vision", "PyTorch", "Embedded C++"],
  },
  {
    title: "Product Analyst / Associate Product Manager",
    company: "Swiggy",
    location: "Bengaluru (Hybrid)",
    type: "Full-Time",
    batchEligible: "Graduates 2022 - 2025",
    postedBy: "Naveen Raj (Class of '20)",
    email: "naveen.raj@swiggy.in",
    skills: ["SQL", "Product Analytics", "A/B Testing"],
  },
  {
    title: "Cloud Infrastructure Engineering Intern",
    company: "Infosys Labs",
    location: "Electronic City, Bengaluru",
    type: "Student Internship (3 Months)",
    batchEligible: "Pre-Final & Final Year Students",
    postedBy: "Ramesh K. (Class of '19)",
    email: "ramesh.k@infosys.com",
    skills: ["Docker", "Kubernetes", "Linux Shell"],
  },
  {
    title: "Graduate Legal Counsel & Compliance Associate",
    company: "Trilegal India",
    location: "Bengaluru, India",
    type: "Full-Time",
    batchEligible: "BBA.LL.B / LL.M Graduates 2024 - 2025",
    postedBy: "Pooja Hegde (Class of '23)",
    email: "pooja.hegde@trilegal.com",
    skills: ["Corporate Law", "Contract Drafting", "Intellectual Property"],
  },
];

export default function OpportunitiesPage() {
  return (
    <div className="container py-lg">
      {/* Header */}
      <div className="card mb-lg text-center" style={{ padding: '3rem 1.5rem', background: 'var(--bg-color)' }}>
        <span className="badge-reva-navy mb-xs" style={{ display: 'inline-block' }}>CAREER ACCELERATION</span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>
          Alumni Career &amp; Internship Board
        </h1>
        <p className="text-secondary" style={{ maxWidth: '720px', margin: '0.75rem auto 1.5rem', lineHeight: 1.6 }}>
          Exclusive job openings, verified alumni referrals, and student internships shared directly by REVA alumni across leading multinational tech companies, law firms, and research labs.
        </p>

        <div className="flex justify-center gap-md">
          <Link href="/signin" className="btn btn-accent" style={{ padding: '0.75rem 1.8rem' }}>
            Post an Opening or Referral
          </Link>
          <Link href="/alumni" className="btn btn-outline" style={{ padding: '0.75rem 1.8rem' }}>
            Browse Alumni by Company
          </Link>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-md">
        {ROLES.map((role, i) => (
          <div key={i} className="card flex items-center justify-between" style={{ padding: '1.75rem', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div className="flex items-center gap-xs mb-xs" style={{ flexWrap: 'wrap' }}>
                <span className={role.type.includes("Internship") ? "badge-mentor" : "badge-reva-navy"}>
                  {role.type}
                </span>
                <span className="text-xs text-secondary">{role.batchEligible}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: '0.25rem 0' }}>
                {role.title}
              </h3>

              <p className="text-sm font-semibold" style={{ color: 'var(--accent-color)' }}>
                {role.company} &bull; <span className="text-secondary font-normal">{role.location}</span>
              </p>

              <div className="flex gap-xs mt-sm" style={{ flexWrap: 'wrap' }}>
                {role.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-xs text-secondary mt-sm">
                Referrer: <strong>{role.postedBy}</strong>
              </p>
            </div>

            <div className="flex items-center gap-sm">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(role.email)}&su=${encodeURIComponent(`REVA Alumni Referral Application - ${role.title}`)}&body=${encodeURIComponent(`Dear ${role.postedBy},\n\nI am a REVA University student/alumnus interested in the ${role.title} opening at ${role.company}.\n\nPlease find my resume attached.\n\nBest regards,`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent flex items-center gap-xs"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Request Referral via Gmail
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
