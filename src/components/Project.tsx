import React from "react";
import '../assets/styles/Project.scss';
// import AwesomeSlider from 'react-awesome-slider';
// import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import StockSearchImage from '../assets/images/thumbnails/stocksearch.png';

function Project() {
    return(
    <div className="projects-container" id="projects">
        <h1>Personal Projects</h1>
        <div className="projects-grid">
            <div className="project">
                <a href="http://stocksearch-webtech4.appspot.com/" target="_blank" rel="noreferrer"><img src={StockSearchImage} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="http://stocksearch-webtech4.appspot.com/" target="_blank" rel="noreferrer"><h2>Stocksearch</h2></a>
                <p>Developed a stock search application, that allows you to search a stock, add it to watchlist and trade stocks using ANgular, Typescript, Highcharts and Finhub API's.</p>
            </div>
            {/* Work on this carousal later */}
            {/* <div className="project">
                <AwesomeSlider animation="cubeAnimation">
                    <div data-src={StockSearchImage1} />
                    <div data-src={StockSearchImage2} />
                </AwesomeSlider>
            </div> */}
        </div>
    </div>
    );
}

export default Project;