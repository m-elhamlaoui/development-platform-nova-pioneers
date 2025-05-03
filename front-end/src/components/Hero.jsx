import Nav from "./ui/Nav"
import rocket from '../assets/homeimage.png'
import { Link } from "react-router-dom"
import vector from '../assets/vector.png'
import { Expand, X } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import np_logo from "../assets/np-logo.png"
export default function Hero(){
    const [isExpanded, setIsExpanded] = useState(false);
    const [apodData, setApodData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const text = "Discover";
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const fetchAPOD = async () => {
            try {
                // Get API key from environment variable
                const apiKey = import.meta.env.VITE_NASA_API_KEY;
                const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch APOD data');
                }
                
                const data = await response.json();
                setApodData(data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching APOD:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchAPOD();
    }, []);

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

    // Fallback image in case of error or during loading
    const fallbackImage = "https://images.unsplash.com/photo-1587473555771-96aef0d968cc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
                <div className="logo" style={{fontFamily: "'Fascinate Inline', system-ui", color: "#0B3D91", fontWeight : "bold", fontSize: "24px"}}>
                <img src={np_logo} alt="" style={{width: "50px", height: "50px", borderRadius: "50%"}} />
                 </div>
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
                <div 
                    className="pic-of-day"
                    onClick={() => setIsExpanded(true)} 
                    style={{
                        cursor: "pointer",
                        position: "relative",
                        width: "100%",
                        maxWidth: "500px",
                        height: "500px",
                        overflow: "hidden",
                        borderRadius: "50%",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        border: "4px solid #0B3D91"
                    }}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                        </div>
                    ) : error ? (
                        <div style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${fallbackImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}></div>
                    ) : (
                        <>
                            <div style={{
                                width: "100%",
                                height: "100%",
                                backgroundImage: `url(${apodData?.url || fallbackImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}></div>
                            {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                                {apodData?.title || "NASA APOD"}
                            </div> */}
                        </>
                    )}
                    <button onClick={(e) => {e.stopPropagation(); setIsExpanded(true);}} style={{zIndex: "10", position: "absolute", }}><Expand /></button>
                </div>
            </div>
            {isExpanded && apodData && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50" style={{padding: "30px 0 0 0 "}}>
                    <div className="relative max-w-4xl overflow-y-scroll
                                    [&::-webkit-scrollbar]:w-1
                                    [&::-webkit-scrollbar-track]:bg-gray-100
                                    [&::-webkit-scrollbar-thumb]:bg-blue-300
                                    dark:[&::-webkit-scrollbar-track]:bg-gray-700
                                    dark:[&::-webkit-scrollbar-thumb]:bg-blue-500">
                        <img className="max-w-full max-h-[100vh] rounded-lg" src={apodData.url} alt={apodData.title} />
                        <div className="absolute bottom-[-100px]left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg" >
                            <h2 className="text-xl font-bold">{apodData.title}</h2>
                            <p className="text-sm mt-2">{apodData.explanation}</p>
                            <p className="text-xs mt-2 text-gray-300">© {apodData.copyright || 'NASA'} - {apodData.date}</p>
                        </div>
                        <button onClick={() => setIsExpanded(false)} className="absolute top-2 right-2 bg-white rounded-full p-2" style={{cursor: "pointer"}}>
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}