export type Workspace = "central" | "zone" | "field";
export type NavIcon = "dashboard" | "zones" | "agents" | "staff" | "reports" | "results" | "incidents" | "emergency" | "messages" | "gis" | "evidence" | "analytics" | "audit" | "security" | "backups" | "settings" | "assignment" | "checkin" | "media" | "alerts" | "history" | "profile" | "sync";
export interface RouteDefinition {
  readonly workspace: Workspace;
  readonly path: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly icon: NavIcon;
  readonly phase: number;
  readonly permission: string;
  readonly group: "Operations" | "Intelligence" | "Governance" | "Field work" | "Account";
}

type ModuleInput = readonly [slug: string, title: string, description: string, icon: NavIcon, phase: number, permission: string, group: RouteDefinition["group"]];
const centralModules: readonly ModuleInput[] = [
  ["dashboard", "Command overview", "Statewide observation coverage, review workload and operational readiness.", "dashboard", 9, "analytics.read", "Operations"],
  ["zones", "Senatorial zones", "Compare the three senatorial command structures and drill into authorized coverage.", "zones", 3, "geography.read", "Operations"],
  ["agents", "Field agents", "Verify personnel, monitor availability and review assignment coverage.", "agents", 3, "personnel.read", "Operations"],
  ["staff", "Staff & access", "Manage scoped staff roles, verification and delegated administration.", "staff", 3, "personnel.read", "Governance"],
  ["reports", "Situation reports", "Review structured field observations and versioned verification decisions.", "reports", 4, "reports.read", "Operations"],
  ["results", "Result observations", "Review agent-transcribed figures separately from official publications.", "results", 8, "results.read", "Operations"],
  ["incidents", "Incident response", "Triage allegations, assign responders and track escalation without assigning guilt.", "incidents", 5, "incidents.read", "Operations"],
  ["emergency", "Emergency alerts", "Acknowledge and coordinate urgent assistance through authorized command.", "emergency", 5, "emergency.read", "Operations"],
  ["messages", "Communications", "Private, membership-authorized conversations between field and command.", "messages", 7, "communications.use", "Operations"],
  ["gis", "Operational map", "Explore validated geography and authorized reporting coverage.", "gis", 9, "gis.read", "Intelligence"],
  ["evidence", "Evidence repository", "Preserve original media, integrity hashes and a traceable chain of custody.", "evidence", 6, "evidence.read", "Intelligence"],
  ["analytics", "Operational analytics", "Measure reporting completeness and response performance, not political preference.", "analytics", 9, "analytics.read", "Intelligence"],
  ["audit", "Audit trail", "Review accountable personnel, record and privileged-action history.", "audit", 10, "audit.read", "Governance"],
  ["security", "Security center", "Review access anomalies, security events and system health.", "security", 10, "security.read", "Governance"],
  ["backups", "Backup & recovery", "Verify database and evidence recovery independently.", "backups", 10, "backups.request", "Governance"],
  ["settings", "System settings", "Govern election configuration, geography releases and approved integrations.", "settings", 10, "settings.manage", "Governance"],
];
const zoneModules: readonly ModuleInput[] = [
  ["dashboard", "Zone overview", "Your district's coverage, reporting workload and response priorities.", "dashboard", 9, "analytics.read", "Operations"],
  ["agents", "Field agents", "Coordinate verified observers within your assigned senatorial district.", "agents", 3, "personnel.read", "Operations"],
  ["assignments", "PU assignments", "Assign polling-unit coverage with effective dates and a preserved history.", "assignment", 3, "assignments.read", "Operations"],
  ["reports", "Situation reports", "Receive and review observations from authorized district personnel.", "reports", 4, "reports.read", "Operations"],
  ["results", "Result observations", "Review district result transcriptions and supporting evidence.", "results", 8, "results.read", "Operations"],
  ["incidents", "Incident response", "Own district triage, investigation and central escalation.", "incidents", 5, "incidents.read", "Operations"],
  ["emergency", "Emergency alerts", "Acknowledge urgent requests and coordinate a district response.", "emergency", 5, "emergency.read", "Operations"],
  ["messages", "Communications", "Communicate with assigned agents and central command.", "messages", 7, "communications.use", "Operations"],
  ["gis", "Zone map", "View district boundaries, coverage and permitted operational layers.", "gis", 9, "gis.read", "Intelligence"],
  ["evidence", "Evidence repository", "Review authorized district evidence without altering originals.", "evidence", 6, "evidence.read", "Intelligence"],
  ["analytics", "Zone analytics", "Understand reporting completeness, timeliness and response workload.", "analytics", 9, "analytics.read", "Intelligence"],
  ["staff", "Zonal staff", "Manage explicitly delegated district personnel and functional roles.", "staff", 3, "personnel.read", "Governance"],
];
const fieldModules: readonly ModuleInput[] = [
  ["home", "Field home", "Your assignment, connection status and essential reporting actions.", "dashboard", 4, "self", "Field work"],
  ["assignment", "My assignment", "View your authorized polling unit and supervisor information.", "assignment", 3, "self", "Field work"],
  ["checkin", "Check-in", "Confirm arrival and availability without continuous location tracking.", "checkin", 3, "self.checkin.create", "Field work"],
  ["report", "Situation report", "Send a structured observation with a clear server receipt.", "reports", 4, "self.report.create", "Field work"],
  ["results", "Result observation", "Transcribe observed figures and preserve each correction as a version.", "results", 8, "self.result.create", "Field work"],
  ["incident", "Report incident", "Document a concern safely, with only necessary evidence and personal information.", "incidents", 5, "self.incident.create", "Field work"],
  ["media", "Media & evidence", "Capture or select photos, audio and short video with recoverable uploads.", "media", 6, "self.evidence.create", "Field work"],
  ["messages", "Messages", "Contact your assigned supervisor or situation room.", "messages", 7, "communications.use", "Field work"],
  ["alerts", "Emergency assistance", "Request urgent assistance and distinguish sending from server receipt.", "alerts", 5, "self.alert.create", "Field work"],
  ["history", "Submission history", "Review your own submissions, corrections and verification status.", "history", 4, "self", "Field work"],
  ["profile", "My profile", "Manage your contact information and account preferences.", "profile", 3, "self.profile.update", "Account"],
  ["sync", "Synchronization", "Inspect locally saved drafts and pending work before and after sending.", "sync", 11, "self", "Field work"],
];

function build(workspace: Workspace, modules: readonly ModuleInput[]): RouteDefinition[] {
  return modules.map(([slug, title, description, icon, phase, permission, group]) => ({ workspace, path: `/${workspace}/${slug}`, slug, title, description, icon, phase, permission, group }));
}

export const navigation: Record<Workspace, readonly RouteDefinition[]> = {
  central: build("central", centralModules),
  zone: build("zone", zoneModules),
  field: build("field", fieldModules),
};
export const workspaceLabels: Record<Workspace, string> = { central: "Central command", zone: "Senatorial command", field: "Field observer" };
export const allRoutes: readonly RouteDefinition[] = Object.values(navigation).flat();
const accountModules: readonly ModuleInput[] = [
  ["profile", "My profile", "Contact details and personal preferences.", "profile", 3, "self.profile.update", "Account"],
  ["notifications", "Notifications", "Delivery channels and notification preferences.", "alerts", 10, "self.profile.update", "Account"],
  ["security", "Account security", "MFA, devices and session review.", "security", 2, "self", "Account"],
  ["activity", "My activity", "Your account and submission activity.", "history", 10, "self", "Account"],
];
export const accountRoutes: readonly RouteDefinition[] = build("central", accountModules).map((route) => ({ ...route, path: `/admin/${route.slug}` }));
export type AppRoute = RouteDefinition;

export function getRoute(workspace: Workspace, slug: string): RouteDefinition | undefined { return getModule(workspace, slug); }

export function getModule(workspace: Workspace, slug: string): RouteDefinition | undefined {
  return navigation[workspace].find((item) => item.slug === slug);
}

export function searchRoutes(query: string, workspace?: Workspace): RouteDefinition[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const pool = workspace ? navigation[workspace] : allRoutes;
  if (!terms.length) return pool.slice(0, 8);
  return pool.filter((item) => terms.every((term) => `${item.title} ${item.description} ${item.path}`.toLowerCase().includes(term))).slice(0, 12);
}
