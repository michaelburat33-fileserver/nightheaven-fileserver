// ===========================
// Firewall-Konfiguration
// ===========================
const firewallConfig = {
    allowedIPs: ['192.168.0.1', '10.0.0.0/24'],
    blockedIPs: ['123.123.123.123'],
    allowedProtocols: ['HTTP'], // Nur HTTP erlaubt
    maxConnectionsPerIP: 100,
    leakKeywords: ["Canvas text","fetch API","WebGL","Local Storage","Cookies","Battery API","Web Audio API"],
    malwarePatterns: ["eval(", "atob(", "document.write(", "unescape(", "setTimeout(", "setInterval("],
    botPatterns: ["curl", "wget", "bot", "spider", "crawler", "python-requests"]
};

// Audit-Log & Connection Tracker
let auditLog = [];
let connectionTracker = {};

// ===========================
// Hilfsfunktionen
// ===========================
function logEvent(event) {
    const timestamp = new Date().toISOString();
    const msg = `[${timestamp}] ${event}`;
    auditLog.push(msg);
    console.log(msg);
    document.getElementById('logContainer').innerText = auditLog.join("\n");
}

function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}

function ipInCIDR(ip, cidr) {
    const [range, bits] = cidr.split('/');
    const ipNum = ipToInt(ip);
    const rangeNum = ipToInt(range);
    const mask = -1 << (32 - parseInt(bits));
    return (ipNum & mask) === (rangeNum & mask);
}

function isIPAllowed(ip) {
    return firewallConfig.allowedIPs.some(allowed => {
        if (allowed.includes('/')) return ipInCIDR(ip, allowed);
        return ip === allowed;
    });
}

function containsLeakKeyword(str) {
    return firewallConfig.leakKeywords.some(keyword => str.includes(keyword));
}

function containsMalwarePattern(str) {
    return firewallConfig.malwarePatterns.some(pattern => str.includes(pattern));
}

function containsBotPattern(str) {
    return firewallConfig.botPatterns.some(pattern => str.toLowerCase().includes(str.toLowerCase()));
}

// ===========================
// Firewall-Kernlogik
// ===========================
function handleConnection(connection) {
    const { ip, protocol, payload } = connection;

    if (firewallConfig.blockedIPs.includes(ip)) {
        logEvent(`BLOCKED IP ${ip} versuchte Verbindung mit ${protocol}`);
        return false;
    }

    if (!firewallConfig.allowedProtocols.includes(protocol)) {
        logEvent(`BLOCKED PROTOCOL ${protocol} von ${ip} – nur HTTP erlaubt`);
        return false;
    }

    connectionTracker[ip] = (connectionTracker[ip] || 0) + 1;
    if (connectionTracker[ip] > firewallConfig.maxConnectionsPerIP) {
        logEvent(`DoS VERDACHT: ${ip} überschreitet maximale Verbindungen`);
        return false;
    }

    if (!isIPAllowed(ip)) {
        logEvent(`UNAUTHORIZED IP ${ip} versucht Zugriff`);
        return false;
    }

    if (payload && containsLeakKeyword(payload)) {
        logEvent(`LEAK KEYWORD DETECTED von ${ip}: ${payload}`);
        return false;
    }

    if (payload && containsMalwarePattern(payload)) {
        logEvent(`MALWARE PATTERN DETECTED von ${ip}: ${payload}`);
        return false;
    }

    if (payload && containsBotPattern(payload)) {
        logEvent(`BOT DETECTED von ${ip}: ${payload}`);
        return false;
    }

    logEvent(`ALLOWED ${ip} mit ${protocol}`);
    return true;
}

// ===========================
// Audit-Report
// ===========================
function generateAuditReport() {
    logEvent("=== AUDIT REPORT START ===");
    logEvent(JSON.stringify({ connections: { ...connectionTracker } }, null, 2));
    logEvent("=== AUDIT REPORT END ===");
}

// ===========================
// Demo-Verbindungen
// ===========================
function runDemo() {
    const demoConnections = [
        { ip: '192.168.0.1', protocol: 'HTTP', payload: "normal HTTP traffic" },
        { ip: '10.0.0.5', protocol: 'HTTPS', payload: "HTTPS traffic" },
        { ip: '192.168.0.2', protocol: 'FTP', payload: "FTP traffic" },
        { ip: '123.123.123.123', protocol: 'HTTP', payload: "malware eval(document.cookie)" },
        { ip: '192.168.0.3', protocol: 'HTTP', payload: "Canvas text" } // Leak keyword
    ];

    demoConnections.forEach(handleConnection);
    generateAuditReport();
}

// Demo automatisch beim Laden der Seite starten
window.onload = runDemo;
