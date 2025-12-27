import { useRef } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { exportToPdf } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Moon, 
  Sun, 
  Save,
  Undo2,
  Redo2,
  FileText
} from 'lucide-react';

export function Header() {
  const { resume, isSaving, lastSaved, canUndo, canRedo, undo, redo, saveCurrentResume } = useResume();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleExportPdf = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      toast({ title: 'Error', description: 'Could not find resume preview', variant: 'destructive' });
      return;
    }

    toast({ title: 'Generating PDF...', description: 'Please wait a moment' });
    
    try {
      await exportToPdf(element, `${resume.personalInfo.fullName || 'resume'}.pdf`);
      toast({ title: 'PDF Downloaded!', description: 'Your resume has been saved' });
    } catch (error) {
      toast({ title: 'Export failed', description: 'Please try again', variant: 'destructive' });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">ResumeAI</h1>
            <p className="text-xs text-muted-foreground">
              {isSaving ? 'Saving...' : lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : 'All changes saved'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={saveCurrentResume} className="gap-1.5">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size="sm" onClick={handleExportPdf} className="gap-1.5">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
