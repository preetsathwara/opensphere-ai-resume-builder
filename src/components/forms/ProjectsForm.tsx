import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Loader2,
  X,
  ExternalLink
} from 'lucide-react';
import { Project } from '@/types/resume';
import { enhanceBulletPoint } from '@/lib/contentEnhancer';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

function ProjectItem({ 
  project, 
  isOpen, 
  onToggle 
}: { 
  project: Project; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { dispatch, settings } = useResume();
  const [enhancingBullet, setEnhancingBullet] = useState<number | null>(null);
  const [newTech, setNewTech] = useState('');
  const { toast } = useToast();

  const updateProject = (data: Partial<Project>) => {
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: { id: project.id, data },
    });
  };

  const addBullet = () => {
    updateProject({ bullets: [...project.bullets, ''] });
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...project.bullets];
    newBullets[index] = value;
    updateProject({ bullets: newBullets });
  };

  const removeBullet = (index: number) => {
    const newBullets = project.bullets.filter((_, i) => i !== index);
    updateProject({ bullets: newBullets });
  };

  const enhanceBullet = async (index: number) => {
    const bullet = project.bullets[index];
    if (!bullet.trim()) return;

    setEnhancingBullet(index);
    await new Promise(resolve => setTimeout(resolve, 400));

    const enhanced = enhanceBulletPoint(bullet, settings.careerRole);
    updateBullet(index, enhanced);
    
    setEnhancingBullet(null);
    toast({
      title: 'Description enhanced!',
      description: 'Your project detail has been improved.',
    });
  };

  const addTechnology = () => {
    if (!newTech.trim()) return;
    updateProject({ technologies: [...project.technologies, newTech.trim()] });
    setNewTech('');
  };

  const removeTechnology = (index: number) => {
    const newTech = project.technologies.filter((_, i) => i !== index);
    updateProject({ technologies: newTech });
  };

  const deleteProject = () => {
    dispatch({ type: 'DELETE_PROJECT', payload: project.id });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="border rounded-lg bg-background/50 overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {project.name || 'Project Name'}
              </p>
              <p className="text-sm text-muted-foreground">
                {project.technologies.slice(0, 3).join(', ')}
                {project.technologies.length > 3 && ` +${project.technologies.length - 3} more`}
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
                <Label>Project Name</Label>
                <Input
                  placeholder="My Awesome Project"
                  value={project.name}
                  onChange={(e) => updateProject({ name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  Link (optional)
                </Label>
                <Input
                  placeholder="https://github.com/..."
                  value={project.link || ''}
                  onChange={(e) => updateProject({ link: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea
                placeholder="A brief overview of the project..."
                value={project.description}
                onChange={(e) => updateProject({ description: e.target.value })}
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-3">
              <Label>Technologies Used</Label>
              
              <div className="flex gap-2">
                <Input
                  placeholder="React, Node.js, PostgreSQL..."
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTechnology()}
                />
                <Button onClick={addTechnology} disabled={!newTech.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="gap-1 px-3 py-1.5"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(index)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Key Features & Achievements</Label>
                <Button size="sm" variant="ghost" onClick={addBullet} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              {project.bullets.map((bullet, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Describe a feature or achievement..."
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
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteProject}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete Project
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function ProjectsForm() {
  const { resume, dispatch } = useResume();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      bullets: [''],
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    setOpenItems(prev => new Set([...prev, newProject.id]));
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
            <FolderOpen className="h-4 w-4 text-primary" />
            Projects
          </CardTitle>
          <Button size="sm" onClick={addProject} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No projects added yet</p>
            <Button variant="link" onClick={addProject} className="mt-2">
              Add your first project
            </Button>
          </div>
        ) : (
          resume.projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isOpen={openItems.has(project.id)}
              onToggle={() => toggleItem(project.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}