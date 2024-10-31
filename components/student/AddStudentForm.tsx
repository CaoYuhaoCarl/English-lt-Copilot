import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from '@/lib/types';
import { UserPlus } from 'lucide-react';

interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, 'id' | 'testHistory'>) => void;
  grades: string[];
  classes: string[];
}

export default function AddStudentForm({
  onAddStudent,
  grades,
  classes,
}: AddStudentFormProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [classNum, setClassNum] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && grade && classNum) {
      onAddStudent({
        name,
        grade,
        class: classNum,
      });
      setName('');
      setGrade('');
      setClassNum('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">学生姓名</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入学生姓名"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>年级</Label>
          <Select value={grade} onValueChange={setGrade} required>
            <SelectTrigger>
              <SelectValue placeholder="选择年级" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>班级</Label>
          <Select value={classNum} onValueChange={setClassNum} required>
            <SelectTrigger>
              <SelectValue placeholder="选择班级" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c} value={c}>{`${c}班`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2">
        <UserPlus className="w-4 h-4" />
        添加学生
      </Button>
    </form>
  );
}