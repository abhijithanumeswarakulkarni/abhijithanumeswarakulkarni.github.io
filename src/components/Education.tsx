import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import USCLogo from '../assets/images/usc-logo.png';
import BMSLogo from '../assets/images/bms-logo.jpeg';
import RVKLogo from '../assets/images/rvk-logo.jpeg';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'

function Education() {
  return (
    <div id="education">
      <div className="items-container">
        <h1>Education</h1>
        <VerticalTimeline
          layout="1-column-left"
        >
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            iconStyle={{ background: '#000', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBook} />}
          >
            <div className="education-details">
              <div className="education-logo">
                <img src={USCLogo} style={{height: "50px"}} alt="USC Logo"/>
              </div>
              <div className="education-desc">
                <h2 className="vertical-timeline-element-title">University of Southern California</h2>
                <h4 className="vertical-timeline-element-subtitle">Master of Science in Computer Science</h4>
                <p className="vertical-timeline-element-subtitle-sub">Aug 2024 - Present</p>
                <p className="vertical-timeline-element-subtitle-sub">Los Angeles, CA, USA</p>
                <p>
                  Currently, pursuing a Master's degree in Computer Science at the University of Southern California.
                  Enhancing my software development skills through curated learning experiences.
                </p>
              </div>
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            iconStyle={{ background: '#000', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBook} />}
          >
            <div className="education-details">
              <div className="education-logo">
                <img src={BMSLogo} style={{height: "50px"}} alt="BMS Logo"/>
              </div>
              <div className="education-desc">
                <h3 className="vertical-timeline-element-title">BMS College of Engineering</h3>
                <h4 className="vertical-timeline-element-subtitle">Bachelor of Engineering (B.E.) in Computer Science and Engineering</h4>
                <p className="vertical-timeline-element-subtitle-sub">Aug 2016 - Sep 2020</p>
                <p className="vertical-timeline-element-subtitle-sub">Bangalore, KA, India</p>
                <p>
                  Accomplished Alumni: B.M.S College of Engineering, Bangalore, with a CGPA of 9.21 on a scale of 10.
                  Won second place in international poster presentation, and publisehd a journal on VANET's.
                </p>
              </div>
            </div>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            iconStyle={{ background: '#000', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBook} />}
          >
            <div className="education-details">
              <div className="education-logo">
                <img src={RVKLogo} style={{height: "50px"}}  alt="RVK Logo"/>
              </div>
              <div className="education-desc">
                <h3 className="vertical-timeline-element-title">Rashtrotthana Vidya Kendra</h3>
                <h4 className="vertical-timeline-element-subtitle">High School</h4>
                <p className="vertical-timeline-element-subtitle-sub">Aug 2014 - May 2016</p>
                <p className="vertical-timeline-element-subtitle-sub">Bangalore, KA, India</p>
                <p>
                  High School Achievements: 93.5% Graduation & Top 0.6% in Karnataka Common Entrance Test with a rank of 615 out of 1,94,419 candidates.
                </p>
              </div>
            </div>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Education;