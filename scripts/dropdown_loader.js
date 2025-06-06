fetch("/api/mioty")
  .then(res => res.json())
  .then(litters => {
    const dropdown = document.getElementById("mioty-dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = "";

    litters.forEach(litter => {
      const link = `miot_template.html?name=${encodeURIComponent(litter)}`;
      const li = document.createElement("li");
      li.innerHTML = `<a class="dropdown-item" href="${link}">${litter}</a>`;
      dropdown.appendChild(li);
    });
  })
  .catch(err => console.error("Błąd ładowania miotów:", err));