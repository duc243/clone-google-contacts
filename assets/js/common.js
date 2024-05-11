/**
 *
 * Header code starts
 */
//let backendBaseUrl = `http://localhost:5500`;
/*async function searchKeyUp(event) {
  let keyword = event.currentTarget.value;

  let response = await fetch(backendBaseUrl + "/contact/search/" + keyword);
  let data = await response.json();

  renderSuggestionsInSuggestionsBox(data);

  if (keyword.length > 0) {
    showSuggestionsBox();
  } else {
    hideSuggestionsBox();
  }
}*/

/*function renderLabelsInSidebar(labels) {
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
}*/

/*async function getLabels() {
  let response = await fetch(backendBaseUrl + "/label");
  return await response.json();
}*/

/*async function loadLabelsInSidebar() {
  let data = await getLabels();
  renderLabelsInSidebar(data);
}*/

/*function renderSuggestionsInSuggestionsBox(data) {
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
}*/

/*function clearSearchInput() {
  let input = document.querySelector("#searchContainer input");
  input.value = "";

  hideSuggestionsBox();
}*/

/*function hideSuggestionsBox() {
  let searchContainerEl = document.getElementById("searchContainer");
  searchContainerEl.classList.remove("suggestionsVisible");
}*/

/*function showSuggestionsBox() {
  let searchContainerEl = document.getElementById("searchContainer");
  searchContainerEl.classList.add("suggestionsVisible");
}*/

/**
 * Header code ends
 */




 









// Fonction initiale pour démarrer l'application
async function init() {
  try {
    await Promise.all([loadHeader(), loadSidebar()]);
    await loadContent('/pages/content.html');
    await Promise.all([loadLabels(), loadContacts()]);
    setupButtonListener();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error);
  }
}

// Fonction pour charger le header
async function loadHeader() {
  try {
    const response = await fetch("/common/header.html");
    const htmlText = await response.text();
    document.querySelector("#headerPlaceholder").innerHTML = htmlText;
  } catch (error) {
    console.error('Erreur lors du chargement du header:', error);
  }
}

// Fonction pour charger la sidebar
async function loadSidebar() {
  try {
    const response = await fetch("/common/sidebar.html");
    const htmlText = await response.text();
    document.querySelector("#sideBarPlaceholder").innerHTML = htmlText;
  } catch (error) {
    console.error('Erreur lors du chargement de la sidebar:', error);
  }
}

// Fonction pour charger les labels
async function loadLabels() {
  const labelContainer = document.querySelector('.labelContainer');
  if (labelContainer) {
    labelContainer.innerHTML = '';
    labels.forEach(label => {
      const labelDiv = document.createElement('div');
      labelDiv.classList.add('label');
      labelDiv.innerHTML = `<i class="fa fa-thumb-tack" aria-hidden="true"></i>${label.name}`;
      labelContainer.appendChild(labelDiv);
    });
  } else {
    console.error('Le conteneur de labels est introuvable dans le DOM.');
  }
}

// Fonction pour charger le contenu principal
async function loadContent(url) {
  try {
    const response = await fetch(url);
    const htmlText = await response.text();
    const contentPlaceholder = document.querySelector('#content');
    contentPlaceholder.innerHTML = htmlText;
    if (url === '/pages/contact-editor.html') {
      document.querySelector('#submitContactBtn').addEventListener('click', addContactAndReloadContent);
    }
  } catch (error) {
    console.error('Erreur lors du chargement du contenu:', error);
  }
}

// Fonction pour charger les contacts
async function loadContacts() {
  const tableBody = document.querySelector('.tableBody');
  if (tableBody) {
    tableBody.innerHTML = '';
    contacts.forEach(contact => {
      const contactRow = document.createElement('div');
      contactRow.classList.add('tableRow');
      
      contactRow.innerHTML = `
      <div class='column'>
        <div class="avatar">A</div>
        <div class="checkbox">
            <input type="checkbox" >
        </div>
        ${contact.firstName} ${contact.lastName}
      </div>
      <div class="column">${contact.email}</div>
      <div class="column">${contact.phone}</div>
      <div class="column">${contact.fonction} chez ${contact.entreprise}</div>
      <div class="column">Libellés</div>
    `;
    
    tableBody.appendChild(contactRow);
    });
  } else {
    console.error('Le conteneur de contacts est introuvable dans le DOM.');
  }
}

// Fonction pour configurer les écouteurs d'événements
function setupButtonListener() {
  const button = document.querySelector('#createContactBtn');
  if (button) {
    button.addEventListener('click', () => {
      loadContent('/pages/contact-editor.html');
    });
  } else {
    console.error('Le bouton pour créer un contact est introuvable dans le DOM.');
  }
}

// Fonction pour ajouter un contact et recharger le contenu
async function addContactAndReloadContent(event) {
  event.preventDefault();

  const form = document.querySelector('#contactEditorPage #content'); // Assurez-vous que l'ID correspond à votre formulaire
  const newContact = {
    firstName: form.querySelector('input[name="firstName"]').value,
    lastName: form.querySelector('input[name="lastName"]').value,
    email: form.querySelector('input[name="email"]').value,
    phone: form.querySelector('input[name="phone"]').value,
    fonction: form.querySelector('input[name="fonction"]').value,
    entreprise: form.querySelector('input[name="entreprise"]').value
  };

  // Ajouter le nouveau contact au tableau 'contacts'
  contacts.push(newContact);

  // Recharger le contenu de la page 'content.html' et les contacts
  await loadContent('/pages/content.html');
  await loadContacts();
}

// Écouteur pour démarrer l'application une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', init);























/*function sidebarDropdownToggleClicked(targetElement) {
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
}*/

// async function getContact(contactId) {
//   let response = await fetch(`${backendBaseUrl}/contact/${contactId}`);
//   let contact = await response.json();
//   return contact;
// }

/*async function onCreateLabelFormSubmit() {
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



*/

////////////////////////////////




      


      


      // async function loadContacts() {
      //   let response = await fetch(`${backendBaseUrl}/contact`);
      //   let data = await response.json();

      //   contacts = data;
      //   console.log(contacts);
      //   renderContacts();
      // }

      /*function getSelectedContacts() {
        return contacts.filter((contact) => contact.selected);
      }

      async function deleteSelectedContacts(pSelectedContacts = undefined) {
        let selectedContacts = pSelectedContacts
          ? pSelectedContacts
          : getSelectedContacts();
        let selectedContactIds = selectedContacts.map((contact) => contact.id);
        contacts = contacts.filter(
          (contact) => !selectedContactIds.includes(contact.id)
        );

        selectedContacts = contacts.filter((contact) => contact.selected);

        renderContacts();
        selectedContacts = getSelectedContacts();
        updateNumberOfSelectedContacts(selectedContacts.length);
        showHideTableHead(selectedContacts);

        await deleteContacts(selectedContactIds);
      }

      function onCheckboxChange(e) {
        let selectedContactId = parseInt(e.currentTarget.value);
        let selectedContact = contacts.find(
          (contact) => contact.id === selectedContactId
        );
        if (e.currentTarget.checked) {
          e.currentTarget.closest(".contactRow").classList.add("selected");

          if (selectedContact) {
            selectedContact.selected = true;
          }
        } else {
          e.currentTarget.closest(".contactRow").classList.remove("selected");

          if (selectedContact) {
            selectedContact.selected = false;
          }
        }
        let selectedContacts = contacts.filter((contact) => contact.selected);

        showHideTableHead(selectedContacts);

        updateNumberOfSelectedContacts(selectedContacts.length);
      }

      function showHideTableHead(selectedContacts) {
        if (selectedContacts.length > 0) {
          document.querySelector(".tableHead").classList.add("hide");
          document.querySelector(".actionsBar").classList.add("active");
        } else {
          document.querySelector(".tableHead").classList.remove("hide");
          document.querySelector(".actionsBar").classList.remove("active");
        }
      }

      function updateNumberOfSelectedContacts(totalSelectedContacts) {
        document.querySelector(".numberOfSelectedContacts").innerHTML =
          totalSelectedContacts;
      }

      function renderContact() {
        let tableBody = document.querySelector(".tableBody");
        let tableRowsHTML = ``;

        contacts.forEach((contact) => {
          tableRowsHTML += `<div onclick="window.location='/pages/contact.html?id=${
            contact.id
          }'" class="tableRow contactRow ${contact.selected ? "selected" : ""}">
                    <div class="column">
                      <div class="avatar">A</div>
                      <div class="checkbox"  onClick="event.stopImmediatePropagation()">
                        <input type="checkbox" ${
                          contact.selected ? "checked" : ""
                        } value="${
            contact.id
          }" onChange="onCheckboxChange(event)" />
                      </div>
                      ${contact.fullName}
                    </div>
                    <div class="column">${contact.email}</div>
                    <div class="column">${contact.phone}</div>
                    <div class="column">${
                      !contact.lables ? "" : contact.lables.join(", ")
                    }</div>
                    <div class="column" style="width: 40px">
                      <div class="actionButtons">
                        <i class="fa fa-trash" onclick="deleteContact(${
                          contact.id
                        }, event)" aria-hidden="true"></i>

                        <i class="fa fa-edit" onclick="editContact(${
                          contact.id
                        }, event)" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>`;
        });

        tableBody.innerHTML = tableRowsHTML;
      }

      function deleteContact(contactId, event) {
        event.stopImmediatePropagation();
        let contact = contacts.find((contact) => contact.id == contactId);
        if (contact) {
          deleteSelectedContacts([contact]);
        }
      }

      function editContact(contactId, event) {
        event.stopImmediatePropagation();
        window.location = `/pages/contact-editor.html?id=${contactId}`;
      }
      
      
      
      
      
      
      const params = new URLSearchParams(location.search);
        contactId = params.get("id");
      if(contactId){
        loadContact();
      }

      function onFileChange(files) {
        let file = files.length > 0 ? files[0] : null;
        getBase64FromFile(file).then((base64) => {
          let avatar = document.querySelector("#contactEditorHeader .avatar");

          avatar.style.backgroundImage = `url(${base64})`;
          avatar.classList.add("imagePicked");
        });
      }



      async function onFormSubmit(e) {
        e.preventDefault();

        let formElement = e.target;
        let formData = new FormData(formElement);
        let data = {
          id: crypto.randomUUID(),
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          entreprise: formData.get('entreprise'),
          fonction: formData.get('fonction'),
          email: formData.get('email'),
          phone: formData.get('phone')
        };


       save(data, contactId?'update':'create');
        
        console.log(e);
      }

      async function save(data, action){
        if(action =='update') data.id = contactId;

        contacts.push(data);

        window.location = '/';  
        
      }


      function tableBody() {
        let tableBody = document.querySelector('.tableBody');
        console.log(tableBody);
      }*/
      
   
      // Ajouter le gestionnaire d'événements à la soumission du formulaire
      //document.getElementById('content').addEventListener('submit', onFormSubmit);

      

      // async function loadContact(){
          
      //   let contact = await getContact(contactId);

      //   let emailInput = document.querySelector(`[name="email"]`);
      //   let fullNameInput = document.querySelector(`[name="fullName"]`);
      //   let phoneInput = document.querySelector(`[name="phone"]`);
      //   let websiteInput = document.querySelector(`[name="website"]`);


      //   emailInput.value = contact.email;
      //   fullNameInput.value = contact.fullName;
      //   phoneInput.value = contact.phone;
      //   websiteInput.value = contact.website;

      // }
      
      
      
      
      
      
      
      
      
      
//////////////  Contact Details    ///////////////





      /*let contactLabels;
      let contactId;

      loadContact();

      function editClicked() {
        window.location = `/pages/contact-editor.html?id=${contactId}`;
      }

      async function loadContact() {
        const params = new URLSearchParams(location.search);
        contactId = params.get("id");

        let contact = await getContact(contactId);

        renderLayout(contact);
        await loadLabels();
      }

      async function loadLabels() {
        contactLabels = await getContactLabels();

        loadLabelsInLablesPickerDialog();

        renderLabels(contactLabels);
      }

      async function getContactLabels() {
        let response = await fetch(
          `${backendBaseUrl}/contact-labels/${contactId}`
        );
        let contactLabels = await response.json();
        return contactLabels;
      }

      function renderLabels(contactLabels) {
        let labelsEl = document.querySelector(".labels");
        let labelsHtml = ``;

        contactLabels.forEach((label) => {
          labelsHtml += `  <div class="label">${label.title}</div>`;
        });

        labelsEl.innerHTML = labelsHtml;
      }

      function renderLayout(contact) {
        document.querySelector("#contactHeader .name").innerHTML =
          contact.fullName;
        document.querySelector("#contactHeader .avatar").innerHTML =
          contact.fullName.charAt(0).toUpperCase();
        document.querySelector("#websiteUrl").innerHTML = contact.website;
        document.querySelector("#phoneNumber").innerHTML = contact.phone;
        document.querySelector("#email").innerHTML = contact.email;

        document.querySelector("#content").style.display = "block";
        document.querySelector("#preloader").style.display = "none";
      }

      async function deleteContact() {
        await deleteContacts([contactId]);
        window.location = "/";
      }

      async function loadLabelsInLablesPickerDialog() {
        let data = await getLabels();
        renderLabelsInLabelsPickerDialog(data);
      }

      function renderLabelsInLabelsPickerDialog(labels) {
        let labelsHtml = ``;
        labels.forEach((label) => {
          let isLabelSelected = isLabelInContactLabels(label, contactLabels);

          labelsHtml += `<div class="label" onclick="toggleContactLabel(${
            label.id
          },  ${isLabelSelected})">
            <div class="iconSection">
              <i class="fa fa-tag" aria-hidden="true"></i>
            </div>
            <div class="text">${label.title}</div>
            ${
              isLabelSelected
                ? `<div class="selectionIcon primary-color">
              <i class="fa fa-check" aria-hidden="true"></i>
            </div>`
                : ""
            }
          </div>`;
        });

        document.querySelector("#labelPickerDialog .dialogContent").innerHTML =
          labelsHtml;
      }

      async function toggleContactLabel(labelId, isLabelSelected) {
        ///closeDialog(this.closest('.dialog'))
        if (isLabelSelected) {
          await fetch(`${backendBaseUrl}/contact-labels`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ labelId, contactId }),
          });
        } else {
          // if not selected
          await fetch(`${backendBaseUrl}/contact-labels`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ labelId, contactId }),
          });
        }

        await loadLabels();
        await loadLabelsInLablesPickerDialog();
      }

      function isLabelInContactLabels(label, contactLabels) {
        let foundItem = contactLabels.find(
          (contactLabel) => contactLabel.labelId === label.id
        );

        if (foundItem) return true;
        return false;
      }

      async function showLabelPickerDialog() {
        await loadLabelsInLablesPickerDialog();
        showDialog(document.querySelector("#labelPickerDialog"));
      }*/