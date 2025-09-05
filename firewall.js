/**
 * firewall.js
 * 
 * Professionelle Firewall-Simulation für NIS2 & ISO27001 Compliance
 * Reines JavaScript (kein Node.js)
 * 
 * Features:
 * - Whitelist / Blacklist
 * - Protokollprüfung
 * - Verbindungslimits
 * - Audit-Logging in-memory
 */

const firewallConfig = {
    allowedIPs: ['192.168.0.1', '10.0.0.0/24'],
    blockedIPs: ['123.123.123.123'],
    allowedProtocols: ['HTTP', 'HTTPS', 'SSH'],
    maxConnectionsPerIP: 100
};

// In-Memory Audit-Log
let auditLog = [];

// Verbindungs-Tracking
let connectionTracker = {};

// ===========================
// Hilfsfunktionen
// ===========================

function logEvent(event) {
    const timestamp = new Date().toISOString();
    auditLog.push(`[${timestamp}] ${event}`);
    console.log(`[${timestamp}] ${event}`);
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

// ===========================
// Firewall Kernlogik
// ===========================

function handleConnection(connection) {
    const { ip, protocol } = connection;

    // Blockierte IPs
    if (firewallConfig.blockedIPs.includes(ip)) {
        logEvent(`BLOCKED IP ${ip} versuchte Verbindung mit ${protocol}`);
        return false;
    }

    // Protokollprüfung
    if (!firewallConfig.allowedProtocols.includes(protocol)) {
        logEvent(`UNAUTHORIZED PROTOCOL ${protocol} von ${ip}`);
        return false;
    }

    // Max. Connections pro IP
    connectionTracker[ip] = (connectionTracker[ip] || 0) + 1;
    if (connectionTracker[ip] > firewallConfig.maxConnectionsPerIP) {
        logEvent(`DoS VERDACHT: ${ip} überschreitet maximale Verbindungen`);
        return false;
    }

    // Whitelist-Prüfung
    if (!isIPAllowed(ip)) {
        logEvent(`UNAUTHORIZED IP ${ip} versucht Zugriff`);
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
// Demo
// ===========================

const demoConnections = [
    { ip: '192.168.0.1', protocol: 'HTTP' },
    { ip: '123.123.123.123', protocol: 'SSH' },
    { ip: '10.0.0.5', protocol: 'HTTPS' },
    { ip: '8.8.8.8', protocol: 'FTP' }
];

demoConnections.forEach(handleConnection);
generateAuditReport();
