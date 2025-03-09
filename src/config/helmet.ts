import { HelmetOptions } from 'react-helmet-async';

export const helmetConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://biyquxchwahdqyqlsahm.supabase.co"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
  originAgentCluster: "?1",
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  strictTransportSecurity: {
    maxAge: 15552000,
    includeSubDomains: true,
    preload: true,
  },
  xContentTypeOptions: true,
  xDNSPrefetchControl: { allow: false },
  xDownloadOptions: true,
  xFrameOptions: { action: "deny" },
  xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
  xXSSProtection: true,
}; 