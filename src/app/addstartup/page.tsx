"use client";
import StartupForm from "@/components/forms/StartupForm";  // Import component form từ thư mục components/forms
import Title from "@/components/Title";  // Import Title component nếu cần thiết
import useProtectedRoute from "@/components/useProtectedRoute";  // Import hook useProtectedRoute từ thư mục components

export default function AddStartupPage() {
  useProtectedRoute();  // Sử dụng hook useProtectedRoute để bảo vệ trang
  return (
    <div className="p-6">
      <StartupForm type="create" /> {/* Truyền type là "create" */}
    </div>
  );
}
