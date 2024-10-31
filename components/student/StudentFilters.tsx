import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';
import { StudentFilters } from '@/lib/types';

interface StudentFiltersProps {
  filters: StudentFilters;
  onFilterChange: (key: keyof StudentFilters, value: string) => void;
  grades: string[];
  classes: string[];
}

export default function StudentFilters({
  filters,
  onFilterChange,
  grades,
  classes,
}: StudentFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索学生姓名..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>年级</Label>
          <Select
            value={filters.grade}
            onValueChange={(value) => onFilterChange('grade', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择年级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有年级</SelectItem>
              {grades
                .filter(grade => grade !== 'all' && grade.trim() !== '')
                .map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>班级</Label>
          <Select
            value={filters.class}
            onValueChange={(value) => onFilterChange('class', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择班级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有班级</SelectItem>
              {classes
                .filter(classNum => classNum !== 'all' && classNum.trim() !== '')
                .map((classNum) => (
                  <SelectItem key={classNum} value={classNum}>{`${classNum}班`}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}