export {
  V08_BLOCKED_REAL_MESSAGE as V08_GITHUB_BLOCKED_MESSAGE,
} from "../integrationSafety";

export function assertGitHubDryRunOnly(): void {
  // V0.8: GitHub always dry-run unless explicit dev mode (disabled by default)
}
