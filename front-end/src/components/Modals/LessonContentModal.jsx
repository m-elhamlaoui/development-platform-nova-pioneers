import { useState, useEffect } from 'react';
import ImageUpload from '../FileUpload/ImageUpload';

const LessonContentModal = ({ lesson, onSave, onClose }) => {
  const [editedLesson, setEditedLesson] = useState(lesson);

  useEffect(() => {
    setEditedLesson(lesson);
  }, [lesson]);

  const handleLessonChange = (field, value) => {
    setEditedLesson(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addContent = () => {
    const newContent = {
      id: `content-${Date.now()}`,
      subheading: '',
      text: '',
      fun_fact: '',
      sequence_order: (editedLesson.lesson_contents?.length || 0) + 1,
      image_file: null
    };

    setEditedLesson(prev => ({
      ...prev,
      lesson_contents: [...(prev.lesson_contents || []), newContent]
    }));
  };

  const updateContent = (contentId, updatedContent) => {
    setEditedLesson(prev => ({
      ...prev,
      lesson_contents: prev.lesson_contents.map(content =>
        content.id === contentId ? updatedContent : content
      )
    }));
  };

  const removeContent = (contentId) => {
    setEditedLesson(prev => ({
      ...prev,
      lesson_contents: prev.lesson_contents.filter(content => content.id !== contentId)
    }));
  };

  const addResourceLink = () => {
    const newLink = prompt('Enter resource link URL:');
    if (newLink && newLink.trim()) {
      setEditedLesson(prev => ({
        ...prev,
        resource_links: [...(prev.resource_links || []), newLink.trim()]
      }));
    }
  };

  const removeResourceLink = (index) => {
    setEditedLesson(prev => ({
      ...prev,
      resource_links: prev.resource_links.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(editedLesson);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Edit Lesson: {lesson.title}</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
          <input
            type="text"
            value={editedLesson.title || ''}
            onChange={(e) => handleLessonChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Content</label>
          <textarea
            value={editedLesson.content || ''}
            onChange={(e) => handleLessonChange('content', e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Resource Links</label>
            <button
              type="button"
              onClick={addResourceLink}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Add Link
            </button>
          </div>
          
          {editedLesson.resource_links && editedLesson.resource_links.length > 0 ? (
            <div className="space-y-2">
              {editedLesson.resource_links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => {
                      const updatedLinks = [...editedLesson.resource_links];
                      updatedLinks[index] = e.target.value;
                      handleLessonChange('resource_links', updatedLinks);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com"
                  />
                  <button
                    type="button"
                    onClick={() => removeResourceLink(index)}
                    className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No resource links added yet.</p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Lesson Contents</h3>
            <button
              onClick={addContent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Content Section
            </button>
          </div>

          {editedLesson.lesson_contents?.map((content) => (
            <LessonContentEditor
              key={content.id}
              content={content}
              onUpdate={(updatedContent) => updateContent(content.id, updatedContent)}
              onRemove={removeContent}
            />
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// LessonContentEditor component
const LessonContentEditor = ({ content, onUpdate, onRemove }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(content.image_path || '');

  const handleImageChange = (file) => {
    setImageFile(file);
    onUpdate({
      ...content,
      image_file: file
    });
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFieldChange = (field, value) => {
    onUpdate({
      ...content,
      [field]: value
    });
  };

  return (
    <div className="border p-4 rounded mb-2">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
        <input
          type="text"
          value={content.subheading || ''}
          onChange={(e) => handleFieldChange('subheading', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter subheading"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
        <textarea
          value={content.text || ''}
          onChange={(e) => handleFieldChange('text', e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter the main content text"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Fun Fact (Optional)</label>
        <input
          type="text"
          value={content.fun_fact || ''}
          onChange={(e) => handleFieldChange('fun_fact', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Add an interesting fun fact"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Content Image</label>
        <ImageUpload
          value={imagePreview}
          onChange={handleImageChange}
          acceptFiles={true}
          className="mb-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Sequence Order</label>
        <input
          type="number"
          value={content.sequence_order || 1}
          onChange={(e) => handleFieldChange('sequence_order', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="1"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onRemove(content.id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Remove Content
        </button>
      </div>
    </div>
  );
};

export default LessonContentModal;