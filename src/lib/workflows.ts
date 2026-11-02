import type { NavIcon } from "@/lib/navigation";

/** Phase 0 design summaries; no executable domain behavior is implied. */
export const workflows: Record<NavIcon, readonly string[]> = {
  dashboard: ["Authorize an active membership and required MFA assurance.", "Load only permitted, source-labelled operational metrics.", "Review freshness and drill into the responsible module."],
  zones: ["Import an approved official geography release.", "Establish district command membership and delegated scope.", "Review coverage without granting cross-zone access."],
  agents: ["Verify observer identity and active organizational membership.", "Assign jurisdiction scope and election responsibilities.", "Track availability and reporting completeness—not political preference."],
  staff: ["Verify staff membership and assign least-privilege functional roles.", "Enforce scope and MFA in server and database policies.", "Preserve appointment, revocation and privileged-action history."],
  reports: ["Create a structured observation with an idempotency key.", "Confirm durable server receipt separately from local saving.", "Preserve corrections as versions and record authorized review decisions."],
  results: ["Distinguish agent transcription from an authenticated official document.", "Preserve observed figures and supporting provenance.", "Review reported, verified, disputed, pending and officially published states separately."],
  incidents: ["Record an observation or allegation without declaring an offence.", "Triage safely and assign an authorized response owner.", "Escalate and resolve with a preserved decision history."],
  emergency: ["Make an explicit request through an authorized channel.", "Distinguish sending, receipt and acknowledgement.", "Coordinate assistance while retaining direct emergency alternatives."],
  messages: ["Select an authorized assignment or command conversation.", "Enforce active membership on messages and realtime connections.", "Retain permitted delivery state without claiming end-to-end encryption."],
  gis: ["Validate an approved geography release and provenance.", "Render only authorized operational layers.", "Treat coordinates as approximate unless accuracy is independently established."],
  evidence: ["Capture or select evidence without endangering the observer.", "Hash and preserve the immutable original with restricted access.", "Use authorized signed URLs and record custody and access events."],
  analytics: ["Aggregate permitted records with explicit denominators and freshness.", "Measure reporting completeness, timeliness and compliance.", "Exclude political loyalty, preference and allegation-count rankings."],
  audit: ["Record meaningful actions in an append-only audit trail.", "Restrict review to authorized security and oversight roles.", "Export reproducible evidence with access accountability."],
  security: ["Enforce verified identity, active membership and MFA.", "Review sessions, access changes and security events.", "Revoke authorization and require realtime reconnection where applicable."],
  backups: ["Protect database and private object storage independently.", "Record backup manifests and restore-drill evidence.", "Reconcile references after restore without overwriting production."],
  settings: ["Require authorized configuration changes and explicit approval.", "Validate election, geography and provider settings before activation.", "Retain a versioned configuration and change history."],
  assignment: ["Load the observer’s active, effective-dated assignment.", "Display official geography identifiers without invented locations.", "Use transparent, optional GPS only for assignment verification."],
  checkin: ["Confirm assignment and explicit observer intent.", "Offer optional location with visible purpose and accuracy information.", "Confirm server receipt without continuous location tracking."],
  media: ["Select only necessary media and disclose personal-data risks.", "Preserve original bytes and a verifiable integrity hash.", "Track upload progress and recover interrupted transfers safely."],
  alerts: ["Review direct emergency options and safety guidance.", "Make an explicit request if the authorized service is available.", "Show sending, server receipt and acknowledgement as distinct states."],
  history: ["Load only the observer’s own submissions and receipts.", "Show current review state and preserved correction versions.", "Expose failed or pending work without claiming delivery."],
  profile: ["Load the authenticated user’s minimized profile.", "Allow only authorized contact and preference changes.", "Retain accountability for security-sensitive updates."],
  sync: ["Show device-local drafts and pending actions transparently.", "Retry authorized operations with idempotency after connectivity returns.", "Confirm server receipts before removing pending work."],
};
