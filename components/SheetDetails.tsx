import { formatDateTime } from "@/lib/utils";
import { useAppSelector } from "@/app/store/hooks";

const SheetDetails = (bills: BillDetails) => {
  const { bill, biller } = bills;
  const user = useAppSelector((state) => state.user);

  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="grid grid-cols-2 gap-4 items-start mb-2">
        <div>
          <h1 className="text-2xl underline underline-offset-1 font-semibold">Invoice</h1>
          <p className="text-sm mt-2">Invoice Number: <span className="text-sm font-medium">{bill.invoice_number?.replace("/", "-") ?? "N/A"}</span></p>
          <p className="text-sm"> Invoice Date: <span className="text-sm font-medium">{formatDateTime(bill.created_at!)}</span></p>
        </div>
        <div className="text-sm text-right leading-2">
          <h2 className="font-semibold mb-2">{biller.name}</h2>
          <p>123 Business Ave</p>
          <p>City, State and ZIP</p>
          <p className="break-words"
            style={{
              wordBreak: 'break-word', // Ensures long words break into the next line
              overflowWrap: 'break-word', // Alternative support for breaking long words
            }}>contact@yourcompany.com</p>
        </div>

      </div>

      <div className="border-t-2 border-gray-400 mb-4"></div>

      {/* Bill To */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Billed To:</h3>
        <p className="text-sm">{user.user_name}</p>
        <p className="text-sm">400 BK St</p>
        <p className="text-sm">Legacy City, 4671</p>
        <p className="text-sm">{user.user_name}@gmail.com</p>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Description</h3>
        <p className="break-words text-sm"
          style={{
            wordBreak: 'break-word', // Ensures long words break into the next line
            overflowWrap: 'break-word', // Alternative support for breaking long words
          }}>Description of the bill.....</p>
      </div>

      {/* Total */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 text-sm">

        {/* Empty placeholder for proper alignment */}
        <div></div>
        <div className="text-right items-end font-semibold">AMOUNT</div>

        <div className="text-left">Subtotal</div>
        <div className="text-right">${(bill.amount! * 0.9).toFixed(2)}</div>

        <div className="text-left">Tax</div>
        <div className="text-right">${(bill.amount! * 0.1).toFixed(2)}</div>

        {/* Merge the TOTAL row into one and align both text and value */}
        <div className="col-span-2 font-semibold bg-slate-300 rounded-sm py-1 flex justify-between">
          <span>TOTAL</span>
          <span>${bill.amount?.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Details */}  {/* NEEDS TO BE IMPLEMENTED */}
      <div className="flex justify-start mb-4 text-sm">
        <div className="text-left">
          <h3 className="text-sm font-semibold">Payment Details</h3>
          <p>Biller Code: {biller.biller_code}</p>
          <p>Reference Number: {bill.reference_number}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 border-t-2 border-slate-400 pt-4 text-center">
        {bill.status === "paid" ? (<p className="text-sm text-grey-500">Bill is paid, Well done!</p>) : (<p className="text-sm text-gray-500">Please make the payment by the due date.</p>)}

        <p className="text-sm font-semibold">Payment is due {formatDateTime(bill.due_date!)}</p>
      </div>
    </div>
  );
};

export default SheetDetails;