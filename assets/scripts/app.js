const DEMO_ACCESS_HASH = "8348dba3fb45e71da83acebf4e2635417001cae6e4ecf4de106de8b0947acf29";
const STORAGE_KEY = "pisciniste-site-content-v5";

const defaults = {
  content: {
    companyName: "Azur Piscines",
    tagline: "Artisan pisciniste près de chez vous",
    heroTitle: "Votre piscine, pensée et réalisée par un artisan local.",
    heroText: "J'accompagne les particuliers de l'étude du projet jusqu'à la mise en eau, avec des solutions fiables, durables et adaptées à votre terrain.",
    areaTitle: "Un pisciniste disponible dans votre secteur",
    areaText: "Basé localement, j'interviens dans un rayon d'environ 40 km pour les projets de construction, rénovation, remise en service et suivi d'entretien.",
    serviceConstructionTitle: "Construction de piscine",
    serviceConstructionText: "Étude du terrain, choix des équipements, terrassement, structure, filtration et finitions.",
    serviceRenovationTitle: "Rénovation",
    serviceRenovationText: "Remplacement de liner, reprise des margelles, modernisation de la filtration et amélioration du confort.",
    serviceEntretienTitle: "Entretien et dépannage",
    serviceEntretienText: "Mise en route, hivernage, analyse de l'eau, nettoyage, réglages et suivi technique.",
    contactTitle: "Parlons de votre projet piscine",
    contactText: "Décrivez votre besoin, votre commune et le délai souhaité. Je vous réponds rapidement pour organiser un premier échange.",
    phone: "06 00 00 00 00",
    email: "contact@azur-piscines.fr",
    serviceArea: "Votre ville et alentours",
    openingHours: "Lun - Ven : 8h30 - 18h"
  },
  photos: [
    {
      id: "structure-bassin",
      title: "Structure de bassin en cours de construction",
      category: "Construction neuve",
      description: "Préparation du bassin, contrôle des niveaux et réservation des éléments techniques avant les finitions.",
      src: "assets/images/chantier-structure-bassin.png"
    },
    {
      id: "construction",
      title: "Piscine familiale avec plage bois",
      category: "Construction",
      description: "Bassin rectangulaire pensé pour un usage familial, avec accès confortable et terrasse bois.",
      src: "assets/images/catalogue-construction.png"
    },
    {
      id: "renovation",
      title: "Rénovation complète et nouveau liner",
      category: "Rénovation",
      description: "Remise à neuf du bassin, reprise des abords et modernisation de l'étanchéité.",
      src: "assets/images/catalogue-renovation.png"
    },
    {
      id: "liner",
      title: "Remplacement de liner et reprise des finitions",
      category: "Rénovation",
      description: "Pose d'un liner neuf avec contrôle des angles, de la ligne d'eau et des pièces à sceller.",
      src: "assets/images/renovation-liner.png"
    },
    {
      id: "local-technique",
      title: "Local technique avec filtration et traitement",
      category: "Équipements",
      description: "Installation propre de la pompe, du filtre, des vannes et du traitement pour simplifier l'entretien.",
      src: "assets/images/local-technique-filtration.png"
    },
    {
      id: "volet-securite",
      title: "Volet automatique et mise en sécurité",
      category: "Sécurité",
      description: "Ajout d'un volet automatique pour protéger le bassin, limiter les pertes de chaleur et sécuriser l'accès.",
      src: "assets/images/volet-securite.png"
    },
    {
      id: "mini-piscine",
      title: "Mini-piscine pour petit jardin",
      category: "Construction compacte",
      description: "Solution compacte pour profiter d'un vrai bassin dans un espace extérieur réduit.",
      src: "assets/images/mini-piscine.png"
    },
    {
      id: "entretien",
      title: "Remise en service et eau cristalline",
      category: "Entretien",
      description: "Nettoyage, contrôle de l'eau et vérification des équipements pour retrouver une piscine prête à l'usage.",
      src: "assets/images/catalogue-entretien.png"
    },
    {
      id: "mise-en-route",
      title: "Entretien saisonnier et mise en route",
      category: "Entretien",
      description: "Intervention de printemps avec contrôle du traitement, de la filtration et de la propreté du bassin.",
      src: "assets/images/entretien-mise-en-route.png"
    },
    {
      id: "pompe-a-chaleur",
      title: "Installation d'une pompe a chaleur piscine",
      category: "Confort et chauffage",
      description: "Raccordement d'un équipement de chauffage pour prolonger la saison de baignade.",
      src: "assets/images/pompe-a-chaleur.png"
    }
  ]
};

let state = loadState();

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaults));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return cloneDefaults();

  try {
    const parsed = JSON.parse(saved);
    return {
      content: { ...defaults.content, ...parsed.content },
      photos: normalizePhotos(Array.isArray(parsed.photos) && parsed.photos.length ? parsed.photos : defaults.photos)
    };
  } catch {
    return cloneDefaults();
  }
}

function normalizePhotos(photos) {
  return photos.map((photo) => ({
    ...photo,
    description: photo.description || ""
  }));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyContent() {
  document.querySelectorAll("[data-field]").forEach((node) => {
    const key = node.dataset.field;
    const value = state.content[key] || "";
    node.textContent = value;

    if (key === "phone" && node.tagName === "A") {
      node.href = `tel:${value.replace(/\s/g, "")}`;
    }

    if (key === "email" && node.tagName === "A") {
      node.href = `mailto:${value}`;
    }
  });
}

function galleryCard(photo) {
  const card = document.createElement("article");
  card.className = "gallery-card";
  card.innerHTML = `
    <img src="${photo.src}" alt="${escapeHtml(photo.title)}">
      <div>
        <h3>${escapeHtml(photo.title)}</h3>
        <p>${escapeHtml(photo.category)}</p>
        ${photo.description ? `<p class="gallery-description">${escapeHtml(photo.description)}</p>` : ""}
      </div>
  `;
  return card;
}

function renderGallery(selector, photos) {
  const gallery = document.querySelector(selector);
  if (!gallery) return;

  gallery.innerHTML = "";
  photos.forEach((photo) => gallery.appendChild(galleryCard(photo)));
}

function setupMobileGalleryToggle() {
  const gallery = document.querySelector("#full-gallery");
  const toggle = document.querySelector("#gallery-toggle");
  if (!gallery || !toggle) return;

  const mobileQuery = window.matchMedia("(max-width: 700px)");
  let expanded = false;

  function sync() {
    const cards = [...gallery.querySelectorAll(".gallery-card")];
    const shouldLimit = mobileQuery.matches && cards.length > 3;

    toggle.hidden = !shouldLimit;
    toggle.textContent = expanded ? "Voir moins" : "Voir plus";

    cards.forEach((card, index) => {
      card.hidden = shouldLimit && !expanded && index >= 3;
    });
  }

  toggle.addEventListener("click", () => {
    expanded = !expanded;
    sync();
    if (!expanded) gallery.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  mobileQuery.addEventListener("change", () => {
    expanded = false;
    sync();
  });

  sync();
}

function renderFeaturedCarousel(photos) {
  const track = document.querySelector("#featured-carousel");
  const dots = document.querySelector("#featured-carousel-dots");
  if (!track || !dots) return;

  let activeIndex = 0;
  const featuredPhotos = photos.slice(0, 3);

  track.innerHTML = "";
  dots.innerHTML = "";

  featuredPhotos.forEach((photo, index) => {
    const slide = document.createElement("article");
    slide.className = "carousel-slide";
    slide.setAttribute("aria-hidden", index === 0 ? "false" : "true");
    slide.innerHTML = `
      <img src="${photo.src}" alt="${escapeHtml(photo.title)}">
      <div class="carousel-caption">
        <p>${escapeHtml(photo.category)}</p>
        <h3>${escapeHtml(photo.title)}</h3>
        ${photo.description ? `<span>${escapeHtml(photo.description)}</span>` : ""}
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Voir le chantier ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.appendChild(dot);
  });

  const slides = [...track.querySelectorAll(".carousel-slide")];
  const dotButtons = [...dots.querySelectorAll(".carousel-dot")];

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", slideIndex === activeIndex ? "false" : "true");
    });
    dotButtons.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  document.querySelector("[data-carousel-prev]")?.addEventListener("click", () => showSlide(activeIndex - 1));
  document.querySelector("[data-carousel-next]")?.addEventListener("click", () => showSlide(activeIndex + 1));
  showSlide(0);
}

function renderAdminGallery() {
  const adminGallery = document.querySelector("#admin-gallery");
  if (!adminGallery) return;

  adminGallery.innerHTML = "";
  state.photos.forEach((photo, index) => {
    const item = document.createElement("article");
    item.className = "gallery-card admin-gallery-card";
    item.innerHTML = `
      <img src="${photo.src}" alt="${escapeHtml(photo.title)}">
      <div class="admin-card-body">
        <p class="admin-card-index">Position ${index + 1}${index < 3 ? " - Accueil" : ""}</p>
        <h3>${escapeHtml(photo.title)}</h3>
        <p>${escapeHtml(photo.category)}</p>
        ${photo.description ? `<p>${escapeHtml(photo.description)}</p>` : ""}
        <div class="photo-order-actions">
          <button type="button" title="Avancer dans la galerie" data-move="up" data-id="${photo.id}" ${index === 0 ? "disabled" : ""}>&larr;</button>
          <button type="button" title="Reculer dans la galerie" data-move="down" data-id="${photo.id}" ${index === state.photos.length - 1 ? "disabled" : ""}>&rarr;</button>
          <button type="button" data-edit="${photo.id}">Modifier</button>
          <button class="danger-button" type="button" data-delete="${photo.id}">Supprimer</button>
        </div>
      </div>
    `;
    adminGallery.appendChild(item);
  });
}

function movePhoto(id, direction) {
  const index = state.photos.findIndex((photo) => photo.id === id);
  if (index === -1) return;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= state.photos.length) return;

  const [photo] = state.photos.splice(index, 1);
  state.photos.splice(targetIndex, 0, photo);
  saveState();
  renderAdminGallery();
}

function addPhoto(form) {
  const formData = new FormData(form);
  const file = formData.get("image");
  const editingId = formData.get("id");

  if (editingId) {
    updatePhoto(form, formData, file);
    return;
  }

  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.photos.unshift({
      id: crypto.randomUUID(),
      title: formData.get("title").trim(),
      category: formData.get("category").trim(),
      description: formData.get("description").trim(),
      src: reader.result
    });
    saveState();
    renderAdminGallery();
    resetPhotoForm(form);
  });
  reader.readAsDataURL(file);
}

function updatePhoto(form, formData, file) {
  const photo = state.photos.find((item) => item.id === formData.get("id"));
  if (!photo) return;

  const applyUpdate = (src = photo.src) => {
    photo.title = formData.get("title").trim();
    photo.category = formData.get("category").trim();
    photo.description = formData.get("description").trim();
    photo.src = src;
    saveState();
    renderAdminGallery();
    resetPhotoForm(form);
  };

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.addEventListener("load", () => applyUpdate(reader.result));
    reader.readAsDataURL(file);
    return;
  }

  applyUpdate();
}

function editPhoto(id) {
  const photo = state.photos.find((item) => item.id === id);
  const form = document.querySelector("#photo-form");
  if (!photo || !form) return;

  form.elements.id.value = photo.id;
  form.elements.title.value = photo.title;
  form.elements.category.value = photo.category;
  form.elements.description.value = photo.description || "";
  form.elements.image.required = false;
  document.querySelector("#photo-submit").textContent = "Enregistrer les modifications";
  document.querySelector("#cancel-edit").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetPhotoForm(form) {
  form.reset();
  form.elements.id.value = "";
  form.elements.image.required = true;
  document.querySelector("#photo-submit").textContent = "Ajouter la photo";
  document.querySelector("#cancel-edit").hidden = true;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sha256(value) {
  const data = new TextEncoder().encode(String(value));
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function setupNavigation() {
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector("#main-nav");
  if (!menuButton || !nav) return;

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
}

function setupQuoteForm() {
  const quoteForm = document.querySelector("#quote-form");
  if (!quoteForm) return;

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(quoteForm);
    const subject = encodeURIComponent("Demande de devis piscine");
    const body = encodeURIComponent(
      `Nom: ${formData.get("name")}\nEmail: ${formData.get("email")}\nTéléphone: ${formData.get("phone")}\n\nDemande:\n${formData.get("message")}`
    );
    window.location.href = `mailto:${state.content.email}?subject=${subject}&body=${body}`;
    document.querySelector("#form-status").textContent = "Votre logiciel de messagerie va s'ouvrir avec la demande préremplie.";
    quoteForm.reset();
  });
}

function setupAdmin() {
  const loginForm = document.querySelector("#login-form");
  const adminPanel = document.querySelector("#admin-panel");
  if (!loginForm || !adminPanel) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = new FormData(loginForm).get("password");

    if (await sha256(password) !== DEMO_ACCESS_HASH) {
      document.querySelector("#login-error").textContent = "Mot de passe incorrect.";
      return;
    }

    document.querySelector("#login-error").textContent = "";
    loginForm.hidden = true;
    adminPanel.hidden = false;
    renderAdminGallery();
  });

  document.querySelector("#photo-form").addEventListener("submit", (event) => {
    event.preventDefault();
    addPhoto(event.currentTarget);
  });

  document.querySelector("#admin-gallery").addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete]");
    const moveButton = event.target.closest("[data-move]");
    const editButton = event.target.closest("[data-edit]");

    if (deleteButton) {
      state.photos = state.photos.filter((photo) => photo.id !== deleteButton.dataset.delete);
      saveState();
      renderAdminGallery();
      return;
    }

    if (moveButton) {
      movePhoto(moveButton.dataset.id, moveButton.dataset.move);
      return;
    }

    if (editButton) {
      editPhoto(editButton.dataset.edit);
    }
  });

  document.querySelector("#cancel-edit").addEventListener("click", () => {
    resetPhotoForm(document.querySelector("#photo-form"));
  });

  document.querySelector("#reset-gallery").addEventListener("click", () => {
    if (!confirm("Réinitialiser uniquement les photos de la galerie ?")) return;
    state.photos = cloneDefaults().photos;
    saveState();
    renderAdminGallery();
  });
}

applyContent();
setupNavigation();
setupQuoteForm();
setupAdmin();
renderGallery("#full-gallery", state.photos);
renderFeaturedCarousel(state.photos);
setupMobileGalleryToggle();

// Rzu-Informatique
