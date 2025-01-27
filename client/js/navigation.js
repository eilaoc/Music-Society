document.addEventListener("DOMContentLoaded", () => {
    // toggle table of contents
    const tocButton = document.getElementById("table-of-contents-btn");
    const toc = document.getElementById("table-of-contents");
  
    tocButton.addEventListener("click", () => {
      toc.style.display = toc.style.display === "none" ? "block" : "none";
    });
  
    // navigate to other sections
    const navLinks = document.querySelectorAll(".nav-link");
  
    navLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const targetId = e.target.getAttribute("data-target");
  
        // hide sections
        document.querySelectorAll(".section").forEach(section => {
          section.style.display = "none";
        });
  
        // show section
        const targetSection = document.getElementById(targetId);
        targetSection.style.display = "block";
      });
    });
  });