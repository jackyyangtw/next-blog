const [deploymentUrl, expectedSha] = process.argv.slice(2);

if (!deploymentUrl || !expectedSha) {
  throw new Error("Usage: verify-deployment-sha.mjs <deployment-url> <sha>");
}

const healthUrl = new URL("/api/healthz", deploymentUrl);
const attempts = 30;
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  let response;
  try {
    response = await fetch(healthUrl, {
      headers: bypassSecret
        ? { "x-vercel-protection-bypass": bypassSecret }
        : undefined,
    });
  } catch (error) {
    if (attempt === attempts) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    continue;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Deployment health check returned HTTP ${response.status} (${contentType || "no content type"}) instead of JSON. If Vercel Deployment Protection is enabled, configure VERCEL_AUTOMATION_BYPASS_SECRET in the Vercel project and GitHub Actions secrets.`,
    );
  }

  const body = await response.json();
  if (response.ok && body.commitSha === expectedSha) {
    console.log(`Verified deployment commit ${expectedSha}`);
    process.exit(0);
  }

  await new Promise((resolve) => setTimeout(resolve, 5_000));
}

throw new Error(
  `Deployment ${healthUrl.origin} did not report commit ${expectedSha}`,
);
