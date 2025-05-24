import { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableLesson } from './SortableLesson';
import LessonContentModal from '../Modals/LessonContentModal';
import ImageUpload from '../FileUpload/ImageUpload'; // Updated import path

const DraggableLessonList = ({ lessons, updateLesson, removeLesson, onReorder }) => {
  const [activeLesson, setActiveLesson] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex((lesson) => lesson.id === active.id);
      const newIndex = lessons.findIndex((lesson) => lesson.id === over.id);
      
      const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);
      onReorder(reorderedLessons);
    }
  };

  const editLessonContent = (lesson) => {
    setActiveLesson(lesson);
  };

  const handleUpdateLessonContent = (updatedLesson) => {
    updateLesson(updatedLesson);
    setActiveLesson(null);
  };

  return (
    <div>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={lessons.map(lesson => lesson.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <SortableLesson
                key={lesson.id}
                lesson={lesson}
                updateLesson={updateLesson}
                removeLesson={removeLesson}
                onEditContent={() => editLessonContent(lesson)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {activeLesson && (
        <LessonContentModal
          lesson={activeLesson}
          onSave={handleUpdateLessonContent}
          onClose={() => setActiveLesson(null)}
        />
      )}
    </div>
  );
};

const LessonContentEditor = ({ content, onUpdate, onRemove }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(content.image_path || '');

  const handleImageChange = (file) => {
    setImageFile(file);
    onUpdate({
      ...content,
      image_file: file // Store the file object
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

export default DraggableLessonList;