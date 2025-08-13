// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetInstructorSalesSummaryQuery, useGetPurchasedCoursesQuery } from "@/feature/api/purchaseApi";
// import React from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//   const { user } = useSelector((state) => state.auth);
//   const instructorId = user?._id;

//   const { data, isSuccess, isError, isLoading } = useGetInstructorSalesSummaryQuery();

//   if (isLoading) return <h1>Loading...</h1>;
//   if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>;

//   // const purchasedCourse = data?.purchasedCourse || [];
//   // const purchasedCourse  = data || {};
//   // console.log("Fetched purchasedCourse data:", purchasedCourse);


//   // // ✅ Filter only sales for courses created by the logged-in instructor
//   // const instructorSales = purchasedCourse.filter(
//   //   (item) => item.courseId?.creator === instructorId
//   // );
//   const { totalRevenue = 0, totalSales = 0, purchasedCourse = [] } = data || {};
// console.log("Fetched instructor summary:", data);

// const instructorSales = purchasedCourse.filter(
//   (item) => item.courseId?.creator === instructorId
// );


//   const courseData = instructorSales.map((course) => ({
//     name: course.courseId.courseTitle,
//     price: course.courseId.coursePrice
//   }));

//   totalRevenue = instructorSales.reduce((acc, element) => acc + (element.amount || 0), 0);
//   totalSales = instructorSales.length;

//   return (
//     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle>Total Sales</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
//         </CardContent>
//       </Card>

//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle>Total Revenue</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
//         </CardContent>
//       </Card>

//       <div className="flex justify-end">
//         <Link
//           to="/admin/balance-sheet"
//           className="text-blue-600 underline font-medium hover:text-blue-800"
//         >
//           View Balance Sheet →
//         </Link>
//       </div>

//       {/* Course Prices Graph */}
//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-gray-700">
//             Course Prices
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={courseData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//               <XAxis
//                 dataKey="name"
//                 stroke="#6b7280"
//                 angle={-30}
//                 textAnchor="end"
//                 interval={0}
//               />
//               <YAxis stroke="#6b7280" />
//               <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
//               <Line
//                 type="monotone"
//                 dataKey="price"
//                 stroke="#4a90e2"
//                 strokeWidth={3}
//                 dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetInstructorSalesSummaryQuery } from "@/feature/api/purchaseApi";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const instructorId = user?._id;

  const { data, isSuccess, isError, isLoading } = useGetInstructorSalesSummaryQuery();
  
  

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>;

  // ✅ Destructure data safely
  const { totalRevenue = 0, totalSales = 0, purchasedCourse = [] } = data || {};

  // console.log("Fetched instructor summary:", data);

  // ✅ Filter out only instructor's courses (redundant now but safe)
  const instructorSales = purchasedCourse.filter(
    (item) => item.courseId?.creator === instructorId &&  item.userId?._id !== instructorId   // `true` ensures fallback if backend is already filtered
  );

  const courseData = instructorSales.map((course) => ({
    name: course.courseId?.courseTitle || "Unknown",
    price: course.amount || 0
  }));
console.log("Purchased courses:", purchasedCourse);

  const safeRevenue = instructorSales.reduce((sum, c) => sum + c.amount, 0).toFixed(0);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Total Sales */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{instructorSales.length}</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">₹{safeRevenue}</p>
        </CardContent>
      </Card>

      {/* Link to Balance Sheet */}
      <div className="flex justify-end ">
        <Link
          to="/admin/balance-sheet"
          className="text-blue-600 underline font-medium hover:text-blue-800"
        >
          View Balance Sheet →
        </Link>
      </div>
      

      {/* Chart of Course Sales */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;  