import { useResume } from '@/context/ResumeContext';
import { calculateATSScore, getScoreColor, getScoreLabel } from '@/lib/atsScoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb } from 'lucide-react';

export function ATSScoreCard() {
  const { resume, settings } = useResume();
  const score = calculateATSScore(resume, settings.careerRole);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-primary" />
          ATS Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
            {score.overall}
          </div>
          <div>
            <Badge variant={score.overall >= 70 ? 'default' : 'secondary'}>
              {getScoreLabel(score.overall)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">out of 100</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Action Verbs</span>
              <span>{score.actionVerbs}%</span>
            </div>
            <Progress value={score.actionVerbs} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Completeness</span>
              <span>{score.completeness}%</span>
            </div>
            <Progress value={score.completeness} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Keywords</span>
              <span>{score.keywords}%</span>
            </div>
            <Progress value={score.keywords} className="h-1.5" />
          </div>
        </div>

        {score.suggestions.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium flex items-center gap-1 mb-2">
              <Lightbulb className="h-3 w-3 text-warning" />
              Suggestions
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {score.suggestions.slice(0, 3).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}