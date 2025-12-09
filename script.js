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

    const cardHTML = `
      <div class="package-card-container ${
        isSelected ? "selected" : ""
      }" id="${slugify(pkg.name)}">
        <div class="flip-card-inner">

          <!-- FRONT -->
          <div class="package-card-front">
            <div class="info-icon"><i class="fas fa-info-circle"></i></div>

            <img src="images/${pkg.imageUrl}" class="card-image" alt="${
      pkg.name
    }">

            <div class="card-content">
              <h3>${pkg.name}</h3>
              <p class="duration">${pkg.duration}</p>

              <div class="action-buttons">
                <!-- Removed BOOK NOW button -->
                <button class="callback-btn" data-wa="${pkg.name}">
                  REQUEST A CALLBACK
                </button>
              </div>
<div class="card-footer">

  <div class="price-info">
    <span class="original-price">$${pkg.price}</span>
    <span class="offer-price">$${pkg.offerPrice}</span>
    ${pkg.sale ? `<span class="sale-tag">${pkg.sale}</span>` : ""}
  </div>

  <div class="rating" style="font-size:0.8rem; color:#FFD700; margin:4px 0;">
    ${renderStars(pkg.rating)} (${pkg.reviews || 0})
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

          <!-- BACK -->
          <div class="package-card-back">
            <h4>Package Details</h4>
            <div class="package-desc">${formatDescription(pkg.desc)}</div>
            <button class="flip-back-btn">Back</button>
          </div>

        </div>
      </div>
    `;

    packagesGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Info button click -> flip card
  document.querySelectorAll(".info-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      icon
        .closest(".package-card-container")
        .querySelector(".flip-card-inner")
        .classList.add("flipped");
    });
  });

  // Back button click -> flip back
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

// function renderPackages(packagesToDisplay) {
//   packagesGrid.innerHTML = "";

//   if (packagesToDisplay.length === 0) {
//     packagesGrid.innerHTML = `<p style="text-align:center;">No packages found.</p>`;
//     return;
//   }

//   const ownerWhatsApp = "821996489";

//   packagesToDisplay.forEach((pkg) => {
//     const isSelected = selectedPackages.some((p) => p.id === pkg.id);

//     const cardHTML = `
//       <div class="package-card-container ${
//         isSelected ? "selected" : ""
//       }" id="${slugify(pkg.name)}">
//         <div class="flip-card-inner">

//           <div class="package-card-front">
//             <div class="info-icon"><i class="fas fa-info-circle"></i></div>

//             <img src="images/${pkg.imageUrl}" class="card-image" alt="${
//       pkg.name
//     }">
//             <div class="card-content">
//               <h3>${pkg.name}</h3>
//               <p class="duration">${pkg.duration}</p>

//               <div class="action-buttons">
//                 <button class="book-now-btn">BOOK NOW</button>
//                 <button class="callback-btn" data-wa="${pkg.name}">
//                   REQUEST A CALLBACK
//                 </button>
//               </div>

//               <div class="card-footer">
//                 <div class="price-info">
//                   <span class="original-price">$${pkg.price}</span>
//                   <span class="offer-price">$${pkg.offerPrice}</span>
//                   <span class="offer-tag">OFFER!</span>
//                 </div>

//                 <button class="selection-toggle-btn ${
//                   isSelected ? "selected" : ""
//                 }" data-id="${pkg.id}">
//                   <i class="fas fa-${isSelected ? "times" : "plus"}"></i>
//                   ${isSelected ? "Remove from Selection" : "Add to Selection"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div class="package-card-back">
//             <h4>Package Details</h4>
//             <div class="package-desc">${formatDescription(pkg.desc)}</div>
//             <button class="flip-back-btn">Back</button>
//           </div>

//         </div>
//       </div>
//     `;

//     packagesGrid.insertAdjacentHTML("beforeend", cardHTML);
//   });

//   // Info button
//   document.querySelectorAll(".info-icon").forEach((icon) => {
//     icon.addEventListener("click", () => {
//       icon
//         .closest(".package-card-container")
//         .querySelector(".flip-card-inner")
//         .classList.add("flipped");
//     });
//   });

//   // Back button
//   document.querySelectorAll(".flip-back-btn").forEach((btn) => {
//     btn.addEventListener("click", () => {
//       btn
//         .closest(".package-card-container")
//         .querySelector(".flip-card-inner")
//         .classList.remove("flipped");
//     });
//   });

//   // WhatsApp callback
//   document.querySelectorAll(".callback-btn").forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const pkgName = btn.dataset.wa;
//       window.open(
//         `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(
//           "Hi, I want a callback for " + pkgName
//         )}`,
//         "_blank"
//       );
//     });
//   });

//   // Selection toggle
//   document.querySelectorAll(".selection-toggle-btn").forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const pkgId = btn.dataset.id;
//       togglePackageSelection(pkgId);
//     });
//   });
// }

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
