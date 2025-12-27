import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, Sparkles, Loader2 } from 'lucide-react';
import { enhanceSummary, generateProfessionalSummary } from '@/lib/contentEnhancer';
import { useToast } from '@/hooks/use-toast';

export function SummaryForm() {
  const { resume, settings, dispatch } = useResume();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const handleEnhance = async () => {
    setIsEnhancing(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let enhanced: string;
    
    if (resume.summary.trim().length < 20) {
      // Generate a summary if the user hasn't written much
      const skills = resume.skills.flatMap(s => s.skills);
      const yearsExp = resume.workExperience.length * 2; // Rough estimate
      
      enhanced = generateProfessionalSummary(
        resume.personalInfo.fullName || 'Professional',
        resume.personalInfo.title || 'experienced professional',
        yearsExp,
        settings.careerRole,
        skills
      );
    } else {
      enhanced = enhanceSummary(resume.summary, settings.careerRole, settings.careerLevel);
    }
    
    dispatch({
      type: 'UPDATE_RESUME',
      payload: { summary: enhanced },
    });
    
    setIsEnhancing(false);
    toast({
      title: 'Summary enhanced!',
      description: 'Your professional summary has been improved.',
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Professional Summary
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="gap-1.5"
          >
            {isEnhancing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {resume.summary.trim().length < 20 ? 'Generate' : 'Enhance'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label htmlFor="summary" className="text-muted-foreground text-xs">
          Write a brief overview of your professional background and career goals
        </Label>
        <Textarea
          id="summary"
          placeholder="Results-driven software engineer with 5+ years of experience..."
          value={resume.summary}
          onChange={(e) => dispatch({ type: 'UPDATE_RESUME', payload: { summary: e.target.value } })}
          className="min-h-[120px]"
        />
        <p className="text-xs text-muted-foreground">
          {resume.summary.length}/500 characters • Aim for 50-150 words
        </p>
      </CardContent>
    </Card>
  );
}
