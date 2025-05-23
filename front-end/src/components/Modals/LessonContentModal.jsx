import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import ImageUpload from '../FileUpload/ImageUpload';

const LessonContentModal = ({ lesson, onSave, onClose }) => {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
    defaultValues: {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content || '',
      resource_links: lesson.resource_links || [],
      sequence_order: lesson.sequence_order,
      lesson_contents: lesson.lesson_contents || []
    }
  });

  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "lesson_contents"
  });

  const [newResourceLink, setNewResourceLink] = useState('');

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const addResourceLink = () => {
    if (newResourceLink.trim() && isValidUrl(newResourceLink)) {
      const updatedLesson = {
        ...lesson,
        resource_links: [...(lesson.resource_links || []), newResourceLink.trim()]
      };
      onSave(updatedLesson);
      setNewResourceLink('');
    }
  };

  const removeResourceLink = (index) => {
    const updatedLinks = [...lesson.resource_links];
    updatedLinks.splice(index, 1);
    const updatedLesson = {
      ...lesson,
      resource_links: updatedLinks
    };
    onSave(updatedLesson);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const addContentSection = () => {
    append({
      id: `content-${Date.now()}`,
      subheading: 'New Section',
      text: '',
      image_path: '',
      fun_fact: '',
      sequence_order: fields.length + 1
    });
  };

  const moveContentSectionUp = (index) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const moveContentSectionDown = (index) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  };

  const handleImageChange = (index, imageData) => {
    const field = fields[index];
    update(index, { ...field, image_path: imageData });
  };

  const onSubmit = (data) => {
    const updatedContents = data.lesson_contents.map((content, index) => ({
      ...content,
      sequence_order: index + 1
    }));

    onSave({
      ...data,
      lesson_contents: updatedContents
    });
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
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto py-8"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl max-w-3xl w-full mx-4 my-auto"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-marine-blue-700">Edit Lesson: {lesson.title}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-marine-blue-600">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-error-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("content")}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Resource Links */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-marine-blue-600">Resource Links</h3>
              <div className="mb-3">
                <div className="flex">
                  <input
                    type="text"
                    value={newResourceLink}
                    onChange={(e) => setNewResourceLink(e.target.value)}
                    placeholder="Enter resource URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                  />
                  <button
                    type="button"
                    onClick={addResourceLink}
                    className="bg-marine-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-marine-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {newResourceLink && !isValidUrl(newResourceLink) && (
                  <p className="text-error-600 text-sm mt-1">Please enter a valid URL</p>
                )}
              </div>

              {lesson.resource_links && lesson.resource_links.length > 0 ? (
                <ul className="space-y-2">
                  {lesson.resource_links.map((link, index) => (
                    <li key={index} className="flex items-center bg-gray-50 p-2 rounded">
                      <span className="flex-1 truncate text-blue-600">{link}</span>
                      <button
                        type="button"
                        onClick={() => removeResourceLink(index)}
                        className="ml-2 text-error-600 hover:text-error-700"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No resource links added yet.</p>
              )}
            </div>

            {/* Content Sections */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-marine-blue-600">Content Sections</h3>
                <button
                  type="button"
                  onClick={addContentSection}
                  className="bg-space-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-space-purple-700 transition-colors"
                >
                  + Add Section
                </button>
              </div>

              {fields.length > 0 ? (
                <div className="space-y-6">
                  {fields.map((content, index) => (
                    <div key={content.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-space-purple-700">Section {index + 1}</h4>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => moveContentSectionUp(index)}
                            disabled={index === 0}
                            className={`${index === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-space-purple-600'}`}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveContentSectionDown(index)}
                            disabled={index === fields.length - 1}
                            className={`${index === fields.length - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-space-purple-600'}`}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-cosmic-red-600 hover:text-cosmic-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            {...register(`lesson_contents.${index}.subheading`, { required: "Subheading is required" })}
                          />
                          {errors.lesson_contents?.[index]?.subheading && (
                            <p className="text-error-600 text-sm mt-1">{errors.lesson_contents[index].subheading.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Content Text</label>
                          <textarea
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            {...register(`lesson_contents.${index}.text`, { required: "Content text is required" })}
                          ></textarea>
                          {errors.lesson_contents?.[index]?.text && (
                            <p className="text-error-600 text-sm mt-1">{errors.lesson_contents[index].text.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Section Image</label>
                          <ImageUpload
                            value={watch(`lesson_contents.${index}.image_path`)}
                            onChange={(imageData) => handleImageChange(index, imageData)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fun Fact</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            {...register(`lesson_contents.${index}.fun_fact`)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-3">No content sections added yet.</p>
                  <button
                    type="button"
                    onClick={addContentSection}
                    className="bg-space-purple-600 text-white px-4 py-2 rounded-md hover:bg-space-purple-700 transition-colors"
                  >
                    Add First Section
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
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

export default LessonContentModal;