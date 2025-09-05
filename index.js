const AES_KEY = "12345678901234567890123456789012"; // 32 Zeichen

async function decryptAES(encryptedBase64, ivBase64, keyString) {
    const enc = new TextEncoder();
    const keyBuffer = enc.encode(keyString);

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );

    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
    const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        cryptoKey,
        data
    );

    const decoded = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decoded);
}

async function fetchData() {
    try {
        const response = await fetch('./api.php', {
            headers: {
                'apikey': 'DEIN_API_KEY_HIER'
            }
        });
        if (!response.ok) throw new Error("Fehler beim Abruf der API");

        const json = await response.json();
        const decrypted = await decryptAES(json.data, json.iv, AES_KEY);

        console.log("Decrypted API Data:", decrypted);

        // --- Logo setzen ---
        const logoEl = document.getElementById('logo');
        if (logoEl && decrypted.logo) {
            logoEl.innerHTML = `<img src="${decrypted.logo}" alt="Logo" style="max-width:100%;height:auto;">`;
        }

        // --- News anzeigen ---
        const newsEl = document.getElementById('news');
        if (newsEl && decrypted.news) {
            newsEl.innerHTML = decrypted.news.map(n => `
                <div class="news-item">
                    <h2>${n.name || ''}</h2>
                    <small>${n.date || ''}</small>
                    <p>${n.content || ''}</p>
                </div>
            `).join('');
        }

    } catch (err) {
        console.error("API-Fehler:", err);
    }
}

fetchData();
