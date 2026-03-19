export default async function handler(req, res) {
  const { payload, useSearch } = req.body;
  
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY, // ಕೀ ಇಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ
    "anthropic-version": "2023-06-01"
  };

  if (useSearch) headers["anthropic-beta"] = "web-search-2025-03-05";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "API Call Failed" });
  }
}
