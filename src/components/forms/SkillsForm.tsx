import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  X
} from 'lucide-react';
import { Skill } from '@/types/resume';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

function SkillCategoryItem({ 
  skillCategory, 
  isOpen, 
  onToggle 
}: { 
  skillCategory: Skill; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { dispatch } = useResume();
  const [newSkill, setNewSkill] = useState('');

  const updateSkillCategory = (data: Partial<Skill>) => {
    dispatch({
      type: 'UPDATE_SKILL_CATEGORY',
      payload: { id: skillCategory.id, data },
    });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    updateSkillCategory({ skills: [...skillCategory.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    const newSkills = skillCategory.skills.filter((_, i) => i !== index);
    updateSkillCategory({ skills: newSkills });
  };

  const deleteCategory = () => {
    dispatch({ type: 'DELETE_SKILL_CATEGORY', payload: skillCategory.id });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="border rounded-lg bg-background/50 overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {skillCategory.category || 'Skill Category'}
              </p>
              <p className="text-sm text-muted-foreground">
                {skillCategory.skills.length} skills
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
            <div className="space-y-2 pt-4">
              <Label>Category Name</Label>
              <Input
                placeholder="Programming Languages, Tools, Soft Skills..."
                value={skillCategory.category}
                onChange={(e) => updateSkillCategory({ category: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label>Skills</Label>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} disabled={!newSkill.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillCategory.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="gap-1 px-3 py-1.5"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {skillCategory.skills.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Add skills by typing and pressing Enter
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteCategory}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete Category
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function SkillsForm() {
  const { resume, dispatch } = useResume();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const addSkillCategory = () => {
    const newCategory: Skill = {
      id: crypto.randomUUID(),
      category: '',
      skills: [],
    };
    dispatch({ type: 'ADD_SKILL_CATEGORY', payload: newCategory });
    setOpenItems(prev => new Set([...prev, newCategory.id]));
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
            <Wrench className="h-4 w-4 text-primary" />
            Skills
          </CardTitle>
          <Button size="sm" onClick={addSkillCategory} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No skills added yet</p>
            <Button variant="link" onClick={addSkillCategory} className="mt-2">
              Add your first skill category
            </Button>
          </div>
        ) : (
          resume.skills.map((skill) => (
            <SkillCategoryItem
              key={skill.id}
              skillCategory={skill}
              isOpen={openItems.has(skill.id)}
              onToggle={() => toggleItem(skill.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}