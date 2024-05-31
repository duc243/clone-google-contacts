function searchKeyUp(event) {
  let keyword = event.currentTarget.value.toLowerCase();
  let suggestions = "";

  // Filtrer les contacts en fonction de la saisie de l'utilisateur
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(keyword) ||
      contact.lastName.toLowerCase().includes(keyword) ||
      contact.email.toLowerCase().includes(keyword) ||
      contact.phone.toLowerCase().includes(keyword)
  );

  // Construire les éléments HTML pour chaque suggestion
  filteredContacts.forEach((contact) => {
    suggestions += `<div class="suggestion" onclick="loadContactContent(contact)">
      <div class="avatar">${contact.firstName.charAt(0).toUpperCase()}</div>
      <div class="name">${contact.firstName} ${contact.lastName}</div>
      <div>-</div>
      <div class="email">${contact.email}</div>
      <div>-</div>
      <div class="phone">${contact.phone}</div>
    </div>`;
  });

  // Afficher ou cacher la boîte de suggestions en fonction de la saisie
  const suggestionsContainer = document.querySelector(
    "#searchContainer .suggestions"
  );
  suggestionsContainer.innerHTML = suggestions;
  if (keyword.length > 0 && filteredContacts.length > 0) {
    showSuggestionsBox();
  } else {
    hideSuggestionsBox();
  }
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

// Fonction initiale pour démarrer l'application
async function init() {
  try {
    await Promise.all([loadHeader(), loadSidebar()]);
    await loadContent("/pages/content.html");
    await Promise.all([loadLabels(), loadContacts()]);
    showAndHideSidebar();
    initializeCheckboxes();
    setupNewContactButtonListener();
    setupRedirectButtonListener();
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application:", error);
  }
}

async function loadHeader() {
  try {
    const response = await fetch("/common/header.html");
    const htmlText = await response.text();
    document.querySelector("#headerPlaceholder").innerHTML = htmlText;
  } catch (error) {
    console.error("Erreur lors du chargement du header:", error);
  }
}

function showAndHideSidebar() {
  const burgerMenuButton = document.querySelector(".burger-menu");
  const sidebar = document.querySelector("#sidebar");
  const sidebarOverlay = document.querySelector(".sidebarOverlay");
  let isSidebarVisible = false;

  burgerMenuButton.addEventListener("click", () => {
    if (window.innerWidth <= 1024) {
      // Pour les écrans de moins de 1024px
      if (!isSidebarVisible) {
        sidebar.style.display = "block"; // Afficher le sidebar fixe
      } else {
        sidebar.style.display = "none"; // Cacher le sidebar fixe
      }
    } else {
      // Pour les écrans plus larges que 1024px
      sidebar.style.display = isSidebarVisible ? "none" : "block";
    }
    isSidebarVisible = !isSidebarVisible;
  });

  // Ajouter un écouteur d'événements sur le contenu pour fermer le sidebar
  sidebarOverlay.addEventListener("click", (event) => {
    if (isSidebarVisible && window.innerWidth <= 1024) {
      sidebar.style.display = "none";
      isSidebarVisible = false;
    }
  });
}

// Fonction pour charger la sidebar
async function loadSidebar() {
  try {
    const response = await fetch("/common/sidebar.html");
    const htmlText = await response.text();
    document.querySelector("#sideBarPlaceholder").innerHTML = htmlText;
  } catch (error) {
    console.error("Erreur lors du chargement de la sidebar:", error);
  }
}

async function loadLabels() {
  const labelContainer = document.querySelector(".labelContainer");
  if (labelContainer) {
    labelContainer.innerHTML = "";
    labels.forEach((label) => {
      const labelDiv = document.createElement("div");
      labelDiv.classList.add("label");
      labelDiv.innerHTML = `<div class='title'><span class="material-symbols--label"></span>${label.title}</div>
        <div class='icon'><i class="fa fa-pencil" aria-hidden="true" onclick="editLabel('${label.id}'), showCreateLabelDialog()"></i>
        <i class="fa fa-trash" aria-hidden="true" onclick="deleteLabel('${label.id}', this)"></i></div>`;
      labelDiv.addEventListener("click", () =>
        showContactsForLabel(label.title)
      );
      labelContainer.appendChild(labelDiv);
    });
  } else {
    console.error("Le conteneur de labels est introuvable dans le DOM.");
  }
}

// Cette fonction affiche les contacts pour un label donné
async function showContactsForLabel(labelTitle) {
  await loadContent("/pages/content.html");

  const filteredContacts = contacts.filter((contact) =>
    contact.labels.includes(labelTitle)
  );
  const tableBody = document.querySelector(".tableBody");
  if (tableBody) {
    tableBody.innerHTML = "";
    filteredContacts.forEach((contact) => {
      const contactRow = document.createElement("div");
      contactRow.classList.add("tableRow");
      contactRow.innerHTML = `
        <div class='column'>
          <div class="avatar">${contact.firstName.charAt(0).toUpperCase()}</div>
          <div class="checkbox">
            <div class="bg-btn">
              <input type="checkbox">
              <span class="contactId">${contact.id}</span>
            </div>
          </div>
          ${contact.firstName} ${contact.lastName}
        </div>
        <div class="column email">${contact.email}</div>
        <div class="column phone">${contact.phone}</div>
        <div class="column company">${contact.fonction} ${
        contact.entreprise
      }</div>
        <div class="column libelle">${contact.labels}</div>
        <div class="columnLogo buttons">
        <div class="bg-btn">
          <span class="material-symbols--star-outline"></span>
        </div>
        <div class="bg-btn">
          <span class="mdi--pencil-outline"></span>
        </div>
        <div class="bg-btn">
          <span class="material-symbols--delete-outline"></span>
        </div>
      </div>
      `;

      contactRow.querySelector(".bg-btn").addEventListener("click", (event) => {
        event.stopPropagation();
      });

      contactRow
        .querySelector(".mdi--pencil-outline")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          editContact(contact.id);
        });

      contactRow
        .querySelector(".material-symbols--delete-outline")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          deleteContact(contact.id, event.currentTarget);
        });

      contactRow.addEventListener("click", () => {
        loadContactContent(contact);
      });

      tableBody.appendChild(contactRow);
    });
  } else {
    console.error("Le conteneur de contacts est introuvable dans le DOM.");
  }
}

// Fonction pour charger le contenu principal
async function loadContent(url) {
  try {
    const response = await fetch(url);
    const htmlText = await response.text();
    const contentPlaceholder = document.querySelector("#content");
    contentPlaceholder.innerHTML = htmlText;
    updateNumberOfContacts(contacts.length);
    if (url === "/pages/contact-editor.html") {
      checkContactForm();
    } else if (url === "/pages/corbeille.html") {
      updateNumberOfContacts(corbeilles.length);
    }
  } catch (error) {
    console.error("Erreur lors du chargement du contenu:", error);
  }
}

// Fonction pour charger les contacts
async function loadContacts() {
  const tableBody = document.querySelector(".tableBody");
  if (tableBody) {
    tableBody.innerHTML = "";
    contacts.forEach((contact) => {
      const contactRow = document.createElement("div");
      contactRow.classList.add("tableRow");

      contactRow.innerHTML = `
        <div class='column'>
          <div class="avatar">${contact.firstName.charAt(0).toUpperCase()}</div>
          <div class="checkbox">
            <div class="bg-btn">
              <input type="checkbox">
              <span class="contactId">${contact.id}</span>
            </div>
          </div>
          ${contact.firstName} ${contact.lastName}
        </div>
        <div class="column email">${contact.email}</div>
        <div class="column phone">${contact.phone}</div>
        <div class="column company">${contact.fonction} ${
        contact.entreprise
      }</div>
        <div class="column libelle">${contact.labels}</div>
        <div class="columnLogo buttons">
        <div class="bg-btn">
          <span class="material-symbols--star-outline"></span>
        </div>
        <div class="bg-btn">
          <span class="mdi--pencil-outline"></span>
        </div>
        <div class="bg-btn">
          <span class="material-symbols--delete-outline"></span>
        </div>
      </div>
      `;

      contactRow.querySelector(".bg-btn").addEventListener("click", (event) => {
        event.stopPropagation();
      });

      contactRow
        .querySelector(".mdi--pencil-outline")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          editContact(contact.id);
        });

      contactRow
        .querySelector(".material-symbols--delete-outline")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          deleteContact(contact.id, event.currentTarget);
        });

      contactRow.addEventListener("click", () => {
        loadContactContent(contact);
      });

      tableBody.appendChild(contactRow);
    });
  } else {
    console.error("Le conteneur de contacts est introuvable dans le DOM.");
  }
}

// Fonction pour charger le contenu d'un contact spécifique
async function loadContactContent(contact) {
  await loadContent("/pages/contact.html");

  document.querySelector("#contactHeader .avatar").textContent =
    contact.firstName.charAt(0).toUpperCase();
  document.querySelector("#contactHeader .name").textContent =
    contact.firstName;
  document.querySelector("#contactContentContainer #email").textContent =
    contact.email;
  document.querySelector("#contactContentContainer #phoneNumber").textContent =
    contact.phone;
}

async function loadCorbeille() {
  const tableBody = document.querySelector(".tableBody");
  if (tableBody) {
    tableBody.innerHTML = "";
    corbeilles.forEach((corbeille) => {
      const corbeilleRow = document.createElement("div");
      corbeilleRow.classList.add("tableRow");

      corbeilleRow.innerHTML = `
        <div class='column'>
          <div class="avatar">${corbeille.firstName
            .charAt(0)
            .toUpperCase()}</div>
          <div class="checkbox">
            <div class="bg-btn">
              <input type="checkbox">
              <span class="contactId">${corbeille.id}</span>
            </div>
          </div>
          ${corbeille.firstName} ${corbeille.lastName}
        </div>
        <div class="column email">${corbeille.email}</div>
        <div class="column phone">${corbeille.phone}</div>
        <div class="column company">${corbeille.fonction} ${
        corbeille.entreprise
      }</div>
        <div class="column libelle">${corbeille.labels}</div>
        <div class="columnLogo buttons">
          <div class="bg-btn">
            <span class="material-symbols--delete-outline"></span>
          </div>
        </div>
      `;

      tableBody.appendChild(corbeilleRow);
    });
  } else {
    console.error("Le conteneur de corbeilles est introuvable dans le DOM.");
  }
}

async function onCheckboxChange(e) {
  let selectedContactId = e.currentTarget.nextElementSibling.textContent.trim();
  let selectedContact = contacts.find(
    (contact) => contact.id == selectedContactId
  );
  if (e.currentTarget.checked) {
    e.currentTarget.closest(".tableRow").classList.add("selected");
    /*e.currentTarget.closest(".tableRow").querySelector(".avatar").style.display = "none";*/

    if (selectedContact) {
      selectedContact.selected = true;
    }
  } else {
    e.currentTarget.closest(".tableRow").classList.remove("selected");
    /*e.currentTarget.closest(".tableRow").querySelector(".avatar").style.display = "block";*/

    if (selectedContact) {
      selectedContact.selected = false;
    }
  }
  let selectedContacts = contacts.filter((contact) => contact.selected);

  showHideTableHead(selectedContacts);
}

function updateNumberOfSelectedContacts(totalSelectedContacts) {
  document.querySelector(".updateSeletedNumberOfContacts").innerHTML =
    totalSelectedContacts;
}

function initializeCheckboxes() {
  const checkboxes = document.querySelectorAll(
    '.tableBody .checkbox input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", onCheckboxChange);
  });
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

function updateNumberOfContacts(totalContacts) {
  document.querySelector(".numberOfContacts").innerHTML = totalContacts;
}

function initializeCheckboxes() {
  const checkboxes = document.querySelectorAll(
    '.tableBody .checkbox input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", onCheckboxChange);
  });
}

function deleteLabel(labelId, element) {
  // Trouver l'index du contact à supprimer
  const labelIndex = labels.findIndex((label) => label.id == labelId);
  if (labelIndex !== -1) {
    showConfirmationModal(labelId, () => {
      // Supprimer le contact du tableau 'contacts'
      labels.splice(labelIndex, 1);
      // Supprimer la ligne du contact du DOM
      element.closest(".label").remove();
    });
  } else {
    console.error("Contact non trouvé:", labelId);
  }
}

function deleteContact(contactId, element) {
  const contactIndex = contacts.findIndex((contact) => contact.id == contactId);
  if (contactIndex !== -1) {
    // Afficher le modal de confirmation
    showConfirmationModal(contactId, () => {
      // Ajouter le(s) contact(s) au tableau 'corbeille'
      corbeilles.push(contacts[contactIndex]);
      // Supprimer le(s) contact(s) du tableau 'contacts'
      contacts.splice(contactIndex, 1);
      // Supprimer la ligne du(s) contact(s) du DOM
      element.closest(".tableRow").remove();
    });
  } else {
    console.error("Contact non trouvé:", contactId);
  }
}

// Fonction pour supprimer les contacts sélectionnés
function deleteSelectedContacts() {
  const checkboxes = document.querySelectorAll(
    '.tableBody .checkbox input[type="checkbox"]:checked'
  );
  checkboxes.forEach((checkbox) => {
    const contactId = checkbox.nextElementSibling.textContent.trim();
    deleteContact(contactId, checkbox);
  });
}

async function editLabel(labelId) {
  // Trouver le contact dans le tableau 'contacts'
  const labelToEdit = labels.find((label) => label.id == labelId);
  if (labelToEdit) {
    const form = document.querySelector("#labelEditorDialog");
    labelToEdit.title = form.querySelector('input[name="title"]').value;
  } else {
    console.error("Contact non trouvé:", contactId);
  }
}

// Fonction pour éditer un contact
async function editContact(contactId) {
  // Trouver le contact dans le tableau 'contacts'
  const contactToEdit = contacts.find((contact) => contact.id == contactId);
  if (contactToEdit) {
    await loadContent("/pages/edit-contact.html");

    const form = document.querySelector("#contactContent");
    form.querySelector('input[name="firstName"]').value =
      contactToEdit.firstName;
    form.querySelector('input[name="lastName"]').value = contactToEdit.lastName;
    form.querySelector('input[name="email"]').value = contactToEdit.email;
    form.querySelector('input[name="phone"]').value = contactToEdit.phone;
    form.querySelector('input[name="fonction"]').value = contactToEdit.fonction;
    form.querySelector('input[name="entreprise"]').value =
      contactToEdit.entreprise;

    // Ajoutez des écouteurs d'événements pour les boutons de soumission et d'annulation
    form
      .querySelector("#submitContactBtn")
      .addEventListener("click", () => saveContact(contactId));
    //form.querySelector('#cancelButton').addEventListener('click', () => loadContacts());
  } else {
    console.error("Contact non trouvé:", contactId);
  }
}

// Cette fonction applique les modifications au contact
async function saveContact(contactId) {
  const form = document.querySelector("#contactContent");
  const contactToEdit = contacts.find((contact) => contact.id == contactId);
  contactToEdit.firstName = form.querySelector('input[name="firstName"]').value;
  contactToEdit.lastName = form.querySelector('input[name="lastName"]').value;
  contactToEdit.email = form.querySelector('input[name="email"]').value;
  contactToEdit.phone = form.querySelector('input[name="phone"]').value;
  contactToEdit.fonction = form.querySelector('input[name="fonction"]').value;
  contactToEdit.entreprise = form.querySelector(
    'input[name="entreprise"]'
  ).value;

  // Rechargez la liste des contacts pour afficher les modifications
  await loadContent("/pages/content.html");
  loadContacts();
}

// Fonction pour configurer les écouteurs d'événements
function setupNewContactButtonListener() {
  const buttons = document.querySelectorAll("#createContactBtn");
  if (buttons) {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        loadContent("/pages/contact-editor.html");
      });
    });
  } else {
    console.error(
      "Le bouton pour créer un contact est introuvable dans le DOM."
    );
  }
}

function setupRedirectButtonListener() {
  const buttons = document.querySelectorAll("#links .link");
  if (buttons.length > 0) {
    buttons.forEach((button, index) => {
      button.addEventListener("click", async () => {
        // Enlever le fond bleu de tous les boutons
        buttons.forEach((btn) => btn.classList.remove("active"));

        // Charger le contenu correspondant
        await loadContent(links[index]);

        // Mettre le fond bleu sur le bouton actif
        button.classList.add("active");

        // Charger le contenu supplémentaire spécifique à la page
        switch (index) {
          case 0:
            await loadContacts(); // Charge les contacts pour content.html
            break;
          case 1:
            await loadHistory(); // Charge l'historique pour history.html
            break;
          case 2:
            await loadCorbeille(); // Charge la corbeille pour corbeille.html
            break;
          default:
            console.error("Index non géré:", index);
        }
      });
    });
  } else {
    console.error(
      "Les boutons pour rediriger le contenu sont introuvables dans le DOM."
    );
  }
}

// Fonction pour vérifier l'état des champs importants
function checkInputs() {
  const submitButton = document.querySelector("#submitContactBtn");
  const inputs = document.querySelectorAll(
    "#contactEditorPage #contactContent .important"
  );
  // Vérifier si au moins un champ est rempli
  const isAnyFilled = Array.from(inputs).some(
    (input) => input.value.trim() !== ""
  );
  submitButton.disabled = !isAnyFilled; // Désactiver le bouton si aucun champ n'est rempli
  submitButton.style.backgroundColor = isAnyFilled ? "" : "grey"; // Rendre le bouton gris si désactivé
}

function checkContactForm() {
  const submitButton = document.querySelector("#submitContactBtn");
  const inputs = document.querySelectorAll(
    "#contactEditorPage #contactContent .important"
  );
  console.log(submitButton, inputs);

  // Vérifier l'état initial des champs
  checkInputs();

  // Ajouter un écouteur d'événements sur chaque champ important pour vérifier l'état lors de la saisie
  inputs.forEach((input) => {
    input.addEventListener("input", checkInputs);
  });

  submitButton.addEventListener("click", addContactAndReloadContent);
}

// Fonction pour ajouter un contact et recharger le contenu
async function addContactAndReloadContent(event) {
  event.preventDefault();

  const form = document.querySelector("#contactEditorPage #contactContent"); // Assurez-vous que l'ID correspond à votre formulaire
  console.log(form);
  const newContact = {
    id: crypto.randomUUID(),
    firstName: form.querySelector('input[name="firstName"]').value,
    lastName: form.querySelector('input[name="lastName"]').value,
    email: form.querySelector('input[name="email"]').value,
    phone: form.querySelector('input[name="phone"]').value,
    fonction: form.querySelector('input[name="fonction"]').value,
    entreprise: form.querySelector('input[name="entreprise"]').value,
  };

  // Ajouter le nouveau contact au tableau 'contacts'
  contacts.push(newContact);

  // Recharger le contenu de la page 'content.html' et les contacts
  await loadContent("/pages/content.html");
  await loadContacts();
}

// Écouteur pour démarrer l'application une fois que le DOM est chargé
document.addEventListener("DOMContentLoaded", init);

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

async function onCreateLabelFormSubmit() {
  let form = document.querySelector(".dialogContentContainer");

  let newLabel = {
    title: form.querySelector('input[name="title"]').value,
  };

  labels.push(newLabel);
  hideCreateLabelDialog();

  loadLabels();
}

function showConfirmationModal(contactId, callback) {
  // Récupérer l'élément du modal
  const modal = document.querySelector("#deleteConfimDialog");

  // Afficher le modal
  modal.classList.add("active");

  // Gérer le clic sur le bouton "Oui"
  const confirmButton = modal.querySelector(".confirm-button");
  confirmButton.addEventListener("click", () => {
    // Appeler la fonction de rappel
    callback();
    // Cacher le modal
    modal.classList.remove("active");
  });

  // Gérer le clic sur le bouton "Non" ou la fermeture du modal
  const cancelButton = modal.querySelector(".cancel-button");
  cancelButton.addEventListener("click", () => {
    // Cacher le modal
    modal.classList.remove("active");
  });
}














// // Fonction pour créer un élément HTML avec une classe
// function createHtmlElement(tag, className, textContent = "") {
//   const element = document.createElement(tag);
//   element.classList.add(className);
//   element.textContent = textContent;
//   return element;
// }

// // Fonction pour créer l'avatar (première lettre du prénom en majuscule)
// function createAvatar(firstName) {
//   const avatarDiv = createHtmlElement("div", "avatar", firstName.charAt(0).toUpperCase());
//   return avatarDiv;
// }

// // Fonction pour créer la case à cocher
// function createCheckbox(contactId) {
//   const checkboxDiv = createHtmlElement("div", "checkbox");
//   const bgBtnDiv = createHtmlElement("div", "bg-btn");
//   const inputCheckbox = document.createElement("input");
//   inputCheckbox.type = "checkbox";
//   const contactIdSpan = createHtmlElement("span", "contactId", contactId);
//   bgBtnDiv.appendChild(inputCheckbox);
//   bgBtnDiv.appendChild(contactIdSpan);
//   checkboxDiv.appendChild(bgBtnDiv);
//   return checkboxDiv;
// }

// // Fonction pour créer une colonne de texte
// function createColumn(className, text) {
//   const columnDiv = createHtmlElement("div", className, text);
//   return columnDiv;
// }

// // Fonction pour créer les icônes d'action
// function createActionIcons() {
//   const actionIcons = ["star-outline", "pencil-outline", "delete-outline"];
//   const logoDiv = createHtmlElement("div", "columnLogo", "buttons");
//   actionIcons.forEach((icon) => {
//     const iconSpan = createHtmlElement("span", `material-symbols--${icon}`);
//     const iconContainer = createHtmlElement("div", "bg-btn");
//     iconContainer.appendChild(iconSpan);
//     logoDiv.appendChild(iconContainer);
//   });
//   return logoDiv;
// }

// // Fonction pour charger les contacts ou la corbeille
// function loadContactsOrCorbeille(data) {
//   const tableBody = document.querySelector(".tableBody");
//   if (tableBody) {
//     tableBody.innerHTML = "";
//     data.forEach((item) => {
//       const contactRow = document.createElement("div");
//       contactRow.classList.add("tableRow");

//       contactRow.appendChild(createAvatar(item.firstName));
//       contactRow.appendChild(createCheckbox(item.id));
//       contactRow.appendChild(createColumn("column", `${item.firstName} ${item.lastName}`));
//       contactRow.appendChild(createColumn("email", item.email));
//       contactRow.appendChild(createColumn("phone", item.phone));
//       contactRow.appendChild(createColumn("company", `${item.fonction} ${item.entreprise}`));
//       contactRow.appendChild(createColumn("libelle", item.labels));
//       contactRow.appendChild(createActionIcons());

//       // Gérer les événements pour les icônes d'action
//       contactRow.querySelectorAll(".bg-btn").forEach((btn) => {
//         btn.addEventListener("click", (event) => {
//           event.stopPropagation();
//         });
//       });
//       contactRow.querySelector(".mdi--pencil-outline").addEventListener("click", (event) => {
//         event.stopPropagation();
//         editContact(item.id);
//       });
//       contactRow.querySelector(".material-symbols--delete-outline").addEventListener("click", (event) => {
//         event.stopPropagation();
//         deleteContact(item.id, event.currentTarget);
//       });

//       // Afficher le contenu du contact lors du clic sur la ligne
//       contactRow.addEventListener("click", () => loadContactContent(item));

//       tableBody.appendChild(contactRow);
//     });
//   } else {
//     console.error("Le conteneur de contacts est introuvable dans le DOM.");
//   }
// }

// // Utilisation de la fonction pour charger les contacts
// loadContactsOrCorbeille(contacts);
