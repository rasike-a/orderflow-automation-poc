const API = "http://localhost:4000";

document.getElementById("go").onclick = async () => {
  const token = document.getElementById("token").value;
  const customerEmail = document.getElementById("email").value;
  const productName = document.getElementById("product").value;

  const r = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ customerEmail, productName })
  });

  const data = await r.json();
  document.getElementById("out").textContent = JSON.stringify(data, null, 2);
};
