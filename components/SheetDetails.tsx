import React from "react";
import { formatDateTime } from "@/lib/utils/utils";
import { useAppSelector } from "@/store/hooks";
import { Tooltip } from "react-tooltip";
import { FaQuestionCircle } from "react-icons/fa";

const SheetDetails = (bills: BillDetails) => {
  const { bill, biller } = bills;
  const user = useAppSelector((state) => state.user);

  function formatToCurrency(amount: number | undefined): string {
    if (!amount) {
      return "$0.00";
    }
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-2xl max-w-md mx-auto">
      {/* Header */}
      <div className="grid grid-cols-2 gap-4 items-start mt-1 mb-2">
        <div>
          <h1 className="text-lg underline underline-offset-1 font-semibold">Invoice</h1>
          <p className="text-xs mt-1">
            Invoice Number:{" "}
            <span className="text-xs font-medium">
              {bill.invoice_number?.replace("/", "-") ?? "N/A"}
            </span>
          </p>
          <p className="text-xs">
            Invoice Date:{" "}
            <span className="text-xs font-medium">
              {formatDateTime(bill.created_at!)}
            </span>
          </p>
        </div>
        <div className="text-xs text-right">
          <h2 className="font-semibold text-base mb-1 text-blue-800">
            {biller.name}
          </h2>
          <p>123 Business Ave</p>
          <p>City, State and ZIP</p>
          <p
            className="break-words"
            style={{
              wordBreak: "break-word", // Ensures long words break into the next line
              overflowWrap: "break-word", // Alternative support for breaking long words
            }}
          >
            contact@yourcompany.com
          </p>
        </div>
      </div>

      <div className="border-t-2 border-gray-400 mb-4"></div>

      {/* Bill To */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Billed To:</h3>
        <p className="text-xs">{user.user_name}</p>
        <p className="text-xs">400 BK St</p>
        <p className="text-xs">Legacy City, 4671</p>
        <p className="text-xs">{user.user_name}@gmail.com</p>
      </div>

      {/* Description */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Description</h3>
        <p
          className="break-words text-xs"
          style={{
            wordBreak: "break-word", // Ensures long words break into the next line
            overflowWrap: "break-word", // Alternative support for breaking long words
          }}
        >
          {bill.description}
        </p>
      </div>

      {/* Total */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-xs">
        {/* Empty placeholder for proper alignment */}
        <div></div>
        <div className="text-right items-end font-semibold">AMOUNT</div>

        <div className="text-left">Subtotal</div>
        <div className="text-right">{formatToCurrency(bill.amount! * 0.9)}</div>

        <div className="text-left">Tax</div>
        <div className="text-right">{formatToCurrency(bill.amount! * 0.1)}</div>

        {/* Merge the TOTAL row into one and align both text and value */}
        <div className="col-span-2 font-semibold bg-slate-300 rounded-sm py-1 flex justify-between">
          <span>TOTAL</span>
          <span>{formatToCurrency(bill.amount!)}</span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="flex justify-start mb-4 text-xs">
        <div className="text-left">
          <h3 className="text-sm font-semibold mb-1">Payment Details
            <FaQuestionCircle
              data-tooltip-id="details-tooltip"
              className="inline-block ml-1 text-gray-500 cursor-pointer"
            />
          </h3>
          <p>
            Biller Code: {biller.biller_code}{" "}
          </p>
          <p>
            Biller Name: {biller.name}{" "}
          </p>
          <p>
            Reference Number: {bill.reference_number}{" "}

          </p>
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip
        id="details-tooltip"
        place="top"
        className="max-w-sm text-sm bg-gray-800 text-white p-2 rounded shadow-lg z-50"
      >
        These are important information that will be useful when you want to
        pay your bills.
      </Tooltip>

      {/* Footer */}
      <div className="mt-1 border-t-2 border-slate-400 pt-2 text-center">
        {bill.status === "paid" ? (
          <p className="text-xs mb-1 text-grey-500">
            Bill is paid, Well done!
          </p>
        ) : (
          <p className="text-xs mb-1 text-gray-500">
            Please make the payment by the due date.
          </p>
        )}

        <p className="text-xs mb-2 font-semibold">
          Payment is due {formatDateTime(bill.due_date!)}
        </p>
      </div>
    </div>
  );
};

export default SheetDetails;
