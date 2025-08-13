import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { DialogDescription } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoadUserQuery, useUpdateUserMutation } from "@/feature/api/authApi";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const { data, isLoading, refetch } = useLoadUserQuery();
  // const user = data && data.user;

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  //   if (isLoading || !data || !data.user) {
  //   return <h1>Profile Loading...</h1>;
  // }

  // if (isError || !data || !data.user)
  //   return <h1>Something went wrong loading your profile.</h1>;

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error.message || "Failed to update profile.");
    }
  }, [error, updateUserData, isSuccess, isError]);

  if (isLoading) return <h1>Profile Loading...</h1>;

  const user = data && data.user;
  useEffect(() => {
    console.log("User data:", data); // <-- Add this
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto px-4 my-12">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={isLoading} onClick={updateUserHandler}>
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourse.length === 0 ? (
            <h1>You haven't enrolled yet</h1>
          ) : (
            // user?.enrolledCourse.map((course) => (
            //   <Course course={course} key={course._id} />
            // ))
            user?.enrolledCourse.map((course) => {
              console.log(course); // <- check what data is actually present
              return (
                <div key={course._id} className="border p-4 rounded shadow">
                  <Course course={course} />

                  {/* Download Invoice Button */}
                  <Button
                    variant="outline"
                    className="mt-2 text-sm"
                    onClick={async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/invoice/${user._id}/${course._id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch invoice");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${course.courseTitle}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    toast.error("Unable to download invoice.");
    console.error(err);
  }
}}
                  >
                    Download Invoice
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
