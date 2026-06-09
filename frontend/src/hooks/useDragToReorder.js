import { useState, useRef } from 'react';

/**
 * useDragToReorder — enables drag and drop reordering of any array
 *
 * How it works:
 * 1. User grabs the drag handle (mousedown)
 * 2. As they drag, we track which index they're hovering over
 * 3. On drop, we reorder the array and call onChange
 *
 * Returns:
 * - getDragProps(index)  → spread onto each draggable item
 * - dragOverIndex        → which index is being hovered (for visual feedback)
 */
export function useDragToReorder(items, onChange) {
  const dragIndex = useRef(null); // which item is being dragged
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function handleDragStart(index) {
    dragIndex.current = index;
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index) {
    if (dragIndex.current === null || dragIndex.current === index) {
      setDragOverIndex(null);
      return;
    }

    // Reorder the array
    // Remove the dragged item, insert it at the new position
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);

    onChange(reordered);
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  // Returns props to spread onto each draggable item wrapper
  function getDragProps(index) {
    return {
      draggable: true,
      onDragStart: (e) => {
        e.dataTransfer.effectAllowed = 'move'; // show move cursor
        handleDragStart(index);
      },
      onDragOver: (e) => handleDragOver(e, index),
      onDrop: (e) => {
        e.preventDefault();
        handleDrop(index)},
      onDragEnd: handleDragEnd,
    };
  }

  return { getDragProps, dragOverIndex };
}
