import "./index.css";
import { settings } from "../scripts/validation.js";
import { disabledButton } from "../scripts/validation.js";
import { resetValidation } from "../scripts/validation.js";
import { enableValidation } from "../scripts/validation.js";
import avatarSrc from "../images/avatar.jpg";
import Api from "../utils/api.js";
import { handleSubmit } from "../utils/helpers.js";

const avatarImage = document.getElementById("image-avatar");
avatarImage.src = avatarSrc;
const profileDescription = document.querySelector(".profile__description");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "bd0dda27-19f5-4140-81e1-0cd5551e39ec",
    "Content-Type": "application/json",
  },
});
const profileName = document.querySelector(".profile__title");

api
  .getAppInfo()
  .then(([cards, users]) => {
    console.log(cards, users);
    console.log("User data:", users); // Let's keep this to see what we get
    currentUserId = users._id;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });

    avatarImage.src = avatarSrc;

    profileName.textContent = users.name; // We might need to adjust this property name
    profileDescription.textContent = users.about;
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalButton = document.querySelector(".profile__avatar-btn");

//Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalCloseBttn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Delete form elemmts
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

//Edit modal
const editModal = document.querySelector("#edit-modal");
const editModalCloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editFormInput = document.querySelector(".modal__form");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBttn = cardModal.querySelector(".modal__close-btn");
const cardLink = document.querySelector(".card__image");
const cardName = document.querySelector(".card__title");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalNameInput = cardModal.querySelector("#add-card-name-input");
const cardFormInput = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");

//Card elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;
let currentUserId;

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");
const deleteCancelButton = document.getElementById("cancel-delete-btn");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNamedl = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  cardNamedl.textContent = data.name;
  console.log("Card data:", data);
  console.log("Card image element src:", cardImage.src);

  console.log("Card name:", data.name);
  console.log("Card link:", data.link);

  cardImage.src = data.link;
  cardImage.alt = data.name;

  const isLikedByCurrentUser = data.isLiked === true;

  if (isLikedByCurrentUser) {
    likeButton.classList.add("card__like-btn_liked");
  }

  if (
    Array.isArray(data.likes) &&
    data.likes.some((user) => user._id === currentUserId)
  ) {
    likeButton.classList.add("card__like-btn_liked");
  }

  likeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
  });

  return cardElement;
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  function makeRequest() {
    return api
      .editUserInfo({
        name: editModalNameInput.value,
        about: editModalDescriptionInput.value,
      })
      .then((data) => {
        profileName.textContent = data.name;
        profileDescription.textContent = data.about;
        closeModal(editModal);
      });
  }

  handleSubmit(makeRequest, evt);
}

function handleCardFormSubmit(evt) {
  function makeRequest() {
    return api
      .addCard({
        name: cardModalNameInput.value,
        link: cardModalLinkInput.value,
      })
      .then((cardData) => {
        const cardElement = getCardElement(cardData);
        cardsList.prepend(cardElement);
        disabledButton(cardSubmitBtn, settings);
        closeModal(cardModal);
      });
  }

  handleSubmit(makeRequest, evt);
}

function handleAvatarSubmit(evt) {
  function makeRequest() {
    return api.editAvatarInfo(avatarInput.value).then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
    });
  }

  handleSubmit(makeRequest, evt);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  function makeRequest() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    });
  }

  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, cardId) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_liked");

  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      // Toggle the like class manually based on previous state
      likeButton.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormInput,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});
editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});
cardModalCloseBttn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

editFormInput.addEventListener("submit", handleEditFormSubmit);
cardFormInput.addEventListener("submit", handleCardFormSubmit);

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarModalCloseBttn.addEventListener("click", () => {
  closeModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

// Universal overlay click handler for all modals
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    console.log("Closing modal:", modal);
    if (modal) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
