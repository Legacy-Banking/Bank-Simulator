"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { BankDropdown } from "./BankDropDown";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// Example placeholder function to replace `decryptId`
const decryptId = (id: string) => {
  // Implement your logic to decrypt the ID
  return id; // For now, returning the same ID
};

// Example placeholder function to get bank details by account ID
const getBankByAccountId = async ({ accountId }: { accountId: string }) => {
  // Replace with your logic to fetch the bank details by account ID
  return {
    userId: { $id: "receiverUserId" },
    fundingSourceUrl: "https://example.com/receiver-funding-source",
  };
};

// Example placeholder function to get bank details by document ID
const getBank = async ({ documentId }: { documentId: string }) => {
  // Replace with your logic to fetch the bank details by document ID
  return {
    userId: { $id: "senderUserId" },
    fundingSourceUrl: "https://example.com/sender-funding-source",
  };
};

// Example placeholder function to create a transfer
const createTransfer = async (params: any) => {
  // Replace with your logic to create a transfer
  return true; // Assuming the transfer is successful
};

// Example placeholder function to create a transaction
const createTransaction = async (transaction: any) => {
  // Replace with your logic to create a transaction
  return true; // Assuming the transaction is successful
};

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(0, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = ({ accounts }: { accounts: Account[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(accounts[0] || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        email: "",
        amount: "",
        senderBank: selectedAccount?.id || "",
        sharableId: "",
    },
  });

  const handleBankChange = (selectedBankId: string) => {
    const account = accounts.find((acc) => acc.id === selectedBankId);
    setSelectedAccount(account || null);
    form.setValue("senderBank", selectedBankId);
  };

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      const senderBank = await getBank({ documentId: data.senderBank });

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };

      // Create transfer
      const transfer = await createTransfer(transferParams);

      // Create transfer transaction
      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.userId.$id, // Adjusted to match available data
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.userId.$id, // Adjusted to match available data
          email: data.email,
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    From Bank Account
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      setValue={form.setValue}
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  {selectedAccount && (
                    <p className="mt-2 text-12 font-medium text-gray-700">
                      Balance: {selectedAccount.currentBalance.toFixed(2)}
                    </p>
                  )}
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />



        <div className="payment-transfer_form-details">
          <h2 className="py-2 text-18 font-semibold text-gray-900">
            Bank account details
          </h2>
          {/* <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p> */}
        </div>

        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    To Bank Account
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds to
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      setValue={form.setValue}
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  {selectedAccount && (
                    <p className="mt-2 text-12 font-medium text-gray-700">
                      Balance: {selectedAccount.currentBalance.toFixed(2)}
                    </p>
                  )}
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Please provide any additional information or instructions
                    related to the transfer
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea
                      placeholder="Write a short note here"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: 5.00"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="text-14 w-full bg-blue-gradient font-semibold text-white-100 shadow-form">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
