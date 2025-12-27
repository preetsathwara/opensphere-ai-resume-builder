declare global {
  interface Window {
    html2pdf: any;
  }
}

export async function loadHtml2Pdf(): Promise<void> {
  if (window.html2pdf) return;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load html2pdf'));
    document.head.appendChild(script);
  });
}

export async function exportToPdf(
  element: HTMLElement,
  filename: string = 'resume.pdf'
): Promise<void> {
  await loadHtml2Pdf();
  
  const options = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
    },
    pagebreak: { mode: 'avoid-all' },
  };
  
  await window.html2pdf().set(options).from(element).save();
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
