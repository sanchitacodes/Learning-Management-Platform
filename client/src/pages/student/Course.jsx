import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import React from "react";
import { Link } from "react-router-dom";

const Course = ({course}) => {
    const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/api/invoice/${course.userId}/${course.id}`;
    link.download = `invoice-${course.title}.pdf`;
    link.click();
  };

  return (
    <Link to={`/course-detail/${course._id}`}>
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transfor hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt="course"
          className="w-full h-36 object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate">
          {course.courseTitle}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src= {course.creator?.photoUrl || "https://github.com/shadcn.png" }/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-medium text-sm">{course.creator?.name}</h1>
        </div>
        <Badge className="bg-blue-400 text-white px-2 py-1 text-xs rounded-full">
          {course.courseLevel}
        </Badge>
        </div>
        <div className="text-lg font-bold">
          <span>Rs {course.coursePrice}</span>
        </div>
      </CardContent>
    </Card>
    {/* <button
        onClick={handleDownload}
        className="mt-2 text-sm text-blue-500 underline"
      >
        Download Invoice
      </button> */}
    </Link>
  );
};

export default Course;
