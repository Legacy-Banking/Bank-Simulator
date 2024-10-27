"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Assuming you're using a UI dialog component
import { Button } from "@/components/ui/button";

type TrashBillDetailSheetProps = {
  status: boolean; // Whether the dialog is open or closed
  bill: {
    id: string;
    description: string;
  } | null;
  onClose: () => void; // Callback function to close the dialog
  deleteBill: () => void; // Callback function to confirm the deletion
};

const TrashBillDetailSheet: React.FC<TrashBillDetailSheetProps> = ({ status, bill, onClose, deleteBill }) => {
  if (!status) return null;

  return (
    <Dialog open={status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 rounded-lg shadow-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semi-bold font-inter mb-10">Confirm Delete</DialogTitle>
          <DialogDescription className="font-inter text-lg text-blackText-200 border-blue-25 border-y-2 py-6">
            <span className="text-base font-bold">Are you sure you want to delete this bill permanently?</span>
            <span className="text-base mt-4 block">
              This action will also delete all <span className="text-base font-semibold">assigned bills</span> and related <span className="text-base font-semibold">messages</span>.
            </span>
            <span className="text-red-500 text-base font-bold mt-4 block">This action is final and cannot be undone</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            className="uppercase bg-white-100 font-inter font-medium tracking-wider border border-gray-300 hover:bg-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteBill}
            variant="destructive"
            className="uppercase font-inter font-medium tracking-wider bg-blue-25 text-white-100 hover:bg-blue-200"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrashBillDetailSheet;
