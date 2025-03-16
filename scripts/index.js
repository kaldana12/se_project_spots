const initialCards = [
  {
    name: "Woman",
    link: "https://unsplash.com/photos/a-woman-standing-in-front-of-a-mirror-brushing-her-teeth-vuwDHNmwvHQ",
  },

  {
    name: "Window",
    link: "https://unsplash.com/photos/a-woman-standing-in-front-of-a-window-FXNvIe2XrZk",
  },

  {
    name: "Building",
    link: "https://unsplash.com/photos/a-black-and-white-photo-of-a-building-with-graffiti-on-it-cDzAdwff-8U",
  },

  {
    name: "Camera",
    link: "https://unsplash.com/photos/a-person-holding-a-camera-up-in-the-air-yEhrHJ3vDEI",
  },

  {
    name: "Shadow",
    link: "https://unsplash.com/photos/a-person-sitting-on-a-bench-in-the-dark-00rKfDokg_Y",
  },

  {
    name: "Snow",
    link: "https://unsplash.com/photos/a-view-of-a-dome-on-top-of-a-building-in-the-snow-vfrdWR2Shmw",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editModalCloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editFormInput = document.querySelector(".modal__form");

function openModal() {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  editModal.classList.add("modal_opened");
}

function closeModal() {
  editModal.classList.remove("modal_opened");
}

function handleeditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal();
}

profileEditButton.addEventListener("click", openModal);
editModalCloseButton.addEventListener("click", closeModal);
editFormInput.addEventListener("submit", handleeditFormSubmit);
