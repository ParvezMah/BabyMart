// import { zodResolver } from "@hookform/resolvers/zod";
// import { AxiosError } from "axios";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import type z from "zod";

// import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
// import type { User } from "@/lib/type";
// import { userSchema } from "@/lib/validation";
// import useAuthStore from "@/store/useAuthStore";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import ImageUpload from "@/components/ui/image.upload";
// import { Input } from "@/components/ui/input";
// import { Loader2 } from "lucide-react";

// type FormData = z.infer<typeof userSchema>;

// const Account = () => {
//   const axiosPrivate = useAxiosPrivate();
//   const { user } = useAuthStore();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [profile, setProfile] = useState<User | null>(null);

//   const form = useForm<FormData>({
//     resolver: zodResolver(userSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       role: "user",
//       avatar: "",
//     },
//   });

//   const fetchProfile = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosPrivate.get("/users/me");
//       const data: User = res.data;

//       setProfile(data);

//       form.reset({
//         name: data.name,
//         email: data.email,
//         role: data.role,
//         avatar: data.avatar || "",
//         password: "",
//       });
//     } catch (error) {
//       console.log("Failed to load profile", error);
//       toast.error("Failed to load account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const onSubmit = async (data: FormData) => {
//     setSaving(true);
//     try {
//       await axiosPrivate.put("/users/me", data);

//       toast.success("Account updated successfully");
//       fetchProfile();
//     } catch (error: unknown) {
//       console.log("Update failed", error);

//       let message = "Failed to update account";

//       if (error instanceof AxiosError && error.response?.data?.message) {
//         message = error.response.data.message;
//       }

//       toast.error(message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="h-40 w-full bg-muted animate-pulse rounded-lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-5 max-w-3xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">My Account</h1>
//           <p className="text-muted-foreground text-sm">
//             Manage your profile information
//           </p>
//         </div>

//         <Badge className="capitalize">
//           {profile?.role || user?.role}
//         </Badge>
//       </div>

//       {/* Profile Card */}
//       <Card className="shadow-sm">
//         <CardHeader>
//           <CardTitle>Profile Information</CardTitle>
//           <CardDescription>
//             Update your personal details and avatar
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

//               {/* Avatar */}
//               <FormField
//                 control={form.control}
//                 name="avatar"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Avatar</FormLabel>
//                     <FormControl>
//                       <ImageUpload
//                         value={field.value || ""}
//                         onChange={field.onChange}
//                         disabled={saving}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Name */}
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                       <Input {...field} disabled={saving} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Email */}
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input type="email" {...field} disabled={saving} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Password */}
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password (optional)</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder="Leave blank to keep current password"
//                         {...field}
//                         disabled={saving}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Role (readonly) */}
//               <FormField
//                 control={form.control}
//                 name="role"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Role</FormLabel>
//                     <FormControl>
//                       <Input {...field} disabled className="bg-muted" />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               {/* Submit */}
//               <Button type="submit" className="w-full" disabled={saving}>
//                 {saving ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   "Update Account"
//                 )}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Account;



















import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { User } from "@/lib/type";
import { userSchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStore";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image.upload";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type FormData = z.infer<typeof userSchema>;

const Account = () => {
  const axiosPrivate = useAxiosPrivate();

  const { user } = useAuthStore(); // 🔥 MUST contain logged-in user with _id

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      avatar: "",
    },
  });

  // =========================
  // FETCH PROFILE BY ID
  // =========================
  const fetchProfile = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/users/${user._id}`);
      const data: User = res.data;

      setProfile(data);

      form.reset({
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar || "",
        password: "",
      });
    } catch (error) {
      console.log("Failed to load profile", error);
      toast.error("Failed to load account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?._id]);

  // =========================
  // UPDATE PROFILE
  // =========================
  const onSubmit = async (data: FormData) => {
    if (!user?._id) return;

    setSaving(true);
    try {
      await axiosPrivate.put(`/users/${user._id}`, data);

      toast.success("Account updated successfully");
      fetchProfile();
    } catch (error: unknown) {
      console.log("Update failed", error);

      let message = "Failed to update account";

      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="p-6">
        <div className="h-40 w-full bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-5 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground text-sm">
            Manage your profile information
          </p>
        </div>

        <Badge className="capitalize">
          {profile?.role}
        </Badge>
      </div>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your details</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Avatar */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={saving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (optional)</FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Leave blank"
                          {...field}
                          disabled={saving}
                          className="pr-10"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff/> : <Eye/>}
                        </button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role (readonly) */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Account"
                )}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;