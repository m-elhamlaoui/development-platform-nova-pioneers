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

export default DraggableLessonList;