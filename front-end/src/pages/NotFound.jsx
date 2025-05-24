import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-9xl font-bold text-marine-blue-200 mb-6">404</div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-marine-blue-600 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-lg">
          The page you're looking for seems to have drifted into deep space. Let's navigate back to a known location.
        </p>
        
        <Link to="/">
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Dashboard
          </motion.button>
        </Link>
      </motion.div>
      
      <motion.div
        className="mt-12 flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="w-2 h-2 rounded-full bg-marine-blue-300"
            style={{
              animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
            }}
          />
        ))}
      </motion.div>
      
      <style jsx="true">{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default NotFound;