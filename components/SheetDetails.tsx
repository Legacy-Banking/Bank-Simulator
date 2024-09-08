import { formatAmount, formatDateTime } from "@/lib/utils";

const SheetDetails = ({ bills} : Bill) => {
    return (
      <div>
        <p><strong>Name:</strong> {bills.from}</p>
        <p><strong>Date:</strong> {formatDateTime(bills.paid_on)}</p>
        <p><strong>Amount:</strong> {formatAmount(bills.amount)}</p>
        {bills.description && <p><strong>Description:</strong> {bills.description || 'No description available'}</p>}
        <br></br>
        {bills.status && <p><strong>Status:</strong> {bills.status}</p>}
      </div>
    );
  };
export default SheetDetails;