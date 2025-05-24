import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useData } from '../../context/DataContext';

const SettingsModal = ({ onClose }) => {
  const { teacher, setTeacher } = useData();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: teacher.name,
      email: teacher.email,
      avatar: teacher.avatar
    }
  });

  useEffect(() => {
    // Close modal with escape key
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const onSubmit = (data) => {
    setTeacher({
      ...teacher,
      ...data
    });
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.1 } }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-6 max-w-md w-full"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-marine-blue-700">Settings</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-error-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email format"
                }
              })}
            />
            {errors.email && (
              <p className="text-error-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              {...register("avatar")}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;