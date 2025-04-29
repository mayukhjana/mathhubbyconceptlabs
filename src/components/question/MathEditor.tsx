
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MathEditor: React.FC<MathEditorProps> = ({ value, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [equation, setEquation] = useState("");

  const templates = {
    matrix2x2: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
    matrix3x3: "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}",
    fraction: "\\frac{numerator}{denominator}",
    squareRoot: "\\sqrt{x}",
    integral: "\\int_{a}^{b} f(x) dx",
    summation: "\\sum_{i=1}^{n} x_i",
    limit: "\\lim_{x \\to \\infty}",
  };

  const insertTemplate = (template: string) => {
    const textArea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const newText = value.substring(0, start) + template + value.substring(end);
      onChange(newText);
      setEquation("");
    }
  };

  const insertEquation = () => {
    if (equation) {
      const newText = value + " $" + equation + "$ ";
      onChange(newText);
      setEquation("");
    }
  };

  const renderPreview = () => {
    try {
      return value.split(/(\$[^$]+\$)/).map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(math, {
                  throwOnError: false,
                  displayMode: false
                })
              }}
            />
          );
        }
        return <span key={index}>{part}</span>;
      });
    } catch (error) {
      console.error('KaTeX error:', error);
      return value;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertTemplate(templates.matrix2x2)}
        >
          2×2 Matrix
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertTemplate(templates.matrix3x3)}
        >
          3×3 Matrix
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertTemplate(templates.fraction)}
        >
          Fraction
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertTemplate(templates.squareRoot)}
        >
          Square Root
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertTemplate(templates.integral)}
        >
          Integral
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertTemplate(templates.summation)}
        >
          Summation
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertTemplate(templates.limit)}
        >
          Limit
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type LaTeX equation..."
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
        />
        <Button type="button" onClick={insertEquation}>
          Insert
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="Enter question text with math equations between $ symbols..."
      />

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {showPreview && (
        <div className="p-4 border rounded-md bg-white">
          {renderPreview()}
        </div>
      )}
    </div>
  );
};

export default MathEditor;
