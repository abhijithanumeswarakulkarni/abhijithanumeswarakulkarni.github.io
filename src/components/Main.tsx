import React from "react";
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LeetcodeIcon from '@mui/icons-material/Code';
import Profile from '../assets/images/profile.png';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import '../assets/styles/Main.scss';

function Main() {

  return (
    <div className="container" id="home">
      <div className="about-section">
        <div className="image-wrapper">
          <img src={Profile} alt="Avatar" />
        </div>
        <div className="content">
          <h1>Abhijit Hanumeswara Kulkarni</h1>
          <p>Master's Student and Full Stack Engineer</p>

          <div className="mobile_social_icons">
            <a href="https://www.linkedin.com/in/abhijit-h-kulkarni/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="https://github.com/abhijithanumeswarakulkarni" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.instagram.com/spider_abhijit?igsh=YXJzOGhpeG50M3pu&utm_source=qr" target="_blank" rel="noreferrer"><InstagramIcon/></a>
            <a href="https://leetcode.com/u/kulkarab1999/" target="_blank" rel="noreferrer"><LeetcodeIcon/></a>
          </div>

          <div className="social_icons">
            <a href="https://www.linkedin.com/in/abhijit-h-kulkarni/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="https://github.com/abhijithanumeswarakulkarni" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.instagram.com/spider_abhijit?igsh=YXJzOGhpeG50M3pu&utm_source=qr" target="_blank" rel="noreferrer"><InstagramIcon/></a>
            <a href="https://leetcode.com/u/kulkarab1999/" target="_blank" rel="noreferrer"><LeetcodeIcon/></a>
          </div>

          <a href={require("../assets/files/resume.pdf")} download="Abhijit_Hanumeswara_Kulkarni_Resume"><AwesomeButton type="primary" style={{"marginTop":"10px"}}>Download Resume</AwesomeButton></a>
        </div>
      </div>
    </div>
  );
}

export default Main;