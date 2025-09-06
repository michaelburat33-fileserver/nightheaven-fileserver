const API_KEY = "DEIN_SECRET_API_KEY";

function loadDataXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://127.0.0.1:3000/api/v1/data", true);
  xhr.setRequestHeader("X-API-KEY", API_KEY);
  xhr.setRequestHeader("Accept", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          renderPage(data);
        } catch (err) {
          console.error("Fehler beim Parsen der Daten:", err);
          document.getElementById("root").innerHTML = "<p>Fehler beim Laden der Seite.</p>";
        }
      } else {
        console.error("Fehler beim Laden der Daten:", xhr.status);
        document.getElementById("root").innerHTML = "<p>Fehler beim Laden der Seite.</p>";
      }
    }
  };

  xhr.send();
}

function renderPage(data) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  // Header mit Logo & Navigation
  const header = document.createElement("header");

  // Logo
  const logo = document.createElement("img");
  logo.id = "logo";
  logo.src = data.logo || "";
  logo.alt = "Logo";
  header.appendChild(logo);

  // Navigation
  const nav = document.createElement("nav");
  if (data.navigation) {
    data.navigation.forEach(item => {
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.name;
      nav.appendChild(a);
    });
  }
  header.appendChild(nav);
  root.appendChild(header);

  // Mitglieder Section
  const membersSection = document.createElement("section");
  membersSection.id = "members";
  const membersTitle = document.createElement("h2");
  membersTitle.textContent = "Mitglieder";
  membersSection.appendChild(membersTitle);

  if (data.mitglieder) {
    data.mitglieder.forEach(m => {
      const div = document.createElement("div");
      div.className = "member";
      div.innerHTML = `
        <img src="${m.src || './assets/default.png'}" alt="${m.name || '?'}" />
        <h4>${m.name || '?'}</h4>
        <p>${m.rolle || ''}</p>
        <p>${m.content || ''}</p>
      `;
      membersSection.appendChild(div);
    });
  }
  root.appendChild(membersSection);

  // News Section
  const newsSection = document.createElement("section");
  newsSection.id = "news";
  const newsTitle = document.createElement("h2");
  newsTitle.textContent = "Neuigkeiten";
  newsSection.appendChild(newsTitle);

  if (data.news) {
    data.news.forEach(n => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `<h3>${n.name}</h3><small>${n.date || ''}</small>`;
      newsSection.appendChild(div);
    });
  }
  root.appendChild(newsSection);

  // Tour Section
  const tourSection = document.createElement("section");
  tourSection.id = "tour";
  const tourTitle = document.createElement("h2");
  tourTitle.textContent = "Tour";
  tourSection.appendChild(tourTitle);

  if (data.tour) {
    data.tour.forEach(t => {
      const div = document.createElement("div");
      div.className = "tour-item";
      div.innerHTML = `<span>${t.date || ''}</span> - <strong>${t.Name || t.name || ''}</strong>`;
      tourSection.appendChild(div);
    });
  }
  root.appendChild(tourSection);

  // Social Section
  const socialSection = document.createElement("section");
  socialSection.id = "social";
  const socialTitle = document.createElement("h2");
  socialTitle.textContent = "Social";
  socialSection.appendChild(socialTitle);

  if (data.social) {
    data.social.forEach(s => {
      const a = document.createElement("a");
      a.href = s.href || "#";
      a.target = "_blank";
      const img = document.createElement("img");
      img.src = s.src || "./assets/default.png";
      img.alt = s.name || "";
      img.width = 24;
      img.height = 24;
      a.appendChild(img);
      socialSection.appendChild(a);
    });
  }
  root.appendChild(socialSection);

  // Video Section
  const videoSection = document.createElement("section");
  videoSection.id = "video";
  const videoTitle = document.createElement("h2");
  videoTitle.textContent = "Video";
  videoSection.appendChild(videoTitle);

  if (data.video) {
    data.video.forEach(v => {
      const iframe = document.createElement("iframe");
      iframe.src = v.src || "";
      iframe.width = "560";
      iframe.height = "315";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      videoSection.appendChild(iframe);
    });
  }
  root.appendChild(videoSection);

  // Header Image
  if (data.header) {
    const headerImg = document.createElement("img");
    headerImg.id = "header";
    headerImg.src = data.header;
    headerImg.alt = "Header";
    root.appendChild(headerImg);
  }

  // Favicon setzen
  if (data.favicon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = data.favicon;
  }
}

// XHR aufrufen, sobald DOM fertig
document.addEventListener("DOMContentLoaded", loadDataXHR);
