/* ============================================
   NEXAVO AGENCY - PORTFOLIO MANAGER
   Add, Edit, Delete, LocalStorage, Search, Filter
   ============================================ */

// Portfolio Data Store
let portfolioProjects = [];

// Initialize Portfolio
function initPortfolio() {
  loadProjectsFromStorage();
  renderPortfolio();
  setupEventListeners();
}

// Load from localStorage
function loadProjectsFromStorage() {
  const stored = localStorage.getItem("nexavo_portfolio_projects");

  if (stored && JSON.parse(stored).length > 0) {
    portfolioProjects = JSON.parse(stored);
  } else {
    // Default demo projects
    portfolioProjects = [
      {
        id: Date.now() + 1,
        title: "School Management System",
        thumbnail: "/assets/SMS system", // screenshot image
        description:
          "Complete School Management System with student records, fee management, attendance tracking, and reporting.",
        technologies: ["React", "Node.js", "MySQL"],
        category: "webapp",
        client: "Personal Project",
        date: "2025",
      },
      {
        id: Date.now() + 2,
        title: "Luxury Hotel WordPress",
        thumbnail:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        description:
          "High-performance WordPress booking system with real-time availability, payment gateway, and custom theme design.",
        technologies: ["WordPress", "PHP", "WooCommerce"],
        category: "wordpress",
        client: "Grand Hotel Group",
        date: "2025",
      },
      {
        id: Date.now() + 3,
        title: "FinTech Desktop App",
        thumbnail:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
        description:
          "Cross-platform desktop application for real-time stock trading with advanced charting and analytics.",
        technologies: ["Electron", "React", "Node.js"],
        category: "desktop",
        client: "FinTech Startup",
        date: "2024",
      },
      {
        id: Date.now() + 4,
        title: "E-commerce Platform",
        thumbnail:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600",
        description:
          "Full-stack e-commerce solution with custom CMS, payment integration, and admin dashboard.",
        technologies: ["React", "Node.js", "MongoDB"],
        category: "fullstack",
        client: "Fashion Brand",
        date: "2025",
      },
      {
        id: Date.now() + 5,
        title: "AI Chatbot Integration",
        thumbnail:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
        description:
          "Custom AI chatbot for customer support with NLP capabilities and multi-language support.",
        technologies: ["Python", "TensorFlow", "React"],
        category: "fullstack",
        client: "Tech Corp",
        date: "2025",
      },
      {
        id: Date.now() + 6,
        title: "Portfolio Website - Framer",
        thumbnail:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
        description:
          "Stunning animated portfolio website built with Framer and custom code integration.",
        technologies: ["Framer", "HTML/CSS", "GSAP"],
        category: "framer",
        client: "Creative Agency",
        date: "2024",
      },
    ];
    saveProjects();
  }
}

// Save to localStorage
function saveProjects() {
  localStorage.setItem(
    "nexavo_portfolio_projects",
    JSON.stringify(portfolioProjects),
  );
  updateProjectCount();
}

// Render Portfolio Grid
function renderPortfolio(filterCategory = "all", searchTerm = "") {
  const container = document.getElementById("portfolioGridContainer");
  if (!container) return;

  let filteredProjects = [...portfolioProjects];

  // Apply category filter
  if (filterCategory !== "all") {
    filteredProjects = filteredProjects.filter(
      (p) => p.category === filterCategory,
    );
  }

  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.technologies.some((tech) => tech.toLowerCase().includes(term)),
    );
  }

  if (filteredProjects.length === 0) {
    container.innerHTML = `
            <div class="empty-portfolio">
                <i class="fas fa-folder-open"></i>
                <h3>No Projects Found</h3>
                <p>Add your first project using the form above!</p>
            </div>
        `;
    return;
  }

  container.innerHTML = filteredProjects
    .map(
      (project) => `
        <div class="portfolio-card" data-id="${project.id}" data-aos="fade-up">
            <div class="portfolio-image">
                <img src="${project.thumbnail}" alt="${project.title}" onerror="this.src='https://placehold.co/600x400/1E2A3A/3E64FF?text=Project'">
                <div class="portfolio-overlay">
                    <button class="portfolio-view-btn" onclick="viewProject(${project.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="portfolio-edit-btn" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="portfolio-delete-btn" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="portfolio-content">
                <span class="portfolio-category">${getCategoryLabel(project.category)}</span>
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description.substring(0, 100))}${project.description.length > 100 ? "..." : ""}</p>
                <div class="portfolio-tech">
                    ${project.technologies.map((tech) => `<span>${escapeHtml(tech)}</span>`).join("")}
                </div>
                <div class="portfolio-meta">
                    <span><i class="far fa-calendar"></i> ${project.date}</span>
                    <span><i class="far fa-user"></i> ${escapeHtml(project.client)}</span>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  // Re-initialize AOS for new elements
  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }
}

// Get category label
function getCategoryLabel(category) {
  const labels = {
    fullstack: "Fullstack Web",
    wordpress: "WordPress",
    framer: "Framer",
    desktop: "Desktop App",
    erpnext: "ERPNext",
  };
  return labels[category] || "Project";
}

// Add New Project
function addProject(projectData) {
  const newProject = {
    id: Date.now(),
    title: projectData.title,
    thumbnail: projectData.thumbnail,
    description: projectData.description,
    technologies: projectData.technologies.split(",").map((t) => t.trim()),
    category: projectData.category,
    client: projectData.client,
    date: new Date().getFullYear().toString(),
  };

  portfolioProjects.unshift(newProject);
  saveProjects();
  renderPortfolio();

  // Show success message
  showNotification("Project added successfully!", "success");
}

// Delete Project
window.deleteProject = function (id) {
  if (confirm("Are you sure you want to delete this project?")) {
    portfolioProjects = portfolioProjects.filter((p) => p.id !== id);
    saveProjects();
    renderPortfolio();
    showNotification("Project deleted successfully!", "success");
  }
};

// Edit Project
window.editProject = function (id) {
  const project = portfolioProjects.find((p) => p.id === id);
  if (!project) return;

  // Populate edit form
  document.getElementById("editProjectId").value = project.id;
  document.getElementById("editTitle").value = project.title;
  document.getElementById("editThumbnail").value = project.thumbnail;
  document.getElementById("editDescription").value = project.description;
  document.getElementById("editTechnologies").value =
    project.technologies.join(", ");
  document.getElementById("editCategory").value = project.category;
  document.getElementById("editClient").value = project.client;

  // Show modal
  document.getElementById("editModal").classList.add("active");
};

// Update Project
function updateProject() {
  const id = parseInt(document.getElementById("editProjectId").value);
  const index = portfolioProjects.findIndex((p) => p.id === id);

  if (index !== -1) {
    portfolioProjects[index] = {
      ...portfolioProjects[index],
      title: document.getElementById("editTitle").value,
      thumbnail: document.getElementById("editThumbnail").value,
      description: document.getElementById("editDescription").value,
      technologies: document
        .getElementById("editTechnologies")
        .value.split(",")
        .map((t) => t.trim()),
      category: document.getElementById("editCategory").value,
      client: document.getElementById("editClient").value,
    };

    saveProjects();
    renderPortfolio();
    closeModal();
    showNotification("Project updated successfully!", "success");
  }
}

// View Project Details
window.viewProject = function (id) {
  const project = portfolioProjects.find((p) => p.id === id);
  if (!project) return;

  const modalContent = document.getElementById("viewModalContent");
  modalContent.innerHTML = `
        <div class="view-project">
            <img src="${project.thumbnail}" alt="${project.title}" style="width:100%; border-radius:20px; margin-bottom:20px;">
            <h2>${escapeHtml(project.title)}</h2>
            <div class="view-meta">
                <span><strong>Category:</strong> ${getCategoryLabel(project.category)}</span>
                <span><strong>Client:</strong> ${escapeHtml(project.client)}</span>
                <span><strong>Year:</strong> ${project.date}</span>
            </div>
            <p><strong>Description:</strong> ${escapeHtml(project.description)}</p>
            <div class="view-tech">
                <strong>Technologies:</strong>
                ${project.technologies.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}
            </div>
        </div>
    `;

  document.getElementById("viewModal").classList.add("active");
};

// Close Modals
function closeModal() {
  document.getElementById("editModal")?.classList.remove("active");
  document.getElementById("viewModal")?.classList.remove("active");
}

// Show Notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i>
        <span>${message}</span>
    `;
  notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === "success" ? "#10B981" : "#3E64FF"};
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
  // Add project form
  const addBtn = document.getElementById("addProjectBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const title = document.getElementById("projectTitle")?.value.trim();
      const thumbnail = document.getElementById("projectThumb")?.value.trim();
      const description = document.getElementById("projectDesc")?.value.trim();
      const technologies = document.getElementById("projectTech")?.value.trim();
      const category = document.getElementById("projectCategory")?.value;
      const client = document.getElementById("projectClient")?.value.trim();

      if (!title || !thumbnail) {
        showNotification("Please fill Title and Thumbnail URL", "error");
        return;
      }

      addProject({
        title,
        thumbnail,
        description: description || "No description provided.",
        technologies: technologies || "Web Development",
        category: category || "fullstack",
        client: client || "Nexavo Client",
      });

      // Clear form
      document.getElementById("projectTitle").value = "";
      document.getElementById("projectThumb").value = "";
      document.getElementById("projectDesc").value = "";
      document.getElementById("projectTech").value = "";
      document.getElementById("projectClient").value = "";
    });
  }

  // Filter buttons
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      const searchTerm = document.getElementById("searchProjects")?.value || "";
      renderPortfolio(category, searchTerm);
    });
  });

  // Search input
  const searchInput = document.getElementById("searchProjects");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const activeFilter =
        document
          .querySelector(".filter-btn.active")
          ?.getAttribute("data-filter") || "all";
      renderPortfolio(activeFilter, e.target.value);
    });
  }

  // Modal close buttons
  document.querySelectorAll(".modal-close, .modal-overlay").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  // Update button in edit modal
  const updateBtn = document.getElementById("updateProjectBtn");
  if (updateBtn) {
    updateBtn.addEventListener("click", updateProject);
  }
}

// Update project count
function updateProjectCount() {
  const countElement = document.getElementById("projectCount");
  if (countElement) {
    countElement.textContent = portfolioProjects.length;
  }
}

// Escape HTML
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Initialize when DOM ready
document.addEventListener("DOMContentLoaded", initPortfolio);
