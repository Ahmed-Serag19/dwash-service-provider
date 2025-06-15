"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFileUploadDebug } from "@/hooks/useFileUploadDebug";

export const FileUploadTester = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    testWithTinyImage,
    testDifferentFormats,
    testFileSizes,
    testIndividualFiles,
  } = useFileUploadDebug();

  const runTest = async (
    testName: string,
    testFunction: () => Promise<any>
  ) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setResults(
        (prev) =>
          `${prev}\n\n=== ${testName} ===\n${JSON.stringify(result, null, 2)}`
      );
    } catch (error) {
      setResults(
        (prev) =>
          `${prev}\n\n=== ${testName} ERROR ===\n${
            error && typeof error === "object" && "message" in error
              ? (error as { message: string }).message
              : JSON.stringify(error)
          }`
      );
    }
    setLoading(false);
  };

  const testTinyImage = async () => {
    await runTest("Tiny Image Test", async () => {
      const tinyFile = await testWithTinyImage();
      return await testIndividualFiles({ brandLogo: tinyFile });
    });
  };

  const testFormats = async () => {
    if (!selectedFile) return;
    await runTest("Format Test", async () => {
      const formats = await testDifferentFormats(selectedFile);
      const results = [];
      for (const format of formats) {
        if (format.file) {
          const testResult = await testIndividualFiles({
            brandLogo: format.file,
          });
          results.push({ ...format, uploadResult: testResult });
        }
      }
      return results;
    });
  };

  const testSizes = async () => {
    if (!selectedFile) return;
    await runTest("Size Test", async () => {
      const sizes = await testFileSizes(selectedFile);
      const results = [];
      for (const size of sizes) {
        if (size.file) {
          const testResult = await testIndividualFiles({
            brandLogo: size.file,
          });
          results.push({ ...size, uploadResult: testResult });
        }
      }
      return results;
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>File Upload Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="mb-4"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600">
              Selected: {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(2)} KB, {selectedFile.type})
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={testTinyImage} disabled={loading}>
            Test Tiny Image (1x1px)
          </Button>
          <Button onClick={testFormats} disabled={loading || !selectedFile}>
            Test Different Formats
          </Button>
          <Button onClick={testSizes} disabled={loading || !selectedFile}>
            Test Different Sizes
          </Button>
          <Button onClick={() => setResults("")} variant="outline">
            Clear Results
          </Button>
        </div>

        <Textarea
          value={results}
          readOnly
          className="min-h-[400px] font-mono text-sm"
          placeholder="Test results will appear here..."
        />
      </CardContent>
    </Card>
  );
};
