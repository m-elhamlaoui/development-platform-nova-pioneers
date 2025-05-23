import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SortableLesson = ({ lesson, updateLesson, removeLesson, onEditContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    updateLesson({ ...lesson, title });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      updateLesson({ ...lesson, title });
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-card overflow-hidden"
    >
      <div className="p-3 bg-marine-blue-50 border border-marine-blue-100 rounded-lg">
        <div className="flex items-center">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="w-8 h-8 flex items-center justify-center text-marine-blue-600 cursor-grab active:cursor-grabbing mr-2"
          >
            ⋮⋮
          </div>

          {/* Lesson title */}
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 border border-marine-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-marine-blue-600"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-left w-full flex items-center"
              >
                <span className="font-medium text-marine-blue-800 flex-1">
                  {lesson.title}
                </span>
                <span className="text-marine-blue-600 transform transition-transform duration-200 ml-2">
                  {isOpen ? '▼' : '▶'}
                </span>
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-1 ml-2">
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-marine-blue-600 rounded-md hover:bg-marine-blue-50 transition-colors"
              title="Edit title"
            >
              ✏️
            </button>
            <button
              onClick={onEditContent}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-space-purple-600 rounded-md hover:bg-space-purple-50 transition-colors"
              title="Edit content"
            >
              📝
            </button>
            <button
              onClick={() => removeLesson(lesson.id)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-cosmic-red-600 rounded-md hover:bg-cosmic-red-50 transition-colors"
              title="Remove lesson"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pl-10 pr-2 text-sm text-gray-600">
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Description: </span>
                  {lesson.content || 'No description added yet.'}
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Resources: </span>
                  {lesson.resource_links && lesson.resource_links.length > 0 ? (
                    <ul className="list-disc pl-5 mt-1">
                      {lesson.resource_links.map((link, i) => (
                        <li key={i}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No resources added yet.'
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Content Sections: </span>
                  {lesson.lesson_contents && lesson.lesson_contents.length > 0 ? (
                    <span className="bg-space-purple-100 text-space-purple-800 px-2 py-0.5 rounded-full text-xs">
                      {lesson.lesson_contents.length} sections
                    </span>
                  ) : (
                    <span className="text-gray-500">No content sections added yet.</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SortableLesson;