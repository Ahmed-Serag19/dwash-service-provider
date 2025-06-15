import { FileUploadTester } from "@/components/edit-profile/FileUploadTester";
import { EnvironmentChecker } from "@/components/edit-profile/EnvironmentChecker";

export default function DebugPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">File Upload Debug Tools</h1>
      <EnvironmentChecker />
      <FileUploadTester />
    </div>
  );
}
