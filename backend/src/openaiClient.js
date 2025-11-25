require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function generateOrderSummary({ productName, customerEmail }) {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set, returning mock summary");
    return {
      prompt: `Analyze order: ${productName} for ${customerEmail}`,
      raw: JSON.stringify({ mock: true }),
      summary: `Mock summary: Order for ${productName} received. Standard shipping recommended.`
    };
  }

  const prompt = `
Analyze this order:

- Product: ${productName}
- Email: ${customerEmail}

Return:
- Order summary
- Shipping recommendation
`;

  const body = {
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: "Return short, structured results." },
      { role: "user", content: prompt }
    ]
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      prompt,
      raw: JSON.stringify(data),
      summary: data.choices?.[0]?.message?.content || ""
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      prompt,
      raw: JSON.stringify({ error: error.message }),
      summary: `Error generating summary: ${error.message}`
    };
  }
}

module.exports = { generateOrderSummary };
