import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  X
} from 'lucide-react';
import { Education } from '@/types/resume';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

function EducationItem({ 
  education, 
  isOpen, 
  onToggle 
}: { 
  education: Education; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { dispatch } = useResume();

  const updateEducation = (data: Partial<Education>) => {
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: { id: education.id, data },
    });
  };

  const addHighlight = () => {
    updateEducation({ highlights: [...education.highlights, ''] });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...education.highlights];
    newHighlights[index] = value;
    updateEducation({ highlights: newHighlights });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = education.highlights.filter((_, i) => i !== index);
    updateEducation({ highlights: newHighlights });
  };

  const deleteEducation = () => {
    dispatch({ type: 'DELETE_EDUCATION', payload: education.id });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="border rounded-lg bg-background/50 overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {education.degree || 'Degree'} {education.field && `in ${education.field}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {education.institution || 'Institution Name'}
              </p>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  placeholder="University Name"
                  value={education.institution}
                  onChange={(e) => updateEducation({ institution: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="City, State"
                  value={education.location}
                  onChange={(e) => updateEducation({ location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  placeholder="Bachelor of Science"
                  value={education.degree}
                  onChange={(e) => updateEducation({ degree: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  placeholder="Computer Science"
                  value={education.field}
                  onChange={(e) => updateEducation({ field: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  placeholder="Sep 2016"
                  value={education.startDate}
                  onChange={(e) => updateEducation({ startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  placeholder="May 2020"
                  value={education.endDate}
                  onChange={(e) => updateEducation({ endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (optional)</Label>
                <Input
                  placeholder="3.8/4.0"
                  value={education.gpa || ''}
                  onChange={(e) => updateEducation({ gpa: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Highlights (optional)</Label>
                <Button size="sm" variant="ghost" onClick={addHighlight} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              {education.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Dean's List, relevant coursework, etc."
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeHighlight(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteEducation}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete Education
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function EducationForm() {
  const { resume, dispatch } = useResume();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      highlights: [],
    };
    dispatch({ type: 'ADD_EDUCATION', payload: newEdu });
    setOpenItems(prev => new Set([...prev, newEdu.id]));
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-4 w-4 text-primary" />
            Education
          </CardTitle>
          <Button size="sm" onClick={addEducation} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.education.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No education added yet</p>
            <Button variant="link" onClick={addEducation} className="mt-2">
              Add your education
            </Button>
          </div>
        ) : (
          resume.education.map((edu) => (
            <EducationItem
              key={edu.id}
              education={edu}
              isOpen={openItems.has(edu.id)}
              onToggle={() => toggleItem(edu.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
