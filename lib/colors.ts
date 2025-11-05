/**
 * Color mapping for 8 error categories
 */
export const LABEL_COLORS: Record<string, string> = {
  "Correct": "#10B981",
  "No_Tool_Available": "#F59E0B",
  "Incorrect_Function_Name": "#EF4444",
  "Incorrect_Argument_Name": "#EC4899",
  "Incorrect_Argument_Value": "#8B5CF6",
  "Incorrect_Argument_Type": "#3B82F6",
  "Wrong_Tool": "#F97316",
  "Wrong_Syntax": "#DC2626"
};

/**
 * Get color for a label
 */
export function getLabelColor(label: string): string {
  return LABEL_COLORS[label] || "#6B7280";
}

/**
 * Get label description
 */
export function getLabelDescription(label: string): string {
  const descriptions: Record<string, string> = {
    "Correct": "Tool call is properly formed and valid",
    "No_Tool_Available": "No matching tool exists for this request",
    "Incorrect_Function_Name": "Function name doesn't match available tools",
    "Incorrect_Argument_Name": "Argument name is not in tool parameters",
    "Incorrect_Argument_Value": "Argument value doesn't match expected format",
    "Incorrect_Argument_Type": "Argument type doesn't match expected type",
    "Wrong_Tool": "Wrong tool selected for this task",
    "Wrong_Syntax": "Tool call syntax is malformed"
  };
  return descriptions[label] || "Unknown error type";
}
