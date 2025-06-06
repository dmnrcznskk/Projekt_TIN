document.addEventListener("DOMContentLoaded", () => {
  console.log("Litter loader start");

  const params = new URLSearchParams(window.location.search);
  const litterName = params.get("name");

  console.log("Parsed litter name from URL:", litterName);

  if (!litterName) {
    console.warn("No litter name provided in query params.");
    return;
  }

  fetch(`/api/miot?name=${encodeURIComponent(litterName)}`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch litter data (${res.status})`);
      return res.json();
    })
    .then(data => {
      console.log("Litter data received:", data);

      const title = document.getElementById("litter-title");
      const container = document.getElementById("litter-container");

      if (!title || !container) {
        console.warn("Missing #litter-title or #litter-container in HTML.");
        return;
      }

      title.textContent = `Miot ${litterName}`;

      data.forEach(kitten => {
        const kittenSection = document.createElement("section");
        kittenSection.classList.add("mb-5");

        const kittenHeader = document.createElement("h2");
        kittenHeader.textContent = kitten.name;
        kittenHeader.classList.add("text-center", "fw-bold", "text-mocha", "mb-4");

        const imgRow = document.createElement("div");
        imgRow.classList.add("row", "justify-content-center", "g-4");

        kitten.images.forEach(src => {
          const col = document.createElement("div");
          col.classList.add("col-sm-6", "col-md-4", "col-lg-3", "text-center");

          const img = document.createElement("img");
          img.src = src;
          img.alt = `${kitten.name}`;
          img.classList.add("img-fluid", "rounded", "shadow");

          col.appendChild(img);
          imgRow.appendChild(col);
        });

        kittenSection.appendChild(kittenHeader);
        kittenSection.appendChild(imgRow);
        container.appendChild(kittenSection);
      });
    })
    .catch(err => {
      console.error("Error loading litter data:", err);
    });
});
