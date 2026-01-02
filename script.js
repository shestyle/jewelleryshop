function addItem() {
  const imageInput = document.getElementById("imageInput");
  const nameInput = document.getElementById("nameInput").value;
  const priceInput = document.getElementById("priceInput").value;
  const productList = document.getElementById("productList");

  if (!imageInput.files[0] || !nameInput || !priceInput) {
    alert("Please fill all fields");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${reader.result}">
      <h3>${nameInput}</h3>
      <p>₹${priceInput}</p>
    `;

    productList.appendChild(card);
  };

  reader.readAsDataURL(imageInput.files[0]);

  imageInput.value = "";
  document.getElementById("nameInput").value = "";
  document.getElementById("priceInput").value = "";
}
