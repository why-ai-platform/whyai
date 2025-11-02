import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import { BreadcrumbNav } from '../../components/common/BreadcrumbNav';
import { ROUTES } from '../../constants';
import { 
  Play, 
  RotateCcw, 
  Save, 
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Code2,
  Terminal,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solved: boolean;
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
}

const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Linear Regression Implementation',
    difficulty: 'Easy',
    category: 'Machine Learning',
    solved: true,
    description: 'Implement a simple linear regression model from scratch using NumPy.',
    examples: [
      {
        input: 'X = [[1], [2], [3]], y = [2, 4, 6]',
        output: 'slope = 2.0, intercept = 0.0',
        explanation: 'Perfect linear relationship'
      }
    ],
    constraints: ['Use only NumPy', 'No scikit-learn', 'Must handle gradient descent']
  },
  {
    id: '2',
    title: 'Neural Network Forward Pass',
    difficulty: 'Medium',
    category: 'Deep Learning',
    solved: false,
    description: 'Implement forward propagation for a 2-layer neural network.',
    examples: [
      {
        input: 'X = [0.5, 0.3], W1 = [[0.1, 0.2], [0.3, 0.4]]',
        output: 'activation = [0.23, 0.35]',
        explanation: 'ReLU activation applied'
      }
    ],
    constraints: ['Use ReLU activation', 'Implement from scratch', 'Handle batch inputs']
  },
  {
    id: '3',
    title: 'Text Classification with Transformers',
    difficulty: 'Hard',
    category: 'NLP',
    solved: false,
    description: 'Fine-tune a BERT model for sentiment classification.',
    examples: [
      {
        input: 'text = "This movie is amazing!"',
        output: 'sentiment = "positive", confidence = 0.95',
        explanation: 'High confidence positive sentiment'
      }
    ],
    constraints: ['Use HuggingFace', 'GPU required', 'Achieve >90% accuracy']
  },
];

const defaultCode = `# Import necessary libraries
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split

# Your solution here
def solve():
    """
    Implement your solution
    
    Returns:
        result: Your computed result
    """
    pass

# Test your solution
if __name__ == "__main__":
    result = solve()
    print(f"Result: {result}")
`;

export function PracticePage() {
  const location = useLocation();
  const [selectedProblem, setSelectedProblem] = useState(mockProblems[0]);
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: number; total: number } | null>(null);
  
  // Check if navigated from playground
  const fromPlayground = location.state?.fromPlayground || false;
  
  // Breadcrumb items based on navigation source
  const breadcrumbItems = fromPlayground
    ? [
        { label: 'Home', path: ROUTES.HOME },
        { label: 'Courses', path: ROUTES.COURSES },
        { label: 'Playground', path: ROUTES.COURSES },
        { label: 'Practice', path: ROUTES.PRACTICE },
      ]
    : [
        { label: 'Home', path: ROUTES.HOME },
        { label: 'Practice', path: ROUTES.PRACTICE },
      ];

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running your code...\n');
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOutput = `
=== Code Execution ===
✓ Imported libraries successfully
✓ GPU detected: Tesla T4
✓ Running your solution...

Result: [0.234, 0.567, 0.891]

=== Performance Metrics ===
Execution time: 0.45s
Memory usage: 234 MB
GPU utilization: 78%

=== Test Cases ===
Test 1: PASSED ✓
Test 2: PASSED ✓
Test 3: FAILED ✗
  Expected: [0.234, 0.567, 0.892]
  Got:      [0.234, 0.567, 0.891]

Score: 2/3 test cases passed
    `;
    
    setOutput(mockOutput);
    setTestResults({ passed: 2, total: 3 });
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput('');
    setTestResults(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pb-8 min-h-[calc(100vh-64px)]">
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="max-w-[1920px] mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI/ML Practice Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Solve problems with GPU-powered execution environment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-280px)]">
          {/* Problem List Sidebar */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-gray-900 dark:text-white">Problems</h2>
              </div>
              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="p-4 space-y-2">
                  {mockProblems.map((problem) => (
                    <motion.button
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem)}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedProblem.id === problem.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {problem.id}. {problem.title}
                        </span>
                        {problem.solved && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(problem.difficulty) + ' text-xs'}>
                          {problem.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {problem.category}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 flex flex-col space-y-4">
            {/* Problem Description */}
            <Card className="flex-shrink-0">
              <Tabs defaultValue="description" className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-700 px-4">
                  <TabsList className="h-12">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="constraints">Constraints</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="h-64">
                  <TabsContent value="description" className="p-4 m-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedProblem.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
                          {selectedProblem.difficulty}
                        </Badge>
                        <Badge variant="outline">{selectedProblem.category}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedProblem.description}
                    </p>
                  </TabsContent>

                  <TabsContent value="examples" className="p-4 m-0 space-y-4">
                    {selectedProblem.examples.map((example, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Example {idx + 1}</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Input:</span>
                            <pre className="mt-1 p-2 bg-gray-900 text-green-400 rounded overflow-x-auto">
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Output:</span>
                            <pre className="mt-1 p-2 bg-gray-900 text-green-400 rounded overflow-x-auto">
                              {example.output}
                            </pre>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Explanation:</span>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">{example.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="constraints" className="p-4 m-0">
                    <ul className="space-y-2">
                      {selectedProblem.constraints.map((constraint, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="submissions" className="p-4 m-0">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Your submission history will appear here</p>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </Card>

            {/* Code Editor and Output */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 min-h-0">
              {/* Code Editor */}
              <Card className="flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Code Editor</span>
                    <Badge variant="outline" className="text-xs">Python 3.10</Badge>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                      GPU Enabled
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                    <Button size="sm" variant="outline">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-none"
                    spellCheck={false}
                  />
                </ScrollArea>
              </Card>

              {/* Output Terminal */}
              <Card className="flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Output</span>
                    {testResults && (
                      <Badge 
                        className={
                          testResults.passed === testResults.total
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }
                      >
                        {testResults.passed}/{testResults.total} Passed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Last run: Just now</span>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <pre className="p-4 font-mono text-sm text-gray-300 bg-gray-900 whitespace-pre-wrap min-h-[400px]">
                    {output || 'Click "Run Code" to see output...'}
                  </pre>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
