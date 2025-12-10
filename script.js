// ---------------- GLOBAL DATA ----------------
let allPackages = [];
let selectedPackages = [];

// ---------------- DOM REFERENCES ----------------
const packagesGrid = document.getElementById("packagesGrid");
const packageSearch = document.getElementById("packageSearch");
const stickySelectionFooter = document.getElementById("stickySelectionFooter");
const selectionCount = document.getElementById("selectionCount");
const selectedItemsPreview = document.getElementById("selectedItemsPreview");
const shareBtnFooter = document.getElementById("shareBtnFooter");
const selectedStack = document.getElementById("selectedStack");
const selectedPopup = document.getElementById("selectedPopup");
const popupList = document.getElementById("popupList");
const closePopup = document.getElementById("closePopup");

let currentPage = 1;
const itemsPerPage = 6;

// ---------------- HELPERS ----------------
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function formatDescription(desc) {
  if (!desc) return "No description available.";
  return desc;
}

// ---------------- RENDER PACKAGES ----------------
function renderPackages(packagesToDisplay) {
  packagesGrid.innerHTML = "";

  if (packagesToDisplay.length === 0) {
    packagesGrid.innerHTML = `<p style="text-align:center;">No packages found.</p>`;
    return;
  }

  const ownerWhatsApp = "821996489";

  packagesToDisplay.forEach((pkg) => {
    const isSelected = selectedPackages.some((p) => p.id === pkg.id);

    //     const cardHTML = `
    //       <div class="package-card-container ${
    //         isSelected ? "selected" : ""
    //       }" id="${slugify(pkg.name)}">
    //         <div class="flip-card-inner">

    //           <!-- FRONT -->
    //           <div class="package-card-front">
    //           <div class="info-icon tooltip">
    //   <i class="fas fa-info-circle"></i>
    //   <span class="tooltip-text">Click for package info</span>
    // </div>

    //             <img src="images/${pkg.imageUrl}" class="card-image" alt="${
    //       pkg.name
    //     }">

    //             <div class="card-content">
    //               <h3>${pkg.name}</h3>
    //               <p class="duration">${pkg.duration}</p>

    //               <div class="action-buttons">
    //                 <!-- Removed BOOK NOW button -->
    //                 <button class="callback-btn" data-wa="${pkg.name}">
    //                   REQUEST A CALLBACK
    //                 </button>
    //               </div>
    // <div class="card-footer">

    //   <div class="price-info">
    //     <span class="original-price">$${pkg.price}</span>
    //     <span class="offer-price">$${pkg.offerPrice}</span>
    //     ${pkg.sale ? `<span class="sale-tag">${pkg.sale}</span>` : ""}
    //   </div>

    //   <button class="selection-toggle-btn ${
    //     isSelected ? "selected" : ""
    //   }" data-id="${pkg.id}">
    //     <i class="fas fa-${isSelected ? "times" : "plus"}"></i>
    //     ${isSelected ? "Remove from Selection" : "Add to Selection"}
    //   </button>

    // </div>

    //             </div>
    //           </div>

    //           <!-- BACK -->
    //           <div class="package-card-back">
    //             <h4>Package Details</h4>
    //             <div class="package-desc">${formatDescription(pkg.desc)}</div>
    //             <button class="flip-back-btn">Back</button>
    //           </div>

    //         </div>
    //       </div>
    //     `;
    const cardHTML = `
  <div class="package-card-container">

    <div class="flip-card-inner">

      <!-- Front Side -->
      <div class="package-card package-card-front">
        <div class="save-tag">
          SAVE INR ${pkg.price - pkg.offerPrice}
        </div>

        <div class="card-img-container">
          <img src="images/${pkg.imageUrl}" class="card-img" alt="${pkg.name}">
          <div class="info-icon tooltip">
            <i class="fas fa-info-circle"></i>
            <span class="tooltip-text">Click for package info</span>
          </div>
        </div>

        <div class="card-body">
          <p class="duration">${pkg.duration}</p>

          <div class="rating-row">
            <span class="rating">⭐ ${pkg.rating}</span>
            <span class="rating-count">(${pkg.ratingCount})</span>
          </div>

          <h3 class="pkg-title">${pkg.name}</h3>

          <div class="location-row">
            <span>${pkg.location1}</span> • 
            <span>${pkg.location2}</span>
          </div>

          ${pkg.sale ? `<div class="sale-banner">${pkg.sale}</div>` : ""}

          <div class="price-row">
            <span class="old-price">INR ${pkg.price.toLocaleString()}</span>
            <span class="discount-tag">SAVE INR ${(
              pkg.price - pkg.offerPrice
            ).toLocaleString()}</span>
          </div>

          <div class="new-price">
            INR ${pkg.offerPrice.toLocaleString()} <span class="adult">/Adult</span>
          </div>

          <button class="callback-btn" data-wa="${pkg.name}">
            Request Callback
          </button>

          <div class="card-footer">
            <div class="price-info">
              <span class="original-price">$${pkg.price}</span>
              <span class="offer-price">$${pkg.offerPrice}</span>
              <span class="offer-tag">OFFER!</span>
            </div>

            <button class="selection-toggle-btn ${
              isSelected ? "selected" : ""
            }" data-id="${pkg.id}">
              <i class="fas fa-${isSelected ? "times" : "plus"}"></i>
              ${isSelected ? "Remove from Selection" : "Add to Selection"}
            </button>
          </div>
        </div>
      </div>

      <!-- Back Side -->
      <div class="package-card package-card-back">
        <div class="package-desc">
          <p>${pkg.desc || "Package details will appear here."}</p>
        </div>
        <button class="flip-back-btn">Back</button>
      </div>

    </div>
  </div>
`;

    packagesGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  document.querySelectorAll(".info-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      icon
        .closest(".package-card-container")
        .querySelector(".flip-card-inner")
        .classList.add("flipped");
    });
  });

  document.querySelectorAll(".flip-back-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn
        .closest(".package-card-container")
        .querySelector(".flip-card-inner")
        .classList.remove("flipped");
    });
  });

  // WhatsApp callback
  document.querySelectorAll(".callback-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pkgName = btn.dataset.wa;
      window.open(
        `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(
          "Hi, I want a callback for " + pkgName
        )}`,
        "_blank"
      );
    });
  });

  // Selection toggle
  document.querySelectorAll(".selection-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      togglePackageSelection(btn.dataset.id);
    });
  });
}

// ---------------- SEARCH, PAGINATION, SELECTION ----------------
function getFilteredPackages(term) {
  if (!term) return allPackages;
  return allPackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(term.toLowerCase())
  );
}

function getPagedPackages() {
  const filtered = getFilteredPackages(packageSearch.value);
  const start = (currentPage - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
}

function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) {
    pagination.style.display = "none";
    return;
  }

  pagination.style.display = "flex";

  pagination.innerHTML += `
    <button class="page-btn" ${
      currentPage === 1 ? "disabled" : ""
    } data-page="${currentPage - 1}">Prev</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button class="page-btn ${
        currentPage === i ? "active" : ""
      }" data-page="${i}">${i}</button>
    `;
  }

  pagination.innerHTML += `
    <button class="page-btn" ${
      currentPage === totalPages ? "disabled" : ""
    } data-page="${currentPage + 1}">Next</button>
  `;
}

function togglePackageSelection(id) {
  const pkg = allPackages.find((p) => p.id === id);
  if (!pkg) return;

  const index = selectedPackages.findIndex((p) => p.id === id);

  if (index === -1) selectedPackages.push(pkg);
  else selectedPackages.splice(index, 1);

  updateSelectionUI();
  renderPackages(getPagedPackages());
  renderPagination(getFilteredPackages(packageSearch.value).length);
}
function updateSelectionUI() {
  const count = selectedPackages.length;

  // Update footer
  selectionCount.textContent = count;
  if (count > 0) {
    stickySelectionFooter.classList.remove("hidden");
    shareBtnFooter.disabled = false;
  } else {
    stickySelectionFooter.classList.add("hidden");
    shareBtnFooter.disabled = true;
  }

  // Render selected items preview (footer)
  selectedItemsPreview.innerHTML = "";
  selectedPackages.forEach((pkg) => {
    selectedItemsPreview.insertAdjacentHTML(
      "beforeend",
      `<div class="preview-item" data-id="${pkg.id}">
        <img src="images/${pkg.imageUrl}" alt="${pkg.name}" class="preview-img">
        <span class="remove-icon" data-id="${pkg.id}">&times;</span>
      </div>`
    );
  });

  // Render selected stack
  selectedStack.innerHTML = "";
  if (count === 0) {
    selectedStack.classList.add("hidden");
  } else {
    selectedStack.classList.remove("hidden");

    selectedPackages.forEach((pkg) => {
      selectedStack.insertAdjacentHTML(
        "beforeend",
        `<div class="stack-card" data-id="${pkg.id}">
          <img src="images/${pkg.imageUrl}" alt="${pkg.name}" class="stack-card-img">
          <div class="stack-card-info">
            <p class="stack-card-name">${pkg.name}</p>
            <p class="stack-card-duration">${pkg.duration}</p>
          </div>
          <span class="stack-card-remove" data-id="${pkg.id}">&times;</span>
        </div>`
      );
    });
  }

  // Remove from stack
  selectedStack.querySelectorAll(".stack-card-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      togglePackageSelection(btn.dataset.id);
    });
  });
}

// function updateSelectionUI() {
//   // Footer
//   const count = selectedPackages.length;
//   selectionCount.textContent = count;

//   if (count > 0) {
//     stickySelectionFooter.classList.remove("hidden");
//     shareBtnFooter.disabled = false;
//   } else {
//     stickySelectionFooter.classList.add("hidden");
//     shareBtnFooter.disabled = true;
//   }

//   selectedItemsPreview.innerHTML = "";
//   selectedPackages.forEach((pkg) => {
//     selectedItemsPreview.insertAdjacentHTML(
//       "beforeend",
//       `<div class="preview-item" data-id="${pkg.id}">
//         <img src="images/${pkg.imageUrl}" alt="${pkg.name}" class="preview-img">
//         <span class="remove-icon" data-id="${pkg.id}">&times;</span>
//       </div>`
//     );
//   });
// }

// ---------------- EVENT LISTENERS ----------------
packageSearch.addEventListener("input", () => {
  currentPage = 1;
  renderPackages(getPagedPackages());
  renderPagination(getFilteredPackages(packageSearch.value).length);
});

selectedItemsPreview.addEventListener("click", (e) => {
  const remove = e.target.closest(".remove-icon");
  if (!remove) return;
  togglePackageSelection(remove.dataset.id);
});

document.getElementById("pagination")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".page-btn");
  if (!btn) return;
  const page = Number(btn.dataset.page);
  if (!page || page < 1) return;

  currentPage = page;
  renderPackages(getPagedPackages());
  renderPagination(getFilteredPackages(packageSearch.value).length);
});

// WhatsApp share footer
shareBtnFooter.addEventListener("click", () => {
  if (selectedPackages.length === 0) return;

  const baseUrl = "https://afrazsheikh.github.io/mmholidays/";
  const message = selectedPackages
    .map((pkg) => `${baseUrl}#${slugify(pkg.name)} (${pkg.name})`)
    .join("\n");

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
});

// ---------------- INITIAL FETCH ----------------
document.addEventListener("DOMContentLoaded", () => {
  fetch("./packages.json")
    .then((res) => res.json())
    .then((data) => {
      allPackages = data.packages;

      renderPackages(getPagedPackages());
      renderPagination(allPackages.length);

      const descBox = document.getElementById("desc-box");
      if (descBox) {
        descBox.innerHTML =
          allPackages[0].descFormatted || allPackages[0].desc || "";
      }
    })
    .catch((err) => console.error("Error loading JSON:", err));
});
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let html = "";
  for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star"></i>';
  if (halfStar) html += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < emptyStars; i++) html += '<i class="far fa-star"></i>';

  return html;
}
// function autoShowTooltips() {
//   let showIndex = 0;

//   setInterval(() => {
//     // Re-scan tooltips every cycle (because packages re-render)
//     const tooltips = document.querySelectorAll(".tooltip .tooltip-text");
//     if (tooltips.length === 0) return;

//     // Hide all tooltips first
//     tooltips.forEach((t) => {
//       t.style.visibility = "hidden";
//       t.style.opacity = "0";
//     });

//     // Show next tooltip
//     const tooltip = tooltips[showIndex];
//     tooltip.style.visibility = "visible";
//     tooltip.style.opacity = "1";

//     // Hide after 2 seconds
//     setTimeout(() => {
//       tooltip.style.visibility = "hidden";
//       tooltip.style.opacity = "0";
//     }, 2000);

//     // Move to next tooltip index
//     showIndex = (showIndex + 1) % tooltips.length;
//   }, 5000); // repeat every 5 seconds
// }

// // run AFTER your initial render
// document.addEventListener("DOMContentLoaded", () => {
//   autoShowTooltips();
// });
function autoShowTooltips() {
  setInterval(() => {
    // Get fresh tooltips every cycle (because cards re-render)
    const tooltips = document.querySelectorAll(".tooltip .tooltip-text");
    if (tooltips.length === 0) return;

    // Show all tooltips
    tooltips.forEach((t) => {
      t.style.visibility = "visible";
      t.style.opacity = "1";
    });

    // Hide after 2 seconds
    setTimeout(() => {
      tooltips.forEach((t) => {
        t.style.visibility = "hidden";
        t.style.opacity = "0";
      });
    }, 2000);
  }, 5000); // every 5 seconds
}
document.addEventListener("DOMContentLoaded", () => {
  autoShowTooltips();
});
