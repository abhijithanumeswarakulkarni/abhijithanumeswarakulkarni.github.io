import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';
import HTMLLogo from '../assets/images/html.png';
import CSSLogo from '../assets/images/css.png';
import JSLogo from '../assets/images/javascript.png';
import TSLogo from '../assets/images/typescript.png';
import PythonLogo from '../assets/images/python.png';
import JavaLogo from '../assets/images/java.png';
import CPPLogo from '../assets/images/cpp.png';
import ReactLogo from '../assets/images/react.png';
import AngularLogo from '../assets/images/angular.png';
import WebpackLogo from '../assets/images/webpack.png';
import AGGridLogo from '../assets/images/ag-grid.jpeg';
import HighchartsLogo from '../assets/images/highcharts.png';
import StencilLogo from '../assets/images/stencil.png';
import ReduxLogo from '../assets/images/redux.png';
import OpenCVLogo from '../assets/images/opencv.png';
import TensorflowLogo from '../assets/images/tensorflow.png';
import GitLogo from '../assets/images/git.png';
import DockerLogo from '../assets/images/docker.png';
import JenkinsLogo from '../assets/images/jenkins.png';
import JIRALogo from '../assets/images/jira.png';
import BitBucketLogo from '../assets/images/bitbucket.png';
import MicrosoftLogo from '../assets/images/microsoft.png';

const labelsFirst = [
    {label: "HTML5", icon: HTMLLogo},
    {label: "CSS3", icon: CSSLogo},
    {label: "Javascript", icon: JSLogo},
    {label: "Typescript", icon: TSLogo},
    {label: "Python", icon: PythonLogo},
    {label: "Java", icon: JavaLogo},
    {label: "C++", icon: CPPLogo}
];

const labelsSecond = [
    {label: "React", icon: ReactLogo},
    {label: "Angular", icon: AngularLogo},
    {label: "Webpack", icon: WebpackLogo},
    {label: "agGrid", icon: AGGridLogo},
    {label: "Highcharts", icon: HighchartsLogo},
    {label: "Stencil JS", icon: StencilLogo},
    {label: "Redux", icon: ReduxLogo},
    {label: "OpenCV", icon: OpenCVLogo},
    {label: "Tensorflow", icon: TensorflowLogo}
];

const labelsThird = [
    {label: "Git", icon: GitLogo},
    {label: "Docker", icon: DockerLogo},
    {label: "Jenkins", icon: JenkinsLogo},
    {label: "JIRA", icon: JIRALogo},
    {label: "Bitbucket", icon: BitBucketLogo}
];

const labnelsFourth = [
    {label: "MTA Security Fundumentals", icon: MicrosoftLogo}
]
function Skills() {
    return (
    <div className="container" id="skills">
        <div className="skills-container">
            <h1>Skills</h1>
            <div className="skills-grid">
                <div className="skill">
                    <h3 style={{whiteSpace: 'nowrap'}}>Programming Languages</h3>
                    <div className="flex-chips">
                        {labelsFirst.map((labelData, index) => (
                            <>
                                <Chip key={index} className='chip' label={labelData.label} icon={<img src={labelData.icon} style={{width: "20px"}} />}/>
                            </>
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <h3 style={{whiteSpace: 'nowrap'}}>Frameworks and Libraries</h3>
                    <div className="flex-chips">
                        {labelsSecond.map((labelData, index) => (
                            <>
                                {labelData.icon && <Chip key={index} className='chip' label={labelData.label} icon={<img src={labelData.icon} style={{width: "20px"}} />} />}
                            </>
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <h3 style={{whiteSpace: 'nowrap'}}>Devops and CI / CD Tools</h3>
                    <div className="flex-chips">
                        {labelsThird.map((labelData, index) => (
                            <>
                            <Chip key={index} className='chip' label={labelData.label}  icon={<img src={labelData.icon} style={{width: "20px"}} />}/>
                        </>
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <h3 style={{whiteSpace: 'nowrap'}}>Certifications and Licenses</h3>
                    <div className="flex-chips">
                        {labnelsFourth.map((labelData, index) => (
                            <>
                            <Chip key={index} className='chip' label={labelData.label}  icon={<img src={labelData.icon} style={{width: "12px"}} />}/>
                        </>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </div>
    );
}

export default Skills;