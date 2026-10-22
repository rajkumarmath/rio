import Link from "next/link";
import Image from "next/image";

export const instant = false;

const ACHIEVERS = [
  {
    name: "Priya Sharma",
    batch: "Class of 2018",
    school: "School of Computer Science & Engineering",
    role: "Staff Software Engineer, Google Cloud",
    location: "Sunnyvale, California, USA",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces",
    achievements: "Key contributor to scalable Kubernetes infrastructure and open-source distributed systems. Regular keynote speaker at international developer conferences.",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Priya+Sharma+REVA+University",
  },
  {
    name: "Vikramaditya Patil",
    batch: "Class of 2016",
    school: "School of Electronics & Communication Engineering",
    role: "Director of Product, Microsoft AI",
    location: "Redmond, Washington, USA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces",
    achievements: "Spearheaded enterprise AI copilot integrations across global Fortune 500 ecosystems. Recipient of the REVA Young Alumnus Excellence Award.",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Vikramaditya+Patil+REVA+University",
  },
  {
    name: "Dr. Ananya Rao",
    batch: "Class of 2017",
    school: "School of Applied Sciences",
    role: "Senior Research Fellow, Oxford University",
    location: "Oxford, United Kingdom",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces",
    achievements: "Published 18+ papers in Nature and IEEE on quantum materials. Mentors female STEM undergraduates across India and the Commonwealth.",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Ananya+Rao+REVA+University",
  },
  {
    name: "Arjun Nair",
    batch: "Class of 2015",
    school: "School of Management Studies",
    role: "Founder & CEO, ApexFin Technologies",
    location: "Bengaluru, India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces",
    achievements: "Founded fintech startup valued at $120M+, creating 400+ tech jobs in Karnataka. Angel investor in early-stage student ventures at REVA NEST.",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Arjun+Nair+REVA+University",
  },
  {
    name: "Sneha Kulkarni",
    batch: "Class of 2019",
    school: "School of Legal Studies",
    role: "Assistant Commissioner, Indian Administrative Service (IAS)",
    location: "New Delhi, India",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&h=300&fit=crop&crop=faces",
    achievements: "Cleared UPSC Civil Services Examination in top 35 national ranks. Leads digital public welfare and education delivery initiatives.",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Sneha+Kulkarni+REVA+University",
  },
  {
    name: "Rohan Deshmukh",
    batch: "Class of 2020",
    school: "School of Mechanical Engineering",
    role: "Lead Propulsion Engineer, Skyroot Aerospace",
    location: "Hyderabad, India",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces",
    achievements: "Key engineer on private cryogenic rocket engine development in India. Dedicated mentor for REVA Robotics and Aerospace student clubs.",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Rohan+Deshmukh+REVA+University",
  },
];

export default function AchieversPage() {
  return (
    <div className="container py-lg">
      {/* Header */}
      <div className="card mb-lg text-center" style={{ padding: '3rem 1.5rem', background: 'var(--bg-color)' }}>
        <span className="badge-reva-navy mb-xs" style={{ display: 'inline-block' }}>HALL OF FAME</span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>
          Distinguished Alumni Achievers
        </h1>
        <p className="text-secondary" style={{ maxWidth: '750px', margin: '0.75rem auto 1.5rem', lineHeight: 1.6 }}>
          Celebrating exceptional graduates from Rukmini Knowledge Park who exemplify leadership, innovation, and service across global industry, academia, and governance.
        </p>

        <div className="flex justify-center gap-md">
          <Link href="/alumni" className="btn btn-accent" style={{ padding: '0.75rem 1.8rem' }}>
            Explore Full Directory
          </Link>
          <Link href="/signin" className="btn btn-outline" style={{ padding: '0.75rem 1.8rem' }}>
            Nominate an Achiever
          </Link>
        </div>
      </div>

      {/* Achievers Grid */}
      <div className="grid grid-cols-3 gap-lg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {ACHIEVERS.map((achiever, i) => (
          <div key={i} className="card flex flex-col justify-between" style={{ padding: '1.75rem' }}>
            <div>
              <div className="flex items-center gap-md mb-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={achiever.avatar}
                  alt={achiever.name}
                  className="avatar-circle"
                  style={{ width: '80px', height: '80px', border: '3.5px solid var(--accent-color)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: 0 }}>
                    {achiever.name}
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: 'var(--accent-color)', marginTop: '0.2rem' }}>
                    {achiever.batch}
                  </p>
                  <p className="text-xs text-secondary">{achiever.school}</p>
                </div>
              </div>

              <div className="mb-sm">
                <span className="text-sm font-semibold" style={{ color: 'var(--primary-color)', display: 'block' }}>
                  {achiever.role}
                </span>
                <span className="text-xs text-secondary flex items-center gap-xs mt-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {achiever.location}
                </span>
              </div>

              <p className="text-secondary text-sm" style={{ lineHeight: 1.5, marginTop: '0.75rem' }}>
                {achiever.achievements}
              </p>
            </div>

            <div className="mt-md pt-sm flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span className="text-xs text-secondary font-semibold">REVA Pride</span>
              <a
                href={achiever.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold flex items-center gap-xs"
                style={{ color: '#0A66C2' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
