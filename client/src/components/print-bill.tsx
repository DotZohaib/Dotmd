import { useEffect, useState } from "react";
import { Bill } from "@/types";
import { useBill } from "@/hooks/use-bill";

interface PrintBillProps {
  bill?: Bill; // Optional bill passed in for printing from history
}

export default function PrintBill({ bill }: PrintBillProps) {
  const { billItems, billDetails } = useBill();
  const [printBill, setPrintBill] = useState<Bill | null>(null);
  
  useEffect(() => {
    if (bill) {
      setPrintBill(bill);
    } else if (billDetails && billItems.length > 0) {
      setPrintBill({
        ...billDetails,
        items: billItems,
      });
    }
  }, [bill, billDetails, billItems]);

  if (!printBill) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MediSearch Pharmacy</h1>
          <p className="text-gray-600">123 Health Street, Medical District</p>
          <p className="text-gray-600">Phone: +91 1234567890</p>
          <p className="text-gray-600">Email: info@medisearch.com</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
          <p className="text-gray-600">Bill #: {printBill.id || 'New Bill'}</p>
          <p className="text-gray-600">Date: {formatDate(printBill.dateCreated)}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Information</h3>
        <p className="text-gray-600">Name: {printBill.customerName || 'Guest'}</p>
        <p className="text-gray-600">Phone: {printBill.customerPhone || 'N/A'}</p>
      </div>

      <table className="min-w-full divide-y divide-gray-200 mb-8">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              S.No
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medicine
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price (₹)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tax (₹)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total (₹)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {printBill.items && printBill.items.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.medicineName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {(item.price * item.quantity).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {(item.tax * item.quantity).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {((item.price + item.tax) * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
              Subtotal:
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {printBill.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
              Tax:
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {printBill.items.reduce((acc, item) => acc + (item.tax * item.quantity), 0).toFixed(2)}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
              Grand Total:
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900">
              {printBill.totalAmount.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="border-t border-gray-200 pt-4 mt-8">
        <p className="text-gray-600 text-center mb-2">Thank you for your purchase!</p>
        <p className="text-gray-500 text-sm text-center">For any queries, please contact our customer support.</p>
      </div>
    </div>
  );
}
