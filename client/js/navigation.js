document.addEventListener("DOMContentLoaded", () => {
    // toggle table of contents
    const tocButton = document.getElementById("table-of-contents-btn");
    const toc = document.getElementById("table-of-contents");
  
    tocButton.addEventListener("click", () => {
      toc.style.display = toc.style.display === "none" ? "block" : "none";
    });
  
    // show/hide items
    document.body.addEventListener("click", (e) => {
      const target = e.target;

      
      if (target.hasAttribute("data-target")) {
          e.preventDefault();
          const targetId = target.getAttribute("data-target");

          // hide
          document.querySelectorAll(".section").forEach(section => {
              section.style.display = "none";  
          });

          // show
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
              targetSection.style.display = "block";  
          }
      }
  });
});