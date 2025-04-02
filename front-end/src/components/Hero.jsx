import Nav from "./Nav"
import rocket from '../assets/homeimage.png'
import { Link } from "react-router-dom"
import vector from '../assets/vector.png'
import { Expand, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion";

export default function Hero(){
    const [isExpanded, setIsExpanded] = useState(false);
    const text = "Discover";
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index+1));
                index++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => setDisplayedText(""), 1000); // Reset after delay
            }
        }, 300);
        
        return () => clearInterval(typeInterval);
    }, [displayedText === ""]); // Restart animation infinitely

    useEffect(() => {
        const cursorInterval = setInterval(() => setShowCursor((prev) => !prev), 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return(
        <div id="home">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Barriecito&family=Fascinate+Inline&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
            </style>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                flexWrap: "wrap",
                padding: "10px 20px",

            }} className="header-nav">
                <div className="logo" style={{fontFamily: "'Fascinate Inline', system-ui", color: "#0B3D91", fontWeight : "bold", fontSize: "24px"}}>NOVA PIONEERS </div>
            <Nav></Nav>
                <div className="login-sign-up">
                    <Link to={{pathname: "/login"}} style={{display: "inline-block", fontWeight: "bold", color: "#0B3D91", padding: "7px 25px", margin: "0 10px", border: "2px solid #0B3D91", borderRadius: "20px 0 20px 0"}} className=" px-7 py-4">Login</Link>
                    <Link to={{pathname: "/sign-up"}} style={{display: "inline-block", fontWeight: "bold", color: "#0B3D91", padding: "7px 25px", margin: "0 10px", border: "2px solid #0B3D91", borderRadius: "0px 20px 0px 20px"}}>Sign Up</Link>
                </div>
            </div>
            <img className="absolute top-30 left-80" src={rocket} alt="" />
            <div className="main-hero">
                <div className="main-hero-text" style={{maxWidth: "500px", fontWeight:"bold",}}>
                    <span style={{color: "red", fontSize: "30px"}}>Let's</span> <br />
                    <motion.span
                        style={{ color: "#0B3D91", fontSize: "140px", fontFamily: 'Barriecito, system-ui', fontWeight: "bold" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {displayedText}{showCursor && "|"}
                    </motion.span>
                     <br />
                    <p>In our platform you can discover and learn about the space, and you can contribute to add more valuable content.</p>
                    <img style={{margin: '20px 0px 10px 20px'}} src={vector} alt="" />
                    <Link to={{pathname: "/login"}} style={{display: "inline-block", padding: "7px 15px", background: "#0B3D91", color: "white", borderRadius: "5px"}}>GET STARTED</Link>
                </div>
                <div className="pic-of-day" onClick={() => setIsExpanded(true)} style={{cursor: "pointer"}}>
                    <img src="https://images.unsplash.com/photo-1587473555771-96aef0d968cc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                    <button onClick={() => setIsExpanded(true)}><Expand /></button>
                </div>
            </div>
            {isExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" >
                    <div className="relative">
                        <img className="max-w-full max-h-[90vh] rounded-lg" src="https://images.unsplash.com/photo-1587473555771-96aef0d968cc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Expanded view" />
                        <button onClick={() => setIsExpanded(false)} className="absolute top-2 right-2 bg-white rounded-full p-2" style={{cursor: "pointer"}}>
                            <X  size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}