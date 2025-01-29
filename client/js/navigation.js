// toggle table of contents
document.getElementById("table-of-contents-btn").addEventListener('click', () => {
  let toc = document.getElementById("table-of-contents");
  toc.style.display = toc.style.display === "none" ? "block" : "none";
});

// show/hide sections
document.body.addEventListener("click", (e) => {
  let target = e.target;

  if (target.hasAttribute("data-target")) {
      e.preventDefault();
      let targetId = target.getAttribute("data-target");


      document.querySelectorAll(".section").forEach(section => section.style.display = "none");

      let targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.style.display = "block";
  }
});