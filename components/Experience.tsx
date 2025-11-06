import React, { useState } from 'react';

interface ExperienceItemProps {
  role: string;
  company: string;
  duration: string;
  location: string;
  points: string[];
  logoUrls: string[];
}

const workExperience: ExperienceItemProps[] = [
    {
        role: "Software Engineer Intern",
        company: "SnapRefund Inc.",
        duration: "Jun 2025 - Present",
        location: "Los Angeles, CA, USA",
        logoUrls: ["https://img.logo.dev/snaprefund.io?token=pk_XFuxQT5RQj6fYiG8k5sbBQ"],
        points: [
            "Crafting a role-based Identity and Access Management (IAM) system with PostgreSQL, NestJS, Vue.js, and Nuxt, cutting user onboarding time by 80% through dynamic role/permission management and automated flows.",
            "Managing environment variables and email templates with AWS Session Manager and AWS Console, streamlining deployment workflows and simplifying dynamic content updates.",
        ],
    },
    {
        role: "Senior Software Engineer",
        company: "Accolite Digital | Morgan Stanley",
        duration: "Jul 2021 - Jun 2024",
        location: "Bangalore, KA, India",
        logoUrls: ["https://img.logo.dev/morganstanley.com?token=pk_XFuxQT5RQj6fYiG8k5sbBQ"],
        points: [
            "Designed a real-time revenue dashboard in Spring Boot, React, and Highcharts, contributing to a 70% increase in revenue through data-driven insights.",
            "Built and maintained a shared library of StencilJS + Tailwind components used across 5+ internal apps, speeding up feature delivery time by 90%.",
            "Adopted LaunchDarkly for real-time feature flagging, minimizing deployment risk by 75%.",
            "Implemented a centralized Notification Center with Kafka and Redis, boosting user satisfaction by 80%.",
        ],
    },
    {
        role: "Software Engineer",
        company: "Accolite Digital | Morgan Stanley",
        duration: "Jul 2020 - Jun 2021",
        location: "Bangalore, KA, India",
        logoUrls: ["https://img.logo.dev/morganstanley.com?token=pk_XFuxQT5RQj6fYiG8k5sbBQ"],
        points: [
            "Championed micro-service and micro-frontend adoption via Spring Boot, React, and Webpack Module Federation.",
            "Rolled out a lightweight feature toggle mechanism in MongoDB and Java.",
        ],
    },
    {
        role: "Software Engineer Intern",
        company: "Accolite Digital | Juspay Technologies",
        duration: "Jan 2020 - Jun 2020",
        location: "Bangalore, KA, India",
        logoUrls: ["https://img.logo.dev/juspay.io?token=pk_XFuxQT5RQj6fYiG8k5sbBQ"],
        points: [
            "Handled Single Sign-On for a payments dashboard, wiring up OpenID Connect (OIDC) with JWT-based auth flows in Vanilla JavaScript and Node.js.",
        ],
    },
];

const DetailsCard: React.FC<{ job: ExperienceItemProps }> = ({ job }) => (
    <div
        className="w-full bg-secondary rounded-lg shadow-2xl shadow-black/30 p-8 h-[600px] md:h-[500px] flex flex-col animate-content-fade-in"
    >
        <div className="flex-shrink-0 mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{job.role}</h3>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-lg sm:text-xl text-accent font-semibold">{job.company}</p>
            </div>
            <p className="text-text-secondary text-sm mt-2">{job.duration} &middot; {job.location}</p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
            <ul className="list-disc list-inside space-y-3 text-text-secondary mt-4 text-sm sm:text-base">
                {job.points.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
        </div>
    </div>
);

const Experience: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section
            id="experience"
            className="animate-slide-in-up"
            style={{ animationDelay: '250ms' }}
        >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Work Experience</h2>
            <div className="max-w-5xl mx-auto w-full">
                {/* Content display */}
                <div className="relative">
                    <DetailsCard key={activeIndex} job={workExperience[activeIndex]} />
                </div>

                {/* New Horizontal Timeline Navigation */}
                <div className="timeline-wrapper mt-6">
                    <div className="timeline-line"></div>
                    <div className="timeline-entries">
                        {workExperience.map((job, index) => (
                            <div
                                key={index}
                                className="timeline-entry"
                                onClick={() => setActiveIndex(index)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveIndex(index)}
                                aria-label={`View details for ${job.company}`}
                            >
                                <div className={`timeline-logo ${activeIndex === index ? 'active' : ''}`}>
                                    <img 
                                      src={job.logoUrls[job.logoUrls.length - 1]} 
                                      alt={`${job.company.split(' | ').pop()} logo`} 
                                    />
                                </div>
                                <div className="timeline-label">
                                    <p className={`company ${activeIndex === index ? 'active' : ''}`}>
                                        {job.company.split(' | ').pop()}
                                    </p>
                                    <p className="duration">{job.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;