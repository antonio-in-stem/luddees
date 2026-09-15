

document.addEventListener("DOMContentLoaded", function () {
    const fadeElements = document.querySelectorAll(".fade-in");
    if (!fadeElements.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        fadeElements.forEach(function (element) { element.classList.add("active"); });
        return;
    }

    const observer = new IntersectionObserver(
        function (entries, activeObserver) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("active");
                activeObserver.unobserve(entry.target);
            });
        },
        { threshold: 0, rootMargin: "0px" }
    );

    fadeElements.forEach(function (element) {
        observer.observe(element);
    });
});
