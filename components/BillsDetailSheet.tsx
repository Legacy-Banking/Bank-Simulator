import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SheetDetails from './SheetDetails';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAppSelector } from "@/app/store/hooks";
import { formatDateTime } from "@/lib/utils";
import { Bold } from 'lucide-react';



// Define the props type for the component
type BillSheetProps = {
  bills: BillDetails | null;
  onClose: () => void;
};

const BillSheet: React.FC<BillSheetProps> = ({ bills, onClose }) => {
  if (!bills) return null;

  const { bill, biller } = bills;
  const user = useAppSelector((state) => state.user);

  const printBill = () => {
    const doc = new jsPDF();

    doc.setFontSize(10);
    // Get current date and time for the download timestamp
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');
    const formattedTime = currentDate.toLocaleTimeString();

    // Add the timestamp, right-aligned at the top right of the page
    const pageWidth = 210; // A4 page width in mm
    const marginRight = 10; // Adjusted right margin
    const textWidth = doc.getTextWidth(`Downloaded on: ${formattedDate} at ${formattedTime}`);
    const xPosition = pageWidth - textWidth - marginRight;

    // Set the position at the very top, adjust the y-coordinate as needed
    doc.text(`Downloaded on: ${formattedDate} at ${formattedTime}`, xPosition, 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${bill.invoice_number?.replace("/", "-") ?? "N/A"}`, 14, 30);
    doc.text(`Invoice Date: ${formatDateTime(bill.created_at!)}`, 14, 40);
    doc.text(`From: ${biller.name}`, 14, 50);
    doc.text(`Billed To: ${user.user_name}`, 14, 60);
    doc.text(`Description: ${bill.description}`, 14, 70);

    // Add the table using autoTable plugin
    (doc as any).autoTable({
      startY: 80,
      head: [['', 'Amount']],
      body: [
        ['Subtotal', `$${(bill.amount! * 0.9).toFixed(2)}`],
        ['Tax', `$${(bill.amount! * 0.1).toFixed(2)}`],
        ['Total', `$${(bill.amount || 0).toFixed(2)}`],
      ],
      columnStyles: {
        0: { halign: 'left', fillColor: [255, 255, 255] }, // Aligning the items column to the left
        1: { halign: 'right', fillColor: [255, 255, 255] }, // Aligning the amount column to the right
      },
      styles: {
        font: 'helvetica',
        fontSize: 12,
        cellPadding: 5,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [192, 192, 192], // Grey color for the header row
        textColor: [0, 0, 0], // Black text color for the header row
        halign: 'right' // Right align header text
      },
      theme: 'grid'
    });

    // Payment Details at the bottom left
    const finalY = (doc as any).lastAutoTable.finalY + 10; // Get Y position after the table

    doc.setFont('helvetica', 'bold');
    doc.text(`Payment Details`, 14, finalY);

    doc.setFont('helvetica', 'normal');
    doc.text(`Biller Code: ${biller.biller_code}`, 14, finalY + 10);
    doc.text(`Reference Number: ${bill.reference_number}`, 14, finalY + 20);

    // Save the created PDF
    doc.save('Print_Invoice.pdf');
  };

  return (
    <Dialog open={!!bills} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 max-w-lg w-full max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Bill Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Detailed information about the selected bill.
          </DialogDescription>
        </DialogHeader>
        <SheetDetails {...bills} />
        <DialogFooter className="w-full flex justify-center items-center">
          <Button onClick={printBill} className="text-sm bg-slate-200 w-32 m-auto hover:underline">Print Bill</Button> {/*PRINT button needs to be implemented*/}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillSheet;
