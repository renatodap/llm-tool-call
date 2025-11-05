'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { classify, type ClassificationResponse } from '@/lib/api';
import { localExamples, type ExampleData } from '@/lib/examples';
import { getLabelColor, getLabelDescription } from '@/lib/colors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [examples] = useState<ExampleData[]>(localExamples);

  // Initialize with first example
  useEffect(() => {
    if (examples.length > 0) {
      setInput(JSON.stringify(examples[0].data, null, 2));
    }
  }, [examples]);

  const handleClassify = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = JSON.parse(input);
      const response = await classify(data);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to classify. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example: ExampleData) => {
    setInput(JSON.stringify(example.data, null, 2));
    setResult(null);
    setError(null);
  };

  // Prepare chart data
  const chartData = result ? Object.entries(result.all_probabilities)
    .map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value: value * 100,
      color: getLabelColor(name)
    }))
    .sort((a, b) => b.value - a.value)
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="gradient-text">LLM Error Intelligence</span>
        </h1>
        <p className="text-xl text-gray-400 animate-pulse-subtle">
          Experience the future of tool-call classification
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Powered by Fine-Tuned Llama-3.2-3B
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Input Tool Call</CardTitle>
              <CardDescription>
                Enter your tool call JSON or select an example below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-96 p-4 rounded-lg bg-slate-950/50 border border-slate-700 text-sm code-textarea text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                placeholder='{"query": "...", "enabled_tools": [...], "tool_calling": {...}}'
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                onClick={handleClassify}
                disabled={loading || !input}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Classifying...
                  </span>
                ) : (
                  'Classify'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {result ? (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Classification Result</CardTitle>
                <CardDescription>AI-powered error detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Classification Badge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center p-6 rounded-lg glass-card"
                  style={{
                    boxShadow: `0 0 30px ${result.category_color}40`
                  }}
                >
                  <Badge
                    className="text-lg px-4 py-2 mb-3"
                    style={{
                      backgroundColor: `${result.category_color}20`,
                      borderColor: result.category_color,
                      color: result.category_color
                    }}
                  >
                    {result.label.replace(/_/g, ' ')}
                  </Badge>
                  <div className="text-4xl font-bold mb-2" style={{ color: result.category_color }}>
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-400">
                    {getLabelDescription(result.label)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Processed in {result.processing_time_ms}ms
                  </p>
                </motion.div>

                {/* Confidence Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-300">
                    Confidence Distribution
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={150}
                          stroke="#94a3b8"
                          fontSize={11}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: number) => `${value.toFixed(2)}%`}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card h-full flex items-center justify-center">
              <CardContent className="text-center text-gray-500 py-16">
                <svg
                  className="mx-auto h-16 w-16 mb-4 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>Results will appear here</p>
                <p className="text-sm mt-2">Click Classify to analyze your tool call</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Examples Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          <span className="gradient-text">Try These Examples</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="glass-card-hover cursor-pointer h-full"
                onClick={() => loadExample(example)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{example.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {example.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Load Example
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-16 text-center text-sm text-gray-500">
        <p>Built with Next.js, FastAPI, and Llama-3.2-3B</p>
        <p className="mt-1">Rose-Hulman Institute of Technology | CSSE/MA416 Deep Learning</p>
      </div>
    </div>
  );
}
