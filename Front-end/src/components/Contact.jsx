import planet from "../assets/planet-1.png";
import astronaut from "../assets/astronaut.png";
import { motion } from "framer-motion";
export default function Contact(){
    return (
        <div className="contact-us" id="contact" style={{marginTop: "150px"}}>
            <div className="about-title">
                <img src={planet} alt="" />
                <p>Get in touch</p>
            </div>
            <form action="#" className="contact-form" style={{margin: "20px 0 70px 0"}}>
            <div className="contact-us flex justify-center items-center mt-36 px-6">
            <div className="container bg-white shadow-lg rounded-2xl overflow-hidden flex max-w-5xl w-full" style={{padding: "0 0 0 15px", borderRadius: "10px"}}>

                {/* Right Side - Contact Form */}
                <div className="w-1/2 p-10 flex flex-col justify-center" style={{padding: "70px 20px", paddingRight: "10px"}}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Let's connect constellations</h2>
                    <p className="text-gray-600 mb-6">Let's align our constellations! Reach out and let the magic of collaboration illuminate our skies.</p>
                    <form action="#" className="contact-form space-y-4" style={{marginTop: "30px"}}>
                        <div className="flex space-x-4">
                            <input type="text" placeholder="Last Name" className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{marginRight: "5px"}} />
                            <input type="text" placeholder="First Name" className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <input type="email" placeholder="Email" className="w-full block p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{marginTop: "5px"}} />
                        <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{marginTop: "5px"}} />
                        <textarea placeholder="Message" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="4" style={{marginTop: "5px"}}></textarea>
                        <motion.button 
                        style={{marginTop: "5px"}}
                            whileHover={{ scale: 1.01 }} 
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center">
                            Send it to the moon 🚀
                        </motion.button>
                    </form>
                </div>
                {/* Left Side - Image & Quote */}
                <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-10 rounded-l-2xl inset-0 bg-[url(../assets/astronaut.png')]" style={{position: "relative"}}>
                    <img src={astronaut} style={{position: "absolute", top: 0, right: 0,  width: "100%"}} alt="Astronaut" className="w-64 mb-6" />
                    <blockquote className="text-center italic text-lg font-light max-w-xs" style={{zIndex: 2, position: "relative", top: "100px"}} >
                        "Two lunar months revealed Earth's fragile beauty against vast silence, transforming my view of our place in the universe."
                        <br />
                        <span className="font-bold mt-2 block">- Irinel Traista</span>
                    </blockquote>
                </div>
                
                
            </div>
        </div>
            </form>
        </div>
    )
}