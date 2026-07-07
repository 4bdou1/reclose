import React, { useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Task } from '../../lib/googleSheets';
import { CheckCircle2, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onComplete, 
  onDelete, 
  getStatusColor, 
  getPriorityColor 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (e: any, info: PanInfo) => {
    // Swipe left past threshold triggers delete
    if (info.offset.x < -100) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onDelete(task);
    } else {
      // Snap back
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  return (
    <div className="relative w-full h-48" style={{ perspective: "1000px" }}>
      {/* Delete Background (Revealed on Swipe Left) */}
      <div className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-end pr-6 shadow-sm overflow-hidden z-0">
        <Trash2 className="text-white w-6 h-6" />
        <span className="text-white font-bold text-sm ml-2">Delete</span>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.5, right: 0 }} // Only allow pulling to the left
        onDragEnd={handleDragEnd}
        animate={isFlipped ? { rotateY: 180 } : controls}
        initial={{ rotateY: 0, x: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
        className="relative w-full h-full z-10 cursor-grab active:cursor-grabbing"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front side */}
        <div 
          className="premium-card p-5 bg-white absolute inset-0 w-full h-full flex flex-col pointer-events-auto"
          style={{ backfaceVisibility: "hidden" }}
          onClick={() => setIsFlipped(true)}
        >
          <div className="flex items-start justify-between mb-4">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            <span className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-tight mb-4 pointer-events-none">{task.task}</h3>
          
          <div className="space-y-2 mt-auto pointer-events-none">
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
               <div className="bg-[#050505] h-full rounded-full" style={{ width: `${task.progress || 0}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs mt-4">
              <span className="font-medium text-gray-500">User: <span className="text-black">{task.user}</span></span>
              <span className="font-medium text-gray-500">{task.deadline}</span>
            </div>
          </div>
        </div>

        {/* Back side */}
        <div 
          className="premium-card p-5 bg-gray-50 absolute inset-0 w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 pointer-events-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task);
              setIsFlipped(false);
            }}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"
          >
            <CheckCircle2 className="w-5 h-5" />
            Mark as Done
          </button>
          <button 
            className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
            }}
          >
            Cancel Flip
          </button>
        </div>
      </motion.div>
    </div>
  );
};
