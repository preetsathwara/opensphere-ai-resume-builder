import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { WorkExperience } from '@/types/resume';
import { enhanceBulletPoint } from '@/lib/contentEnhancer';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

function ExperienceItem({ 
  experience, 
  isOpen, 
  onToggle 
}: { 
  experience: WorkExperience; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { dispatch, settings } = useResume();
  const [enhancingBullet, setEnhancingBullet] = useState<number | null>(null);
  const { toast } = useToast();

  const updateExperience = (data: Partial<WorkExperience>) => {
    dispatch({
      type: 'UPDATE_WORK_EXPERIENCE',
      payload: { id: experience.id, data },
    });
  };

  const addBullet = () => {
    updateExperience({ bullets: [...experience.bullets, ''] });
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...experience.bullets];
    newBullets[index] = value;
    updateExperience({ bullets: newBullets });
  };

  const removeBullet = (index: number) => {
    const newBullets = experience.bullets.filter((_, i) => i !== index);
    updateExperience({ bullets: newBullets });
  };

  const enhanceBullet = async (index: number) => {
    const bullet = experience.bullets[index];
    if (!bullet.trim()) return;

    setEnhancingBullet(index);
    await new Promise(resolve => setTimeout(resolve, 400));

    const enhanced = enhanceBulletPoint(bullet, settings.careerRole);
    updateBullet(index, enhanced);
    
    setEnhancingBullet(null);
    toast({
      title: 'Bullet point enhanced!',
      description: 'Your achievement has been improved with stronger language.',
    });
  };

  const deleteExperience = () => {
    dispatch({ type: 'DELETE_WORK_EXPERIENCE', payload: experience.id });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="border rounded-lg bg-background/50 overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {experience.position || 'Position Title'}
              </p>
              <p className="text-sm text-muted-foreground">
                {experience.company || 'Company Name'} 
                {experience.location && ` • ${experience.location}`}
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
                <Label>Position</Label>
                <Input
                  placeholder="Software Engineer"
                  value={experience.position}
                  onChange={(e) => updateExperience({ position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  placeholder="Tech Company Inc."
                  value={experience.company}
                  onChange={(e) => updateExperience({ company: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Gujarat, India"
                  value={experience.location}
                  onChange={(e) => updateExperience({ location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  placeholder="Jan 2020"
                  value={experience.startDate}
                  onChange={(e) => updateExperience({ startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  placeholder="Dec 2023"
                  value={experience.endDate}
                  onChange={(e) => updateExperience({ endDate: e.target.value })}
                  disabled={experience.current}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`current-${experience.id}`}
                checked={experience.current}
                onCheckedChange={(checked) => updateExperience({ current: !!checked, endDate: checked ? 'Present' : '' })}
              />
              <Label htmlFor={`current-${experience.id}`} className="text-sm cursor-pointer">
                I currently work here
              </Label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Key Achievements & Responsibilities</Label>
                <Button size="sm" variant="ghost" onClick={addBullet} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              {experience.bullets.map((bullet, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Describe an achievement or responsibility..."
                      value={bullet}
                      onChange={(e) => updateBullet(index, e.target.value)}
                      className="min-h-[60px] pr-10"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => enhanceBullet(index)}
                      disabled={!bullet.trim() || enhancingBullet === index}
                    >
                      {enhancingBullet === index ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeBullet(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {experience.bullets.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Add bullet points to highlight your key achievements
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteExperience}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete Experience
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function WorkExperienceForm() {
  const { resume, dispatch } = useResume();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      bullets: [''],
    };
    dispatch({ type: 'ADD_WORK_EXPERIENCE', payload: newExp });
    setOpenItems(prev => new Set([...prev, newExp.id]));
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
            <Briefcase className="h-4 w-4 text-primary" />
            Work Experience
          </CardTitle>
          <Button size="sm" onClick={addExperience} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.workExperience.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No work experience added yet</p>
            <Button variant="link" onClick={addExperience} className="mt-2">
              Add your first experience
            </Button>
          </div>
        ) : (
          resume.workExperience.map((exp) => (
            <ExperienceItem
              key={exp.id}
              experience={exp}
              isOpen={openItems.has(exp.id)}
              onToggle={() => toggleItem(exp.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}