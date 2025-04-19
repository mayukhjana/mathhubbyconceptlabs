
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuestionOptionsProps {
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  onChange: (key: 'option_a' | 'option_b' | 'option_c' | 'option_d', value: string) => void;
}

const QuestionOptions = ({ options, onChange }: QuestionOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Option A</Label>
        <Input
          value={options.a}
          onChange={(e) => onChange('option_a', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Option B</Label>
        <Input
          value={options.b}
          onChange={(e) => onChange('option_b', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Option C</Label>
        <Input
          value={options.c}
          onChange={(e) => onChange('option_c', e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Option D</Label>
        <Input
          value={options.d}
          onChange={(e) => onChange('option_d', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default QuestionOptions;
