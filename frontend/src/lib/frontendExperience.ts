export type FrontendExperience =
  | "payroll-handoff"
  | "private-portal"
  | "public-employment-application"
  | "public-stage2";

export const publicEmploymentApplicationPath = "/apply";
export const publicStage2Path = "/stage2";

export const publicEmploymentApplicationHostname =
  "apply.example.invalid";

type FrontendLocation = Pick<Location, "hostname" | "pathname">;

function normalizeHostname(hostname: string) {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

function isPathOrDescendant(
  pathname: string,
  expectedPath: string
) {
  return (
    pathname === expectedPath ||
    pathname.startsWith(`${expectedPath}/`)
  );
}

export function resolveFrontendExperience(
  location: FrontendLocation
): FrontendExperience {
  const hostname = normalizeHostname(location.hostname);
  const pathname = location.pathname || "/";

  if (isPathOrDescendant(pathname, publicStage2Path)) {
    return "public-stage2";
  }

  if (
    hostname === publicEmploymentApplicationHostname ||
    hostname === "apply-nonprod.example.invalid" ||
    isPathOrDescendant(
      pathname,
      publicEmploymentApplicationPath
    )
  ) {
    return "public-employment-application";
  }

  if (pathname === "/payroll-handoff") return "payroll-handoff";
  return "private-portal";
}
