import { motion } from "framer-motion";
import { Heart, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course, index }) {
  const [isFav, setIsFav] = useState(false);

  


  const handleFavoriteToggle = () => setIsFav(!isFav);
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      style={{maxWidth: "500px"}}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 text-black flex-grow"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover hover:scale"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full backdrop-blur-md ${isFav ? 'bg-white/20' : 'bg-black/30'} transition-all`}
          >
            <Heart 
              className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-white/80'}`} 
            />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-16" />
      </div>
      
      <div className="p-5 space-y-3">
        <h2 className="text-xl font-bold text-balck">{course.title}</h2>
        <p className="text-sm text-gray-600">{course.description}</p>

        <div className="flex items-center gap-2 mt-2">
          <div className="p-1 bg-[#0b3d91] rounded-full">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium">{course.instructor}</span>
        </div>
        <div className="rating-kids flex justify-between">
            <div className="flex items-center gap-1 mt-2">
            {Array(5)
                .fill(0)
                .map((_, i) => (
                <span key={i} className="text-[20px] text-amber-400">
                    {i < course.rating ? "★" : "☆"}
                </span>
                ))}
            <span className="ml-1 text-xs text-slate-400">({course.reviews || 4} reviews)</span>
            </div>

            <div className="mt-3 space-y-2 flex gap-2 justify-start items-start">
                <Link className="w-[70px] inline-block bg-[#0b3d91] text-white p-1 rounded-2xl text-center">child1</Link>
                <Link className="w-[70px] inline-block border border-[#0b3d91] text-[#0b3d91] p-1 rounded-2xl text-center">child2</Link>
            </div>
        </div>
        
      </div>
    </motion.div>
  );
}