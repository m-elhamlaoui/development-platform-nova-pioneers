import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import "../css/landing-page.css"
import About from '../components/About';
import Contact from '../components/Contact';
import np_logo from "../assets/np-logo.png"
export default function NovaLandingPage() {
  return (
        <div className='landing-page'> 
                <Hero></Hero>
                <About></About>
                <Contact></Contact>
                <div className="footer-landing flex justify-between items-center" style={{background: "#0B3D91", padding: "10px 20px"}} >
                <div className="logo" style={{fontFamily: "'Fascinate Inline', system-ui", color: "white", fontWeight : "bold", fontSize: "24px"}}>
                <img src={np_logo} alt="" style={{width: "50px", height: "50px", borderRadius: "20%"}} />
                  
                   </div>
                   <p style={{fontSize: "13px", fontWeight: "normal", color: "white"}}>&#169; 2025 - Nova Pioneers</p>
                </div>
        </div>
  );
}