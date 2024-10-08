import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Plus } from 'lucide-react';
import { transactionAction } from '@/lib/actions/transactionAction';

// Zod schema for form validation
const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  description: z.string().max(300, "Description must be 300 characters or less").optional(),
});

type AddFundsSheetProps = {
  toBank: Account; // Assuming the account type is passed here
};

const AddFundsSheet: React.FC<AddFundsSheetProps> = ({ toBank }) => {
  const [isOpen, setIsOpen] = useState(false); // Manage sheet open/close state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const handleAddFunds = async (data: z.infer<typeof formSchema>) => {
    setError(null); // Clear previous error
    setIsLoading(true);

    try {
      const amount = parseFloat(data.amount);

      // Handle validation for credit account limits
      if (toBank.type === 'credit') {
        const newCreditBalance = toBank.balance + amount;

        // Ensure the new balance doesn't exceed the opening balance (credit limit)
        if (newCreditBalance > toBank.opening_balance) {
          setError("This transaction exceeds the credit limit.");
          setIsLoading(false);
          return;
        }
      }

      // Add funds logic
      await transactionAction.adminAddFunds(toBank, amount, data.description || "");

      // Reset the form after submission
      form.reset();
      setIsOpen(false); // Close the sheet after successful submission
    } catch (error) {
      console.error("Adding funds failed: ", error);
      setError("An error occurred while adding the funds.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-gray-100 p-2.5 rounded-md shadow-md m-0">
          <Plus className="w-5 h-5 text-black" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[400px] bg-white-100">
        <SheetHeader>
          <SheetTitle className="text-black text-3xl">Add Funds</SheetTitle>
          <SheetDescription>{`Account: ${toBank.type.charAt(0).toUpperCase() + toBank.type.slice(1)} - ${toBank.owner_username}`}</SheetDescription>
          <SheetDescription>{`Current Balance: ${toBank.balance}`}</SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(handleAddFunds)} className="space-y-4 mt-4">
          {/* Input for Amount */}
          <div>
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input
              id="amount"
              type="text"
              {...form.register('amount')}
              placeholder="Enter amount"
              className="mt-1 w-full input-class bg-white-100"
            />
            <p className="text-red-500 text-sm">{form.formState.errors.amount?.message}</p>
          </div>

          {/* Input for Optional Description */}
          <div>
            <Label htmlFor="description" className="text-right">Optional Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Add an optional description"
              className="mt-1 w-full input-class bg-white-100"
            />
            <p className="text-red-500 text-sm">{form.formState.errors.description?.message}</p>
          </div>

          {error && <p className="text-red-500">{error}</p>} {/* Display error message if any */}

          {/* Footer with Cancel and Add buttons */}
          <SheetFooter className="flex justify-between mt-6">
            <SheetClose asChild>
              <Button variant="ghost" onClick={() => form.reset()}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" variant="default">
              {isLoading ? "Processing..." : "Add Funds"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddFundsSheet;
