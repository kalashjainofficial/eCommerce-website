export  const goToCategory = (category) => {
  const element = document.getElementById(category);

  if (element) {
    const navbarOffset = 150;

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;

    const offsetPosition =
      elementPosition - navbarOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};