

(function () {
    "use strict";

    var TEAM_MEMBERS = [
        {
            slug: "antonio",
            name: "Antonio M.",
            fullName: "José Antonio Martínez Torres",
            role: "Product Owner",
            img: "../images/team/antonio-v2.webp",
        },
        {
            slug: "azul",
            name: "Azúl P.",
            fullName: "Azúl Alcatraz Pineda Güereca",
            role: "Scrum Master",
            img: "../images/team/azul.webp",
        },
        {
            slug: "julio",
            name: "Julio S.",
            fullName: "Julio Alberto Sanchez Morfín",
            role: "Development",
            img: "../images/team/julio.webp",
        },
        {
            slug: "cleyri",
            name: "Cleyri S.",
            fullName: "Cleyri Solano García",
            role: "Development",
            img: "../images/team/cleyri-solano.webp",
        },
        {
            slug: "daniela",
            name: "Daniela H.",
            fullName: "Daniela Hernandez Santillán",
            role: "Development",
            img: "../images/team/Daniela.webp",
        },
        {
            slug: "diego",
            name: "Diego E.",
            fullName: "Diego Gerardo Estrada Morales",
            role: "Development",
            img: "../images/team/DGEM.webp",
        },
        {
            slug: "edwin",
            name: "Edwin S.",
            fullName: "Edwin Eduardo Sánchez Aguilar",
            role: "Development",
            img: "../images/team/edwinS.webp",
        },
        {
            slug: "erick",
            name: "Erick M.",
            fullName: "Erick Martínez Candelario",
            role: "Development",
            img: "../images/team/erik.webp",
        },
    ];

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function buildPortrait(m) {
        return (
            '<article class="team-portrait team-portrait--' +
            escapeHtml(m.slug) +
            '" role="listitem">' +
            '<div class="team-portrait__frame"><div class="team-portrait__mat">' +
            '<img class="team-portrait__photo" src="' +
            escapeHtml(m.img) +
            '" alt="' +
            escapeHtml(m.fullName) +
            '" loading="lazy" decoding="async">' +
            "</div></div>" +
            '<div class="team-portrait__plaque">' +
            '<h3 class="team-portrait__name">' +
            escapeHtml(m.name) +
            "</h3>" +
            '<p class="team-portrait__role" aria-label="' +
            escapeHtml(m.role) +
            '">' +
            escapeHtml(m.role) +
            "</p>" +
            "</div></article>"
        );
    }

    document.addEventListener("DOMContentLoaded", function () {
        var gallery = document.getElementById("team-gallery");
        if (!gallery || !document.getElementById("team")) return;

        gallery.innerHTML = TEAM_MEMBERS.map(buildPortrait).join("");

        if (window.LuddiesI18n && typeof window.LuddiesI18n.applyTranslations === "function") {
            window.LuddiesI18n.applyTranslations(window.LuddiesI18n.getLang());
        }
    });
})();
