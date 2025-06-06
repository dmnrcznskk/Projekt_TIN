fetch("/api/mioty")
  .then(res => res.json())
  .then(mioty => {
    const dropdown = document.getElementById("mioty-dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = ""; // wyczyść statyczne wpisy, jeśli były

    mioty.forEach(miot => {
      const link = `miot_${miot.toLowerCase().replace(/\s+/g, "_")}.html`;
      const li = document.createElement("li");
      li.innerHTML = `<a class="dropdown-item" href="${link}">${miot}</a>`;
      dropdown.appendChild(li);
    });
  })
  .catch(err => console.error("Błąd ładowania miotów:", err));
