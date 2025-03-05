document.addEventListener("DOMContentLoaded", () => {
    const bannerWrapper = document.querySelector(".side-banner-wrapper");
    if (bannerWrapper) {
      const bg = bannerWrapper.getAttribute("data-bg");
      if (bg) {
        document.documentElement.style.setProperty('--side-banner-bg', `url(${bg})`);
      }
    }
  });
  