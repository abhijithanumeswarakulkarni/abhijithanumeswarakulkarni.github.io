import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'
import MSLogo from '../assets/images/morgan.png';
import JuspayLogo from '../assets/images/juspay.jpeg';

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
                  <li>Visualized data with Highcharts, boosting revenue by 70% and optimizing user screen analysis efficiency</li>
                  <li>Drove user growth by introducing React Tour, Redux, Recent Searches, and Theme Switch, resulting in an 80% more effective onboarding</li>
                  <li>Receded development effort by 90% leveraging React and Stencil Reusable Web Components</li>
                  <li>Achieved greater than 80% JUnit coverage across multiple web applications, minimizing faulty code by 50% and upgraded authorization protocols, cutting security vulnerabilities by 70% at critical endpoints</li>
                  <li>Led part of a team and collaborated with stakeholders to elevate overall team efficiency by 200%</li>
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
                  <li>Elevated user experience by 90% through adopting micro frontend architecture with Module Federation</li>
                  <li>Evaluated Bootstrap, Styled Classes, and Tailwind opting for Tailwind to accelerate development time by 50%</li>
                  <li>Implemented tile layout with React Grid Layout and crafted feature including Save View and User Preferences with MongoDB, increasing user efficiency and cutting effort by 50%</li>
                  <li>Constructed micro service architecture using Java and Spring Boot enabling independent scaling of services and improved fault isolation, resulting in a 30% increase in system reliability</li>
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