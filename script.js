// ---------------- MOCK DATA ----------------
const allPackages = [
  {
    id: "1",
    name: "Goa Beach Bliss",
    price: 2500,
    offerPrice: 1800,
    duration: "7 Days / 6 Nights",
    imageUrl: "beach.jpg",
  },
  {
    id: "2",
    name: "Ranthambore Jungle Safari",
    price: 3000,
    offerPrice: 2200,
    duration: "5 Days / 4 Nights",
    imageUrl: "beach.jpg",
  },
  {
    id: "3",
    name: "Himalayan Hiking Adventure",
    price: 4000,
    offerPrice: 3200,
    duration: "10 Days / 9 Nights",
    imageUrl: "beach.jpg",
  },
  {
    id: "4",
    name: "Desert Hot Air Balloon",
    price: 2000,
    offerPrice: 1500,
    duration: "3 Days / 2 Nights",
    imageUrl: "beach.jpg",
  },
  {
    id: "5",
    name: "European City Tour",
    price: 6000,
    offerPrice: 5000,
    duration: "14 Days / 13 Nights",
    imageUrl: "beach.jpg",
  },
  {
    id: "6",
    name: "Kerala Backwaters",
    price: 3500,
    offerPrice: 2800,
    duration: "6 Days / 5 Nights",
    imageUrl: "beach.jpg",
  },
  {
    id: "7",
    name: "Andaman Scuba Diving",
    price: 4500,
    offerPrice: 3900,
    duration: "8 Days / 7 Nights",
    imageUrl: "beach.jpg",
  },
  {
    id: "8",
    name: "Jaipur Heritage Tour",
    price: 1500,
    offerPrice: 1200,
    duration: "4 Days / 3 Nights",
    imageUrl: "beach.jpg",
  },
];

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

// ---------------- CORE FUNCTIONS ----------------

// Render packages on screen
// function renderPackages(packagesToDisplay) {
//   packagesGrid.innerHTML = "";

//   if (packagesToDisplay.length === 0) {
//     packagesGrid.innerHTML = `<p style="text-align:center;">No packages found.</p>`;
//     return;
//   }

//   packagesToDisplay.forEach((pkg) => {
//     const isSelected = selectedPackages.some((p) => p.id === pkg.id);

//     const cardHTML = `
//       <div class="package-card ${isSelected ? "selected" : ""}" data-id="${
//       pkg.id
//     }">
//         <img src="images/${pkg.imageUrl}" class="card-image">

//         ${
//           isSelected
//             ? '<span class="selection-checkmark"><i class="fas fa-check"></i></span>'
//             : ""
//         }

//         <div class="card-content">
//           <h3>${pkg.name}</h3>
//           <p class="duration">${pkg.duration}</p>

//           <div class="action-buttons">
//             <button class="book-now-btn">BOOK NOW</button>
//             <button class="callback-btn">REQUEST A CALLBACK</button>
//           </div>

//           <div class="card-footer">
//             <div class="price-info">
//               <span class="original-price">$${pkg.price}</span>
//               <span class="offer-price">$${pkg.offerPrice}</span>
//               <span class="offer-tag">OFFER!</span>
//             </div>

//             <button class="selection-toggle-btn ${
//               isSelected ? "selected" : ""
//             }" data-action="${isSelected ? "remove" : "add"}">
//               <i class="fas fa-${isSelected ? "times" : "plus"}"></i>
//               ${isSelected ? "Remove from Selection" : "Add to Selection"}
//             </button>
//           </div>
//         </div>
//       </div>
//     `;

//     packagesGrid.insertAdjacentHTML("beforeend", cardHTML);
//   });
// }
// Function to slugify package name (URL safe)
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/[^\w\-]+/g, "") // remove non-word chars
    .replace(/\-\-+/g, "-"); // collapse multiple hyphens
}

function renderPackages(packagesToDisplay) {
  packagesGrid.innerHTML = "";

  if (packagesToDisplay.length === 0) {
    packagesGrid.innerHTML = `<p style="text-align:center;">No packages found.</p>`;
    return;
  }

  packagesToDisplay.forEach((pkg) => {
    const isSelected = selectedPackages.some((p) => p.id === pkg.id);
    const packageSlug = slugify(pkg.name);

    const cardHTML = `
      <div class="package-card ${isSelected ? "selected" : ""}" 
           data-id="${pkg.id}" 
           id="${packageSlug}">
        <img src="images/${pkg.imageUrl}" class="card-image" alt="${pkg.name}">
        ${
          isSelected
            ? '<span class="selection-checkmark"><i class="fas fa-check"></i></span>'
            : ""
        }
        <div class="card-content">
          <h3>${pkg.name}</h3>
          <p class="duration">${pkg.duration}</p>
          <div class="action-buttons">
            <button class="book-now-btn">BOOK NOW</button>
            <button class="callback-btn">REQUEST A CALLBACK</button>
          </div>
          <div class="card-footer">
            <div class="price-info">
              <span class="original-price">$${pkg.price}</span>
              <span class="offer-price">$${pkg.offerPrice}</span>
              <span class="offer-tag">OFFER!</span>
            </div>
            <button class="selection-toggle-btn ${
              isSelected ? "selected" : ""
            }" data-action="${isSelected ? "remove" : "add"}">
              <i class="fas fa-${isSelected ? "times" : "plus"}"></i>
              ${isSelected ? "Remove from Selection" : "Add to Selection"}
            </button>
          </div>
        </div>
      </div>
    `;

    packagesGrid.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// Render footer preview
function renderFooterPreview() {
  selectedItemsPreview.innerHTML = "";

  selectedPackages.forEach((pkg) => {
    selectedItemsPreview.insertAdjacentHTML(
      "beforeend",
      `
      <div class="preview-item" data-id="${pkg.id}">
        <img src="images/${pkg.imageUrl}" alt="${pkg.name}" class="preview-img">
        <span class="remove-icon" data-id="${pkg.id}">&times;</span>
      </div>
      `
    );
  });
}

// Update selection UI (stack + footer)
function updateSelectionUI() {
  const count = selectedPackages.length;
  selectionCount.textContent = count;

  // Sticky footer
  if (count > 0) {
    stickySelectionFooter.classList.remove("hidden");
    shareBtnFooter.disabled = false;
  } else {
    stickySelectionFooter.classList.add("hidden");
    shareBtnFooter.disabled = true;
  }

  renderFooterPreview();

  // ---- STACK ----
  // ---- STACK ----
  selectedStack.innerHTML = "";
  if (count === 0) {
    selectedStack.classList.add("hidden");
  } else {
    selectedStack.classList.remove("hidden");

    selectedPackages.forEach((pkg) => {
      selectedStack.insertAdjacentHTML(
        "beforeend",
        `
      <div class="stack-card" data-id="${pkg.id}">
        <img src="images/${pkg.imageUrl}" alt="${pkg.name}" class="stack-card-img">
        <div class="stack-card-info">
          <p class="stack-card-name">${pkg.name}</p>
          <p class="stack-card-duration">${pkg.duration}</p>
        </div>
        <span class="stack-card-remove" data-id="${pkg.id}">&times;</span>
      </div>
      `
      );
    });
  }
}

selectedStack.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".stack-card-remove");
  if (!removeBtn) return;

  togglePackageSelection(removeBtn.dataset.id);
});

// Popup list rendering
function renderPopupList() {
  popupList.innerHTML = "";

  selectedPackages.forEach((pkg) => {
    popupList.insertAdjacentHTML(
      "beforeend",
      `
      <div class="popup-card">
        <img src="images/${pkg.imageUrl}">
        <div>
          <h4>${pkg.name}</h4>
          <p>${pkg.duration}</p>
        </div>
        <button class="remove-btn" data-id="${pkg.id}">X</button>
      </div>
      `
    );
  });
}

// Toggle selection
function togglePackageSelection(packageId) {
  const pkg = allPackages.find((p) => p.id === packageId);
  if (!pkg) return;

  const index = selectedPackages.findIndex((p) => p.id === packageId);

  if (index === -1) {
    selectedPackages.push(pkg);
  } else {
    selectedPackages.splice(index, 1);
  }

  const filtered = getFilteredPackages(packageSearch.value);

  renderPackages(getPagedPackages());
  renderPagination(filtered.length);
  updateSelectionUI();
}

function getFilteredPackages(term) {
  if (!term) return allPackages;
  return allPackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(term.toLowerCase())
  );
}

// Pagination helpers
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

// ---------------- EVENT LISTENERS ----------------

// Add/remove selection
packagesGrid.addEventListener("click", (event) => {
  const toggleBtn = event.target.closest(".selection-toggle-btn");
  if (!toggleBtn) return;

  const card = toggleBtn.closest(".package-card");
  togglePackageSelection(card.dataset.id);
});

// Footer remove
selectedItemsPreview.addEventListener("click", (event) => {
  const removeIcon = event.target.closest(".remove-icon");
  if (!removeIcon) return;

  togglePackageSelection(removeIcon.dataset.id);
});

// Search
packageSearch.addEventListener("input", () => {
  currentPage = 1;

  const filtered = getFilteredPackages(packageSearch.value);

  renderPackages(filtered.slice(0, itemsPerPage));
  renderPagination(filtered.length);
});

// ---------------- INITIAL LOAD ----------------
document.addEventListener("DOMContentLoaded", () => {
  renderPackages(getPagedPackages());
  renderPagination(allPackages.length);
  updateSelectionUI();
});
// Pagination click handler (attach once)
const paginationEl = document.getElementById("pagination");
if (paginationEl) {
  paginationEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".page-btn");
    if (!btn) return;

    const page = Number(btn.dataset.page);
    // ignore invalid pages
    if (!page || page < 1) return;

    currentPage = page;

    // render items for the selected page
    renderPackages(getPagedPackages());

    // update the pagination buttons based on filtered count
    renderPagination(getFilteredPackages(packageSearch.value).length);

    // keep footer/stack state consistent (not strictly required here but good)
    updateSelectionUI();
  });
}

// share to whats app
shareBtnFooter.addEventListener("click", () => {
  if (selectedPackages.length === 0) return;

  const baseUrl = "https://afrazsheikh.github.io/mmholidays/";

  const packageLinks = selectedPackages.map((pkg) => {
    const slug = slugify(pkg.name);
    return `${baseUrl}#${slug} (${pkg.name})`;
  });

  const message = `Check out these holiday packages:\n${packageLinks.join(
    "\n"
  )}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
});
// Smooth scroll + highlight if URL has hash
document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash;
  if (hash) {
    const targetCard = document.querySelector(hash);
    if (targetCard) {
      // Scroll smoothly
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add highlight
      targetCard.classList.add("highlighted");

      // Remove highlight after 3 seconds
      setTimeout(() => {
        targetCard.classList.remove("highlighted");
      }, 3000);
    }
  }
});
