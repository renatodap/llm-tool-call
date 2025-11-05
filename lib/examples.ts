/**
 * Local example data (fallback if API not available)
 */

import { type ClassificationRequest } from './api';

export interface ExampleData {
  name: string;
  description: string;
  data: ClassificationRequest;
}

export const localExamples: ExampleData[] = [
  {
    name: "Correct Example",
    description: "A properly formed tool call",
    data: {
      query: "What's the weather in New York?",
      enabled_tools: [
        {
          name: "get_weather",
          description: "Get current weather for a location",
          parameters: {
            type: "object",
            properties: {
              location: { type: "string" },
              units: { type: "string", enum: ["celsius", "fahrenheit"] }
            },
            required: ["location"]
          }
        }
      ],
      tool_calling: {
        name: "get_weather",
        arguments: {
          location: "New York",
          units: "fahrenheit"
        }
      }
    }
  },
  {
    name: "Wrong Function Name",
    description: "Tool call uses incorrect function name",
    data: {
      query: "Calculate 25 * 4",
      enabled_tools: [
        {
          name: "calculator",
          description: "Perform calculations",
          parameters: {
            type: "object",
            properties: {
              expression: { type: "string" }
            }
          }
        }
      ],
      tool_calling: {
        name: "calculate",
        arguments: {
          expression: "25 * 4"
        }
      }
    }
  },
  {
    name: "Incorrect Argument Type",
    description: "Argument has wrong data type",
    data: {
      query: "Set a reminder for 3pm",
      enabled_tools: [
        {
          name: "set_reminder",
          description: "Create a reminder",
          parameters: {
            type: "object",
            properties: {
              time: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      ],
      tool_calling: {
        name: "set_reminder",
        arguments: {
          time: 1500,
          message: "Meeting"
        }
      }
    }
  }
];
