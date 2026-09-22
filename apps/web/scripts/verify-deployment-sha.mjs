const [deploymentUrl, expectedSha] = process.argv.slice(2);

if (!deploymentUrl || !expectedSha) {
  throw new Error("Usage: verify-deployment-sha.mjs <deployment-url> <sha>");
}

const healthUrl = new URL("/api/healthz", deploymentUrl);
const attempts = 30;

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const response = await fetch(healthUrl);
    const body = await response.json();

    if (response.ok && body.commitSha === expectedSha) {
      console.log(`Verified deployment commit ${expectedSha}`);
      process.exit(0);
    }
  } catch (error) {
    if (attempt === attempts) {
      throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 5_000));
}

throw new Error(
  `Deployment ${healthUrl.origin} did not report commit ${expectedSha}`,
);
