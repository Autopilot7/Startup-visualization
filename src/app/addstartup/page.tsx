import StartupForm from "@/components/forms/StartupForm";  // Import component form từ thư mục components/forms
import Title from "@/components/Title";  // Import Title component nếu cần thiết

export default function AddStartupPage() {
  return (
    <div className="p-6">
      <StartupForm type="create" /> {/* Truyền type là "create" */}
    </div>
  );
}
