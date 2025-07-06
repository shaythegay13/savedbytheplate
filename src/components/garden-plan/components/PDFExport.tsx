import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

const PDFExport: React.FC<PDFExportProps> = ({ contentRef }) => {
  const exportToPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('garden-plan.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex justify-end space-x-4 print:hidden">
      <Button
        onClick={exportToPDF}
        className="bg-sbtp-blue-600 hover:bg-sbtp-blue-700 text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
    </div>
  );
};

export default PDFExport;