export const checkEnvironmentIssues = () => {
  const issues = [];

  // Check if using staging vs production
  const currentUrl = window.location.origin;
  const apiUrl = "https://api.stg.2025.dwash.cood2.dussur.sa";

  if (currentUrl.includes("localhost") && apiUrl.includes("stg")) {
    issues.push(
      "⚠️ Using staging API from localhost - this might have restrictions"
    );
  }

  // Check token
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    issues.push("❌ No access token found");
  } else {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;

      if (payload.exp < now) {
        issues.push("❌ Token is expired");
      } else {
        issues.push(
          `✅ Token expires at: ${new Date(
            payload.exp * 1000
          ).toLocaleString()}`
        );
      }

      if (payload.role !== "FREELANCER") {
        issues.push(`⚠️ Unexpected role: ${payload.role}`);
      }
    } catch (e) {
      issues.push("❌ Invalid token format");
    }
  }

  return issues;
};
