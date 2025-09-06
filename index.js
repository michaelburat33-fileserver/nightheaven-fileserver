const root = document.getElementById('root');
root.innerHTML = `
  <div class="top" id="social"></div>
  <div class="wrapper">
    <div class="newstouer">
      <div id="news"></div>
      <div id="placeholder"></div>
      <div id="tour"></div>
    </div>
  </div>
`;

const API_KEY = "DEIN_SECRET_API_KEY";

async function loadData() {
  try {
    const response = await fetch('/api/v1/data', {
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Fehler beim Laden der Daten: ${response.status}`);
    const data = await response.json();
    renderPage(data);

  } catch (err) {
    console.error(err);
    document.getElementById('root').innerHTML = '<p>Fehler beim Laden der Seite.</p>';
  }
}

function renderPage(data) {
  const root = document.getElementById('root');
  root.innerHTML = '';

  // Header mit Logo & Navigation
  const header = document.createElement('header');

  // Logo
  const logo = document.createElement('img');
  logo.id = 'logo';
  logo.src = data.logo || '';
  logo.alt = 'Logo';
  header.appendChild(logo);

  // Navigation
  const nav = document.createElement('nav');
  if (data.navigation) {
    data.navigation.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.name;
      nav.appendChild(a);
    });
  }
  header.appendChild(nav);
  root.appendChild(header);

  // News Section
  const newsSection = document.createElement('section');
  newsSection.id = 'news';
  const newsTitle = document.createElement('h2');
  newsTitle.textContent = 'Neuigkeiten';
  newsSection.appendChild(newsTitle);

  if (data.news) {
    data.news.forEach(n => {
      const div = document.createElement('div');
      div.className = 'news-item';
      div.innerHTML = `<h3>${n.name}</h3><small>${n.date || ''}</small>`;
      newsSection.appendChild(div);
    });
  }
  root.appendChild(newsSection);

  // Mitglieder Section
  const membersSection = document.createElement('section');
  membersSection.id = 'members';
  const membersTitle = document.createElement('h2');
  membersTitle.textContent = 'Mitglieder';
  membersSection.appendChild(membersTitle);

  if (data.mitglieder) {
    data.mitglieder.forEach(m => {
      const div = document.createElement('div');
      div.className = 'member';
      div.innerHTML = `<img src="${m.src || './assets/default.png'}" alt="${m.name || '?'}" />
                       <h4>${m.name || '?'}</h4>
                       <p>${m.rolle || ''}</p>
                       <p>${m.content || ''}</p>`;
      membersSection.appendChild(div);
    });
  }
  root.appendChild(membersSection);

  // Social Section
  const socialSection = document.createElement('section');
  socialSection.id = 'social';
  const socialTitle = document.createElement('h2');
  socialTitle.textContent = 'Social';
  socialSection.appendChild(socialTitle);

  if (data.social) {
    data.social.forEach(s => {
      const a = document.createElement('a');
      a.href = s.href || '#';
      a.target = '_blank';
      const img = document.createElement('img');
      img.src = s.src || './assets/default.png';
      img.alt = s.name || '';
      img.width = 24;
      img.height = 24;
      a.appendChild(img);
      socialSection.appendChild(a);
    });
  }
  root.appendChild(socialSection);

  // Favicon setzen
  if (data.favicon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = data.favicon;
  }

  // Tour Section
  const tourSection = document.getElementById('tour');
  if (data.tour) {
    tourSection.innerHTML = '';
    data.tour.forEach(t => {
      const div = document.createElement('div');
      div.className = 'tour-item';
      div.innerHTML = `<span>${t.date || ''}</span> - <strong>${t.Name || t.name || ''}</strong>`;
      tourSection.appendChild(div);
    });
  }
}

document.addEventListener('DOMContentLoaded', loadData);
