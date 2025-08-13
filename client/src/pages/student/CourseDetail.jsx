// import BuyCourseButton from "@/components/BuyCourseButton";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useGetCourseDetailWithStatusQuery, useGetRecommendedCoursesQuery } from "@/feature/api/purchaseApi";
// import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
// import React from "react";
// import ReactPlayer from "react-player";
// import { useNavigate, useParams } from "react-router-dom";

// const CourseDetail = () => {
//   const params = useParams();
//   const courseId = params.courseId;
//   const navigate = useNavigate();
//   const { data, isLoading, isError } =
//     useGetCourseDetailWithStatusQuery(courseId);

//   const { data: recommendedCourses = [], isLoading: recLoading } =
//     useGetRecommendedCoursesQuery(courseId);

//   // Render below course details

//   if (isLoading) return <h1>Loading...</h1>;
//   if (isError) return <h>Failed to load course details</h>;

//   const { course, purchased } = data;
//   console.log(purchased);

//   const handleContinueCourse = () => {
//     if (purchased) {
//       navigate(`/course-progress/${courseId}`);
//     }
//   };

//   return (
//     <div className="space-y-5">
//       <div className="bg-[#2D2F31] text-white">
//         <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2 ">
//           <h1 className="font-bold text-2xl md:text-3xl">
//             {course?.courseTitle}
//           </h1>
//           <p className="text-base md:text-lg">Course Sub-title</p>
//           <p>
//             Created By{" "}
//             <span className="text-[#C0C4FC] underline italic">
//               {course?.creator.name}
//             </span>
//           </p>
//           <div className="flex items-center gap-2 text-sm">
//             <BadgeInfo size={16} />
//             <p>Last updated {course?.createdAt.split("T")[0]}</p>
//           </div>
//           <p>Students enrolled: {course?.enrolledStudents.length}</p>
//         </div>
//       </div>
//       <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
//         <div className="w-full lg:w-1/2 space-y-5">
//           <h1 className="font-bold text-xl md:text-2xl">Description</h1>
//           <p
//             className="text-sm"
//             dangerouslySetInnerHTML={{ __html: course.description }}
//           />
//           <Card>
//             <CardHeader>
//               <CardTitle>Course Content</CardTitle>
//               <CardDescription>4 lectures</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {course.lectures.map((lecture, idx) => (
//                 <div key={idx} className="flex items-center gap-3 text-sm">
//                   <span>
//                     {lecture.isPreviewFree ? (
//                       <PlayCircle size={14} />
//                     ) : (
//                       <Lock size={14} />
//                     )}
//                   </span>
//                   <p>{lecture.lectureTitle}</p>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>
//         <div className="w-full lg:w-1/3">
//           <Card>
//             <CardContent className="p-4 flex flex-col">
//               <div className="w-full aspect-video mb-4">
//                 <ReactPlayer
//                   width="100%"
//                   height={"100%"}
//                   url={
//                     course.lectures[0].videoUrl ||
//                     "https://www.youtube.com/watch?v=icudf_w_pqU&t=16s"
//                   }
//                   controls={true}
//                 />
//               </div>
//               <h1>Lecture title</h1>
//               <Separator className="my-2" />
//               <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
//             </CardContent>
//             <CardFooter className="flex justify-center p-4">
//               {purchased ? (
//                 <Button onClick={handleContinueCourse} className="w-full">
//                   Continue Course
//                 </Button>
//               ) : (
//                 <BuyCourseButton courseId={courseId} />
//               )}
//             </CardFooter>
//           </Card>
//         </div>
//       </div>

//       {!recLoading && recommendedCourses.length > 0 && (
//   <div className="max-w-7xl mx-auto px-4 md:px-8 my-8">
//     <h2 className="text-2xl font-bold mb-4">Students also bought</h2>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//       {recommendedCourses.map((course) => (
//         <Card
//           key={course._id}
//           className="cursor-pointer hover:shadow-lg transition"
//           onClick={() => navigate(`/course/${course._id}`)}
//         >
//           <CardContent className="p-4">
//             <div className="aspect-video mb-2">
//               <img
//                 src={course.courseThumbnail || "https://via.placeholder.com/300"}
//                 alt={course.courseTitle}
//                 className="w-full h-full object-cover rounded"
//               />
//             </div>
//             <h3 className="text-md font-semibold">{course.courseTitle}</h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
//               {course.description.replace(/<[^>]+>/g, "").slice(0, 80)}...
//             </p>
//             <p className="text-blue-600 font-bold mt-2">
//               ₹{course.coursePrice || 0}
//             </p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default CourseDetail;

// // import React from 'react'

// // const CourseDetail = () => {
// //   return (
// //     <div>CourseDetail</div>
// //   )
// // }

// // export default CourseDetail

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import { useState } from "react";
import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetCourseDetailWithStatusQuery } from "@/feature/api/purchaseApi";

import { useGetRecommendedCoursesQuery } from "@/feature/api/recom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);

  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  const {
    data: rec,
    isLoading: recLoading,
    isError: recError,
    error: recErrorObj,
  } = useGetRecommendedCoursesQuery(courseId);

  useEffect(() => {
    if (data?.course && totalPrice === null) {
      setTotalPrice(data.course.coursePrice || 0);
    }
  }, [data, totalPrice]);

  const recommendedCourses = rec?.recommendations || [];
  console.log(rec);

  if (isLoading) return <h1 className="text-center mt-10">Loading...</h1>;
  if (isError)
    return (
      <h1 className="text-center mt-10 text-red-500">
        Failed to load course details
      </h1>
    );

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  // const handleCourseSelect = (course) => {
  //   const isSelected = selectedCourses.some((c) => c._id === course._id);

  //   if (isSelected) {
  //     // Remove course
  //     const updated = selectedCourses.filter((c) => c._id !== course._id);
  //     setSelectedCourses(updated);
  //     setTotalPrice((prev) => prev - course.coursePrice);
  //   } else {
  //     // Add course
  //     setSelectedCourses([...selectedCourses, course]);
  //     setTotalPrice((prev) => prev + course.coursePrice);
  //   }
  // };
  const handleCourseSelect = (selectedCourse) => {
    const isSelected = selectedCourses.some(
      (c) => c._id === selectedCourse._id
    );

    if (isSelected) {
      const updated = selectedCourses.filter(
        (c) => c._id !== selectedCourse._id
      );
      setSelectedCourses(updated);
      setTotalPrice((prev) => prev - selectedCourse.coursePrice);
    } else {
      setSelectedCourses([...selectedCourses, selectedCourse]);
      setTotalPrice((prev) => prev + selectedCourse.coursePrice);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1E293B] to-[#334155] text-white shadow-md">
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            {course?.courseTitle}
          </h1>
          <p className="text-lg font-light text-gray-300">{course.subTitle}</p>
          <p className="text-sm">
            Created by{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator.name}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <BadgeInfo size={16} />
              <span>Last updated {course?.createdAt.split("T")[0]}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Duration: {course?.duration || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Students enrolled: {course?.enrolledStudents.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        {/* Left Content Area */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </div>

          {/* Course Lectures */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  {lecture.isPreviewFree ? (
                    <PlayCircle size={16} className="text-green-500" />
                  ) : (
                    <Lock size={16} className="text-red-500" />
                  )}
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div>
            {recLoading ? (
              <p className="text-sm text-gray-500">
                Loading recommendations...
              </p>
            ) : recError ? (
              <p className="text-sm text-red-500">
                Failed to load recommendations
              </p>
            ) : recommendedCourses.length === 0 ? (
              <p className="text-sm text-gray-500">
                No recommended courses found.
              </p>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Students also bought
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {recommendedCourses.map((course) => {
                    const isSelected = selectedCourses.some(
                      (c) => c._id === course._id
                    );

                    return (
                      <Card
                        key={course._id}
                        className={`transition-all duration-200 border rounded-lg ${
                          isSelected ? "ring-2 ring-blue-500" : ""
                        }`}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCourseSelect(course)}
                              className="mt-1"
                            />
                            <div className="w-full">
                              <div
                                className="aspect-video cursor-pointer"
                                onClick={() =>
                                  navigate(`/course-detail/${course._id}`)
                                }
                              >
                                <img
                                  src={
                                    course.courseThumbnail ||
                                    "https://via.placeholder.com/300"
                                  }
                                  alt={course.courseTitle}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                              <h3 className="text-md font-semibold line-clamp-1 mt-2">
                                {course.courseTitle}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {course.description
                                  .replace(/<[^>]+>/g, "")
                                  .slice(0, 80)}
                                ...
                              </p>
                              <p className="text-blue-600 font-bold">
                                ₹{course.coursePrice || 0}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <Card className="shadow-lg border-none">
              <CardContent className="p-4 flex flex-col gap-4">
                {/* Video Preview */}
                <div className="w-full aspect-video rounded overflow-hidden">
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={
                      course.lectures[0]?.videoUrl ||
                      "https://www.youtube.com/watch?v=icudf_w_pqU&t=16s"
                    }
                    controls={true}
                  />
                </div>

                {/* Course Price */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Course Price</p>
                  <h2 className="text-xl font-bold text-black">
                    ₹
                    {totalPrice !== null
                      ? totalPrice
                      : course?.coursePrice || 0}
                  </h2>
                </div>

                <Separator />

                {/* Coupon Section */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Apply Coupon</h4>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <Button className="w-full bg-gray-700 hover:bg-gray-500 text-white">
                    Apply Coupon
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center p-4">
                {purchased ? (
                  <Button
                    onClick={handleContinueCourse}
                    className="w-full bg-gray-800 hover:bg-gray-600 text-white"
                  >
                    Continue Course
                  </Button>
                ) : (
                  <BuyCourseButton courseIds={[courseId, ...selectedCourses.map((c) => c._id)]} />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
