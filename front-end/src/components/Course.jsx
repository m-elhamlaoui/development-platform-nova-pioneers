export default function CourseCard({ course, index, isParentDashboard, onClick, children }) {
  const [isFav, setIsFav] = useState(false);
  const location = useLocation();
  
  // Check if we're in the kid dashboard
  const isKidDashboard = location.pathname.includes('/kid/'); 
  
  // Use explicit prop if provided, otherwise use the path detection
  const showChildLinks = isParentDashboard !== undefined ? isParentDashboard : !isKidDashboard;
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      style={{maxWidth: "500px"}}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 text-black flex-grow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Existing card content... */}
      
      {/* Add children prop at the end to render enrollment buttons */}
      {children}
    </motion.div>
  );
}