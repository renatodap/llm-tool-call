/**
 * API client for LLM Error Classifier backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ToolParameter {
  type: string;
  description?: string;
  enum?: string[];
  properties?: Record<string, any>;
  required?: string[];
}

export interface Tool {
  name: string;
  description: string;
  parameters: ToolParameter;
}

export interface ClassificationRequest {
  query: string;
  enabled_tools: Tool[];
  tool_calling: {
    name: string;
    arguments: Record<string, any>;
  };
}

export interface ClassificationResponse {
  label: string;
  confidence: number;
  all_probabilities: Record<string, number>;
  processing_time_ms: number;
  category_color: string;
}

export interface Example {
  name: string;
  description: string;
  data: ClassificationRequest;
}

/**
 * Classify a tool call
 */
export async function classify(request: ClassificationRequest): Promise<ClassificationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Classification failed');
  }

  return response.json();
}

/**
 * Get example inputs
 */
export async function getExamples(): Promise<Example[]> {
  const response = await fetch(`${API_BASE_URL}/api/examples`);

  if (!response.ok) {
    throw new Error('Failed to fetch examples');
  }

  const data = await response.json();
  return data.examples;
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string; model_loaded: boolean; device: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}
