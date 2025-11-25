const API_BASE = "http://localhost:4000";

async function getJWT() {
  // Step 1: Request magic link
  const magicLinkRes = await fetch(`${API_BASE}/auth/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "frontend-test@example.com" }),
  });
  const magicLink = await magicLinkRes.json();
  const token = new URL(magicLink.url).searchParams.get("token");

  // Step 2: Verify and get JWT
  const verifyRes = await fetch(`${API_BASE}/auth/magic-link/verify?token=${token}`);
  const verifyHtml = await verifyRes.text();
  const jwtMatch = verifyHtml.match(/<pre>([^<]+)<\/pre>/);
  
  if (jwtMatch) {
    const jwtToken = jwtMatch[1].trim();
    console.log("\n✅ JWT Token obtained!\n");
    console.log("=".repeat(80));
    console.log(jwtToken);
    console.log("=".repeat(80));
    console.log("\n📋 Copy the token above and paste it into the frontend form.\n");
    return jwtToken;
  } else {
    console.error("❌ Failed to extract JWT token");
    process.exit(1);
  }
}

getJWT().catch(console.error);

