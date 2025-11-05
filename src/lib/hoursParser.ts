/**
 * Utility to parse hoursText and determine if a location is currently open
 */

export interface ParsedHours {
  isOpen: boolean;
  opensAt?: string;
  closesAt?: string;
  daySpecific?: boolean;
}

/**
 * Determines if a location is currently open based on hoursText
 * Supports various formats:
 * - "9am-5pm" or "9:00 AM - 5:00 PM"
 * - "Mon-Fri 9-5"
 * - "24/7"
 * - Day-specific: "Monday: 9am-5pm, Tuesday: Closed"
 */
export function isLocationOpen(hoursText?: string): ParsedHours {
  if (!hoursText) {
    return { isOpen: false };
  }

  const text = hoursText.toLowerCase().trim();
  
  // Handle 24/7
  if (text.includes('24/7') || text.includes('24 hours') || text.includes('always open')) {
    return { isOpen: true };
  }

  // Handle "Closed" or "Temporarily Closed"
  if (text === 'closed' || text.includes('temporarily closed')) {
    return { isOpen: false };
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Day names mapping
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayName = dayNames[currentDay];

  // Check if hours text contains day-specific information
  const hasDayInfo = dayNames.some(day => text.includes(day)) || 
                     text.includes('mon-') || text.includes('tue-') || 
                     text.includes('wed-') || text.includes('thu-') || 
                     text.includes('fri-') || text.includes('sat-') || 
                     text.includes('sun-');

  if (hasDayInfo) {
    // Try to find current day's hours
    const dayPattern = new RegExp(`${currentDayName}[:\\s]*([0-9]{1,2}(?::[0-9]{2})?\\s*(?:am|pm)?\\s*-\\s*[0-9]{1,2}(?::[0-9]{2})?\\s*(?:am|pm)?)`, 'i');
    const dayMatch = text.match(dayPattern);
    
    if (dayMatch) {
      const hours = parseTimeRange(dayMatch[1]);
      if (hours) {
        const isCurrentlyOpen = currentTimeInMinutes >= hours.startMinutes && currentTimeInMinutes < hours.endMinutes;
        return {
          isOpen: isCurrentlyOpen,
          opensAt: hours.opensAt,
          closesAt: hours.closesAt,
          daySpecific: true
        };
      }
    }

    // Check for day ranges (e.g., "Mon-Fri 9-5")
    const rangePattern = /(mon|tue|wed|thu|fri|sat|sun)(?:day)?[-\s]+(mon|tue|wed|thu|fri|sat|sun)(?:day)?[:\s]*([0-9]{1,2}(?::[0-9]{2})?\\s*(?:am|pm)?\\s*-\\s*[0-9]{1,2}(?::[0-9]{2})?\\s*(?:am|pm)?)/i;
    const rangeMatch = text.match(rangePattern);
    
    if (rangeMatch) {
      const startDay = getDayNumber(rangeMatch[1]);
      const endDay = getDayNumber(rangeMatch[2]);
      
      // Check if current day is within range
      let isInRange = false;
      if (startDay <= endDay) {
        isInRange = currentDay >= startDay && currentDay <= endDay;
      } else {
        // Wraps around week (e.g., Fri-Mon)
        isInRange = currentDay >= startDay || currentDay <= endDay;
      }
      
      if (isInRange) {
        const hours = parseTimeRange(rangeMatch[3]);
        if (hours) {
          const isCurrentlyOpen = currentTimeInMinutes >= hours.startMinutes && currentTimeInMinutes < hours.endMinutes;
          return {
            isOpen: isCurrentlyOpen,
            opensAt: hours.opensAt,
            closesAt: hours.closesAt,
            daySpecific: true
          };
        }
      } else {
        return { isOpen: false, daySpecific: true };
      }
    }

    // If we have day info but didn't match, assume closed
    return { isOpen: false, daySpecific: true };
  }

  // No day-specific info, just try to parse time range
  const hours = parseTimeRange(text);
  if (hours) {
    const isCurrentlyOpen = currentTimeInMinutes >= hours.startMinutes && currentTimeInMinutes < hours.endMinutes;
    return {
      isOpen: isCurrentlyOpen,
      opensAt: hours.opensAt,
      closesAt: hours.closesAt,
      daySpecific: false
    };
  }

  // Couldn't parse, return unknown
  return { isOpen: false };
}

/**
 * Parse a time range string like "9am-5pm" or "9:00 AM - 5:00 PM"
 */
function parseTimeRange(timeStr: string): { startMinutes: number; endMinutes: number; opensAt: string; closesAt: string } | null {
  // Match various time formats
  const timePattern = /([0-9]{1,2})(?::([0-9]{2}))?\s*(am|pm)?\s*[-–]\s*([0-9]{1,2})(?::([0-9]{2}))?\s*(am|pm)?/i;
  const match = timeStr.match(timePattern);
  
  if (!match) return null;

  let startHour = parseInt(match[1]);
  const startMinute = parseInt(match[2] || '0');
  const startPeriod = match[3]?.toLowerCase();
  
  let endHour = parseInt(match[4]);
  const endMinute = parseInt(match[5] || '0');
  const endPeriod = match[6]?.toLowerCase();

  // Convert to 24-hour format
  if (startPeriod === 'pm' && startHour !== 12) {
    startHour += 12;
  } else if (startPeriod === 'am' && startHour === 12) {
    startHour = 0;
  }

  if (endPeriod === 'pm' && endHour !== 12) {
    endHour += 12;
  } else if (endPeriod === 'am' && endHour === 12) {
    endHour = 0;
  }

  // If no period specified, try to infer
  if (!startPeriod && !endPeriod) {
    // If start is 1-7, assume PM unless end is clearly AM
    if (startHour >= 1 && startHour <= 7 && endHour > startHour && endHour <= 12) {
      startHour += 12;
      endHour += 12;
    }
  }

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return {
    startMinutes,
    endMinutes,
    opensAt: formatTime(startHour, startMinute),
    closesAt: formatTime(endHour, endMinute)
  };
}

/**
 * Get day number from abbreviated day name
 */
function getDayNumber(dayAbbr: string): number {
  const day = dayAbbr.toLowerCase().substring(0, 3);
  const days: { [key: string]: number } = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
  };
  return days[day] ?? -1;
}

/**
 * Format time as readable string
 */
function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute > 0 ? `:${minute.toString().padStart(2, '0')}` : '';
  return `${displayHour}${displayMinute} ${period}`;
}
