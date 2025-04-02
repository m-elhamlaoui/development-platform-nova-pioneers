import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import "../css/landing-page.css"
import About from '../components/About';
import Contact from '../components/Contact';
export default function NovaLandingPage() {
  return (
        <div className='landing-page'> 
                <Hero></Hero>
                <About></About>
                <Contact></Contact>
                <div className="footer-landing flex justify-between items-center" style={{background: "#0B3D91", padding: "10px 20px"}} >
                <div className="logo" style={{fontFamily: "'Fascinate Inline', system-ui", color: "white", fontWeight : "bold", fontSize: "24px"}}>NOVA PIONEERS </div>
                <p style={{fontSize: "12px", fontWeight: "lighter", color: "white"}}>copyright@2025 - Nova pioneers</p>

                </div>
        </div>
  );
}