import { formatAmount, formatDateTime } from "@/lib/utils";
import { useAppSelector } from "@/app/store/hooks";
import { billAction } from "@/utils/billAction";

const SheetDetails = (bills: BillDetails) => {
  const { bill, biller } = bills;
  const user = useAppSelector((state) => state.user);
  const itemPartition = billAction.billItemRandomPartition(bill.amount!);

  // Ensure bill.created_on is valid and properly formatted
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">INVOICE</h1>
          <p className="text-sm">Invoice #: <span className="font-semibold">{bill.invoice_number}</span></p>
          <p className="text-sm">Date: <span className="font-semibold">{formatDateTime(bill.created_on!)}</span></p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">{biller.name}</h2>
          <p>123 Business Ave</p>
          <p>City, State ZIP</p>
          <p>Email: contact@yourcompany.com</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Bill To:</h3>
        <p>{user.user_name}</p>
        <p>400 BK St</p>
        <p>Legacy City, 4671</p>
        <p>Email: {user.user_name}@gmail.com</p>
      </div>

      {/* Invoice Items */}
      <div className="mb-6">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-10 py-2 text-left">Item</th>
              <th className="border border-gray-300 px-10 py-2 text-left">Quantity</th>
              <th className="border border-gray-300 px-10 py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {itemPartition.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-10 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-10 py-2">1</td>
                <td className="border border-gray-300 px-10 py-2">${item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-lg font-semibold">Subtotal: ${(bill.amount! * 0.9).toFixed(2)}</p>
          <p className="text-lg font-semibold">Tax (10%): ${(bill.amount! * 0.1).toFixed(2)}</p>
          <p className="text-lg font-semibold">Total: ${bill.amount?.toFixed(2)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 border-t pt-4 text-center">
        <p className="text-sm">Have Fun learning!</p>
        <p className="text-sm">Payment is due {formatDateTime(bill.due_date!)}</p>
      </div>
    </div>
  );
};

export default SheetDetails;
