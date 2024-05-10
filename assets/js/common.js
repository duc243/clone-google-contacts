/**
 *
 * Header code starts
 */
let backendBaseUrl = `http://localhost:5500`;
async function searchKeyUp(event) {
  let keyword = event.currentTarget.value;

  let response = await fetch(backendBaseUrl + "/contact/search/" + keyword);
  let data = await response.json();

  renderSuggestionsInSuggestionsBox(data);

  if (keyword.length > 0) {
    showSuggestionsBox();
  } else {
    hideSuggestionsBox();
  }
}

function renderLabelsInSidebar(labels) {
  let links = ``;

  labels.forEach((label) => {
    links += `<div class="link">
            <div class="content">
              <i class="fa fa-tag" aria-hidden="true"></i> ${label.title}
            </div>
            <div class="counter">500</div>

            <div class="actions">
              <div class="actionButton"  onClick="editLabel(${label.id}, '${label.title}')">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </div>
              <div class="actionButton" onClick="deleteLabel(${label.id})">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </div>
            </div>
          </div>`;
  });

  document.querySelector(
    `#sidebar .dropdownSection #linksContainer`
  ).innerHTML = links;
}

async function getLabels() {
  let response = await fetch(backendBaseUrl + "/label");
  return await response.json();
}

async function loadLabelsInSidebar() {
  let data = await getLabels();
  renderLabelsInSidebar(data);
}

function renderSuggestionsInSuggestionsBox(data) {
  let suggestions = ``;

  data.forEach((contact) => {
    suggestions += `<div class="suggestion" onClick="window.location='/pages/contact.html?id=${
      contact.id
    }'">
          <div class="avatar">${contact.fullName.charAt(0).toUpperCase()}</div>
          <div class="name">${contact.fullName}</div>
          <div>-</div>
          <div class="email">${contact.email}</div>
        </div>`;
  });

  document.querySelector("#searchContainer .suggestions").innerHTML =
    suggestions;
}

function clearSearchInput() {
  let input = document.querySelector("#searchContainer input");
  input.value = "";

  hideSuggestionsBox();
}

function hideSuggestionsBox() {
  let searchContainerEl = document.getElementById("searchContainer");
  searchContainerEl.classList.remove("suggestionsVisible");
}

function showSuggestionsBox() {
  let searchContainerEl = document.getElementById("searchContainer");
  searchContainerEl.classList.add("suggestionsVisible");
}

/**
 * Header code ends
 */

window.addEventListener("load", () => {
  onWindowLoad();
});

function onWindowLoad() {
  loadHeader();
  loadSidebar();
}

function loadHeader() {
  fetch("/common/header.html")
    .then((r) => r.text())
    .then((htmlText) => {
      let headerPlaceholder = document.querySelector("#headerPlaceholder");
      headerPlaceholder.innerHTML = htmlText;
    });
}

function loadSidebar() {
  fetch("/common/sidebar.html")
    .then((r) => r.text())
    .then(async (htmlText) => {
      let sidebarPlaceholder = document.querySelector("#sideBarPlaceholder");
      sidebarPlaceholder.innerHTML = htmlText;

      await loadLabelsInSidebar();
    });
}

function sidebarDropdownToggleClicked(targetElement) {
  targetElement.closest(".dropdownSection").classList.toggle("active");
}

function showCreateLabelDialog() {
  let dialog = document.querySelector("#labelEditorDialog");
  resetCreateLabelDialog(dialog);
  showDialog(dialog);
}

function resetCreateLabelDialog(dialog) {
  dialog.querySelector("[name='id']").value = "";
  dialog.querySelector("[name='title']").value = "";
  dialog.querySelector(".dialogTitle").innerHTML = "Create label";
}

function hideCreateLabelDialog() {
  let dialog = document.querySelector("#labelEditorDialog");
  closeDialog(dialog);
}
function closeDialog(dilaogElement) {
  dilaogElement.classList.remove("active");
}

function showDialog(dilaogElement) {
  dilaogElement.classList.add("active");
}

function getBase64FromFile(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}

async function deleteContacts(ids) {
  let response = await fetch(`${backendBaseUrl}/contact`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: ids }),
  });
}

async function getContact(contactId) {
  let response = await fetch(`${backendBaseUrl}/contact/${contactId}`);
  let contact = await response.json();
  return contact;
}

async function onCreateLabelFormSubmit() {
  let dialog = document.querySelector("#labelEditorDialog");
  let title = dialog.querySelector('[name="title"]').value;
  let id = dialog.querySelector('[name="id"]').value;
  hideCreateLabelDialog();

  await fetch(backendBaseUrl + "/label", {
    method: id ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, id }),
  });

  loadLabelsInSidebar();
}

async function deleteLabel(id) {
  await fetch(backendBaseUrl + "/label/" + id, {
    method: "DELETE",
  });

  loadLabelsInSidebar();
}

function editLabel(id, title) {
  showCreateLabelDialog();
  let dialog = document.querySelector("#labelEditorDialog");
  dialog.querySelector(".dialogTitle").innerHTML = "Update label";
  dialog.querySelector('[name="title"]').value = title;
  dialog.querySelector('[name="id"]').value = id;
}
