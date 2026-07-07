export interface ParsedTask {
  task: string;
  status: string;
  priority: string;
  deadline: string;
}

export async function parseTaskFromText(text: string, apiKey: string): Promise<ParsedTask | null> {
  // Local "Smart Recognition" algorithm using Regex and Date Math
  let priority = 'Medium';
  let deadline = '';
  let cleanTask = text;

  const lowerText = text.toLowerCase();

  // 1. Detect Priority
  if (lowerText.match(/\b(urgent|asap|high priority|important|critical|immediately)\b/)) {
    priority = 'High';
  } else if (lowerText.match(/\b(low priority|whenever|no rush|someday)\b/)) {
    priority = 'Low';
  }

  // 2. Detect Deadline
  const today = new Date();
  
  if (lowerText.includes('today')) {
    deadline = today.toISOString().split('T')[0];
  } else if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    deadline = tomorrow.toISOString().split('T')[0];
  } else if (lowerText.includes('next week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    deadline = nextWeek.toISOString().split('T')[0];
  } else {
    // Check for days of the week (e.g. "friday", "on friday", "by friday")
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      if (lowerText.includes(days[i])) {
        const currentDay = today.getDay();
        let daysUntil = i - currentDay;
        if (daysUntil <= 0) daysUntil += 7; // Next occurrence of that day
        
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + daysUntil);
        deadline = targetDate.toISOString().split('T')[0];
        break;
      }
    }
  }

  // 3. Clean up the task string (basic removal of common phrases)
  cleanTask = cleanTask
    .replace(/\b(urgent|asap|high priority|important|critical|immediately|low priority|whenever|no rush|someday)\b/gi, '')
    .replace(/\b(today|tomorrow|next week)\b/gi, '')
    .replace(/\b(on|by|before|this|next)?\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi, '')
    .replace(/\s+/g, ' ') // remove extra spaces
    .trim();
    
  // Capitalize first letter
  if (cleanTask.length > 0) {
    cleanTask = cleanTask.charAt(0).toUpperCase() + cleanTask.slice(1);
  } else {
    cleanTask = text; // fallback
  }

  return {
    task: cleanTask,
    status: 'Not Started',
    priority,
    deadline,
  };
}
