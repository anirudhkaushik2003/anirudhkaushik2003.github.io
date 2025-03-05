document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".background-wrapper").forEach((el) => {
      const bg = el.getAttribute("data-bg");
      if (bg) {
        el.style.backgroundImage = `url(${bg})`;
      }
    });
  });