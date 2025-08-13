import React from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useGetInstructorSalesSummaryQuery } from "@/feature/api/purchaseApi";

const BalanceSheet = () => {
  const { user } = useSelector((state) => state.auth);
  const instructorId = user?._id;

  const { data, isLoading, isError } = useGetInstructorSalesSummaryQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Failed to load balance sheet</p>;

  const { purchasedCourse = [] } = data || {};

  const instructorSales = purchasedCourse.filter(
    (item) =>
      item.courseId?.creator === instructorId && item.userId?._id !== instructorId
  );

  const revenue = instructorSales.reduce((sum, item) => sum + item.amount, 0);

  // Simulated/Fixed costs
  const paymentFees = 300;
  const hostingCost = 500;
  const developerPayment = 2000;
  const platformCredits = 1500;

  const expenses = paymentFees + hostingCost + developerPayment;

  const liabilities = [
    { label: "Bandwidth Bill Due", amount: 2000 },
  ];

  const assets = [
    { label: "Cash (from students)", amount: revenue },
    { label: "Platform Credits", amount: platformCredits },
  ];

  const equity = [
    { label: "Revenue (from sales)", amount: revenue+platformCredits },
    { label: "Less: Payment Fees", amount: -paymentFees },
    { label: "Less: Hosting Cost", amount: -hostingCost },
    { label: "Less: Developer Payment", amount: -developerPayment },
  ];

  const totalAssets = revenue + platformCredits;
  const totalLiabilities = liabilities.reduce((sum, i) => sum + i.amount, 0);
  const netEquity = totalAssets - expenses;

  const format = (num) => `₹${num.toLocaleString()}`;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Balance Sheet</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
          </CardHeader>
          <CardContent>
            {assets.map((item, idx) => (
              <div key={idx} className="flex justify-between mb-2">
                <span>{item.label}</span>
                <span>{format(item.amount)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <p className="font-semibold flex justify-between">
              <span>Total:</span>
              <span>{format(totalAssets)}</span>
            </p>
          </CardContent>
        </Card>

        {/* Liabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            {liabilities.map((item, idx) => (
              <div key={idx} className="flex justify-between mb-2">
                <span>{item.label}</span>
                <span>{format(item.amount)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <p className="font-semibold flex justify-between">
              <span>Total:</span>
              <span>{format(totalLiabilities)}</span>
            </p>
          </CardContent>
        </Card>

        {/* Equity */}
        <Card>
          <CardHeader>
            <CardTitle>Equity</CardTitle>
          </CardHeader>
          <CardContent>
            {equity.map((item, idx) => (
              <div key={idx} className="flex justify-between mb-2">
                <span>{item.label}</span>
                <span>{format(item.amount)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <p className="font-semibold flex justify-between">
              <span>Net Equity:</span>
              <span>{format(netEquity)}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Equation Summary */}
      <div className="mt-8 text-center text-lg font-bold">
        <p>
          <span className="text-gray-600">Assets =</span> {format(totalLiabilities)} (Liabilities) +{" "}
          {format(netEquity)} (Equity)
        </p>
      </div>
    </div>
  );
};

export default BalanceSheet;




// import React from "react";
// import { useSelector } from "react-redux";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { useGetInstructorSalesSummaryQuery } from "@/feature/api/purchaseApi";

// const BalanceSheet = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { data, isLoading, isError } = useGetInstructorSalesSummaryQuery();

//   if (isLoading) return <h1 className="text-xl text-gray-600">Loading...</h1>;
//   if (isError) return <h1 className="text-red-500 text-xl">Failed to fetch balance sheet</h1>;

//   let totalCredit = 0;
//   let totalDebit = 0;

//   const transactions = (data?.purchasedCourse || []).map((txn) => {
//     const isSelfPurchase = txn.userId?._id === user?._id;

//     if (isSelfPurchase) {
//       totalDebit += txn.amount;
//     } else {
//       totalCredit += txn.amount;
//     }

//     return {
//       ...txn,
//       type: isSelfPurchase ? "debit" : "credit",
//     };
//   });

//   const netBalance = totalCredit - totalDebit;

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-800">Balance Sheet</h2>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Credit</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-xl font-bold text-green-600">₹{totalCredit}</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Total Debit</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-xl font-bold text-red-600">₹{totalDebit}</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Net Balance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-xl font-bold text-blue-600">₹{netBalance}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Transactions Table */}
//       <div className="overflow-x-auto mt-6">
//         <table className="min-w-full bg-white border rounded shadow">
//           <thead>
//             <tr className="bg-gray-100 text-gray-700 text-left">
//               <th className="px-4 py-2">Date</th>
//               <th className="px-4 py-2">User</th>
//               <th className="px-4 py-2">Email</th>
//               <th className="px-4 py-2">Course Title</th>
//               <th className="px-4 py-2">Type</th>
//               <th className="px-4 py-2">Amount (₹)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-4 text-gray-500">
//                   No transactions found
//                 </td>
//               </tr>
//             ) : (
//               transactions.map((txn, idx) => (
//                 <tr key={idx} className="border-t">
//                   <td className="px-4 py-2">{new Date(txn.createdAt).toLocaleDateString()}</td>
//                   <td className="px-4 py-2">{txn.userId?.name || "Unknown User"}</td>
//                   <td className="px-4 py-2">{txn.userId?.email || "N/A"}</td>
//                   <td className="px-4 py-2">{txn.courseId?.courseTitle || "Unknown Course"}</td>
//                   <td
//                     className={`px-4 py-2 font-medium ${
//                       txn.type === "credit" ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {txn.type === "credit" ? "Credit" : "Debit"}
//                   </td>
//                   <td className="px-4 py-2">₹{txn.amount}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default BalanceSheet;
