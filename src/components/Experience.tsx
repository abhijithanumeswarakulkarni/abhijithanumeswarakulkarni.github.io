import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'
import MSLogo from '../assets/images/morgan.png';
import JuspayLogo from '../assets/images/juspay.jpeg';
import SRLogo from '../assets/images/SRLogo.png';

function Experience() {
  return (
    <div id="experience">
      <div className="items-container">
        <h1>Experience</h1>
        <VerticalTimeline
          layout="1-column-left"
        >
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid  white' }}
            iconStyle={{ background: '#000', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <div className="experience-details">
              <div className="experience-logo">
                  <img src={SRLogo} style={{height: "13px"}} alt="SR Logo"/>
              </div>
              <div className="experience-desc">
                <div className="experience-title">
                  <h2 className="vertical-timeline-element-title">SnapRefund Inc.</h2>
                  <h4 className="vertical-timeline-element-subtitle">Software Engineer Intern</h4>
                  <p className="vertical-timeline-element-subtitle-sub">Jun 2025 - Present</p>
                  <p className="vertical-timeline-element-subtitle-sub">Los Angeles, CA, USA</p>
                </div>
                <ul>
                  <li>Crafted a role-based Identity and Access Management (IAM) system with PostgreSQL, NestJS, Vue.js, and Nuxt, cutting user onboarding time by 80% through dynamic role/permission management and automated flows</li>
                  <li>Managed environment variables and email templates with AWS Session Manager and AWS Console, streamlining deployment workflows and simplifying dynamic content updates</li>
                </ul>
              </div>
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid  white' }}
            iconStyle={{ background: '#000', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <div className="experience-details">
              <div className="experience-logo">
                  <img src={MSLogo} style={{height: "50px"}} alt="MS Logo"/>
              </div>
              <div className="experience-desc">
                <div className="experience-title">
                  <h2 className="vertical-timeline-element-title">Morgan Stanley</h2>
                  <h4 className="vertical-timeline-element-subtitle">Senior Software Engineer</h4>
                  <p className="vertical-timeline-element-subtitle-sub">Jul 2021 - Jun 2024</p>
                  <p className="vertical-timeline-element-subtitle-sub">Bangalore, KA, India</p>
                </div>
                <ul>
                  <li>Designed a real-time revenue dashboard built with Spring Boot, React and Highcharts, contributing to a 70% increase in revenue through data-driven insights for the investment representatives</li>
                  <li>Architected Blesk, a modular wrapper library utilizing window.postMessage for secure inter-widget communication, shortening integration time by 30%, and driving adoption across multiple teams within the department</li>
                  <li>Spearheaded reusable UI component development styled via Stencil JS and Tailwind CSS, accelerating feature delivery by 90%</li>
                  <li>Developed interactive features such as Save View, Theme Switcher, and Preferences using React, MongoDB, and Spring Boot, supporting persistent personalized layouts across sessions and boosting user efficiency by 50%</li>
                  <li>Adopted LaunchDarkly across frontend and backend services to facilitate real-time feature flagging with approval workflows, minimizing deployment risk by 75% and supporting controlled, audit-friendly rollouts at scale</li>
                  <li>Mitigated unnecessary re-renders by transitioning from React Context API to Redux, elevating UI responsiveness by 70%</li>
                  <li>Implemented a centralized Notification Center powered by Kafka and Redis for async message delivery and low-latency rendering, preventing missed critical alerts and boosting user satisfaction scores by 80%</li>
                  <li>Achieved over 80% test coverage across frontend and backend codebases employing JUnit, and enforced mandatory test checks via Jenkins CI/CD pipelines, strengthening regression safety and cutting production defects by 50%</li>
                  <li>Mentored a team of 3 junior engineers in performance profiling leveraging Chrome DevTools, Grafana, and Prometheus, driving a 45% improvement in widget render times and API responsiveness</li>
                  <li>Directed a cross-functional team of 10 engineers, collaborated with product managers in Agile ceremonies, resulting in a 200% increase in team velocity through iterative delivery and continuous feedback loops</li>
                  <li>Delivered a gamified onboarding experience through a React-based Broken Mario tool integrated with backend REST APIs, enabling new hires to explore workflows, debug challenges, and understand system architecture, accelerating ramp-up time by 60%</li>
                  <li>Documented legacy systems and new service workflows, establishing a sustainable knowledge base for ongoing and future teams</li>
                </ul>
              </div>
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            iconStyle={{ background: '#000', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <div className="experience-details">
              <div className="experience-logo">
                  <img src={MSLogo} style={{height: "50px"}} alt="MS Logo"/>
              </div>
              <div className="experience-desc">
                <div className="experience-title">
                  <h2 className="vertical-timeline-element-title">Morgan Stanley</h2>
                  <h4 className="vertical-timeline-element-subtitle">Software Engineer</h4>
                  <p className="vertical-timeline-element-subtitle-sub">Jul 2020 - Jun 2021</p>
                  <p className="vertical-timeline-element-subtitle-sub">Bangalore, KA, India</p>
                </div>
                <ul>
                  <li>Championed micro-service and micro-frontend adoption via Spring Boot and Webpack Module Federation, unlocking independent deployments, mitigating single points of failure, and fortifying system resilience</li>
                  <li>Utilized Tailwind CSS and Shadow DOM to deliver fast, modular, visually consistent UI components, reducing style conflicts</li>
                  <li>Introduced OpenID Connect (OIDC) authentication with JWT tokens in Spring Boot, replacing legacy cookie-based SSO and decreasing login latency by 30% through stateless session management</li>
                  <li>Rolled out a lightweight feature toggle mechanism in MongoDB and Java, enabling safe activation of production features</li>
                  <li>Authored Swagger-documented REST APIs for layout settings (tab/tile), enhancing backend support for customizable UI widgets</li>
                </ul>
              </div>
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            iconStyle={{ background: '#000', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <div className="experience-details">
              <div className="experience-logo">
                  <img src={JuspayLogo} style={{height: "50px"}} alt="Juspay Logo"/>
              </div>
              <div className="experience-desc">
                <div className="experience-title">
                  <h2 className="vertical-timeline-element-title">Juspay Technologies</h2>
                  <h4 className="vertical-timeline-element-subtitle">Software Engineer Intern</h4>
                  <p className="vertical-timeline-element-subtitle-sub">Jan 2020 - Jun 2020</p>
                  <p className="vertical-timeline-element-subtitle-sub">Bangalore, KA, India</p>
                </div>
                <ul>
                  <li>Developed a single sign-on solution for a web application using Haskell and JavaScript, simplifying login process and enhancing user experience by 20%</li>
                  <li>Optimized web app performance by integrating MongoDB and a Node.js server for user information storage, reducing total time for REST API calls by 80%</li>
                </ul>
              </div>
            </div>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Experience;