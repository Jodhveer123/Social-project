// Load resources from localStorage or default
let resources = JSON.parse(localStorage.getItem("resources")) || [];

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const resourceList = document.getElementById("resourceList");
const addResourceForm = document.getElementById("addResourceForm");

// Modal elements
const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editResourceForm = document.getElementById("editResourceForm");
const editName = document.getElementById("editName");
const editType = document.getElementById("editType");
const editContact = document.getElementById("editContact");
const editLocation = document.getElementById("editLocation");
const editImage = document.getElementById("editImage");

let editIndex = null;

// Save to localStorage
function saveResources() {
  localStorage.setItem("resources", JSON.stringify(resources));
}

// Display resources
function displayResources(data) {
  resourceList.innerHTML = "";
  if (data.length === 0) {
    resourceList.innerHTML = "<p>No resources found.</p>";
    return;
  }

  data.forEach((res, index) => {
    const card = document.createElement("div");
    card.classList.add("resource-card");

    let imageTag = "";
    if (res.image) imageTag = `<img src="${res.image}" alt="Resource Image">`;

    card.innerHTML = `
      ${imageTag}
      <h3>${res.name}</h3>
      <p>Type: ${res.type}</p>
      <p>Contact: ${res.contact}</p>
      <p>Location: <a href="${res.location}" target="_blank" style="color:#00ffff;">${res.location}</a></p>
      <div class="card-buttons">
        <button onclick="editResource(${index})">✏️ Edit</button>
        <button onclick="deleteResource(${index})">🗑️ Delete</button>
      </div>
    `;
    resourceList.appendChild(card);
  });
}

// Initial display
displayResources(resources);

// Search + Filter
function filterResources() {
  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;

  const filtered = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchValue);
    const matchesFilter = filterValue === "all" || res.type === filterValue;
    return matchesSearch && matchesFilter;
  });

  displayResources(filtered);
}

searchInput.addEventListener("input", filterResources);
filterSelect.addEventListener("change", filterResources);

// Add Resource with image
addResourceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameField = document.getElementById("resourceName"); // 👈 keep reference
  const type = document.getElementById("resourceType").value;
  const contact = document.getElementById("resourceContact").value.trim();
  const location = document.getElementById("resourceLocation").value.trim();
  const imageFile = document.getElementById("resourceImage").files[0];

  if (nameField.value && type && contact && location) {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        resources.push({
          name: nameField.value.trim(),
          type,
          contact,
          location,
          image: reader.result
        });
        saveResources();
        displayResources(resources);
        addResourceForm.reset();
        nameField.focus(); // 👈 focus back to Name field
      };
      reader.readAsDataURL(imageFile);
    } else {
      resources.push({
        name: nameField.value.trim(),
        type,
        contact,
        location,
        image: ""
      });
      saveResources();
      displayResources(resources);
      addResourceForm.reset();
      nameField.focus(); // 👈 focus back
    }
  }
});

// Delete Resource
function deleteResource(index) {
  if (confirm("Are you sure you want to delete this resource?")) {
    resources.splice(index, 1);
    saveResources();
    displayResources(resources);
  }
}

// Edit Resource (open modal)
function editResource(index) {
  editIndex = index;
  const res = resources[index];
  editName.value = res.name;
  editType.value = res.type;
  editContact.value = res.contact;
  editLocation.value = res.location;
  editImage.value = ""; // 👈 clear file input
  editModal.style.display = "flex";
  editName.focus(); // 👈 focus first field
}

// Save edited resource
editResourceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const updatedName = editName.value.trim();
  const updatedType = editType.value;
  const updatedContact = editContact.value.trim();
  const updatedLocation = editLocation.value.trim();
  const imageFile = editImage.files[0];

  if (updatedName && updatedType && updatedContact && updatedLocation) {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        resources[editIndex] = {
          name: updatedName,
          type: updatedType,
          contact: updatedContact,
          location: updatedLocation,
          image: reader.result,
        };
        saveResources();
        displayResources(resources);
        editResourceForm.reset(); // 👈 clear edit form
        editModal.style.display = "none";
      };
      reader.readAsDataURL(imageFile);
    } else {
      resources[editIndex] = {
        ...resources[editIndex],
        name: updatedName,
        type: updatedType,
        contact: updatedContact,
        location: updatedLocation,
      };
      saveResources();
      displayResources(resources);
      editResourceForm.reset(); // 👈 clear edit form
      editModal.style.display = "none";
    }
  }
});

// Close modal
closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
  editResourceForm.reset(); // 👈 reset form on close
});

window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
    editResourceForm.reset(); // 👈 reset form if clicked outside
  }
});
// Clear All Resources
const clearAllBtn = document.getElementById("clearAllBtn");
clearAllBtn.addEventListener("click", () => {
  if (confirm("⚠️ Are you sure you want to delete ALL resources?")) {
    resources = [];
    saveResources();
    displayResources(resources);
  }
});