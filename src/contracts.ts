/** Public report and research-search shapes checked against the 2026-10-05 OpenAPI. */
export const routes = {
  studies: "/api/public/v1/studies/",
  study: (id: string) => `/api/public/v1/studies/${encodeURIComponent(id)}`,
  customize: (id: string) =>
    `/api/public/v1/studies/${encodeURIComponent(id)}/customize-plan`,
  panel: (id: string) =>
    `/api/public/v1/studies/${encodeURIComponent(id)}/launch-panel`,
  report: (id: string) =>
    `/api/public/v1/studies/${encodeURIComponent(id)}/report`,
  reportFull: (id: string) =>
    `/api/public/v1/studies/${encodeURIComponent(id)}/report?view=full`,
  interview: (id: string) =>
    `/api/public/v1/interviews/${encodeURIComponent(id)}`,
  interviews: "/api/public/v1/interviews/",
  search: "/api/public/v1/research/search/",
};

export type Reference = {
  reference_id: string;
  interview_id?: string | null;
  turn_id?: string | null;
  message_text?: string | null;
  start_s?: number | null;
};
export type Report = {
  study_id: string;
  schema_version?: "report-v2";
  structure_status?: "structured" | "legacy_partial";
  report_id?: string | null;
  included_sections?: string[];
  available_sections?: string[];
  interview_count?: number;
  interview_count_basis?: "saved_evidence" | "legacy_unverified";
  is_stale?: boolean | null;
  references: Reference[];
  study_findings?: {
    learning_goals?: Array<{
      findings?: Array<{ reference_ids?: string[] }>;
    }>;
  };
  participant_responses?: Array<{
    interview_id?: string | null;
    learning_goal_responses?: Array<{ summary?: string | null; quote?: string | null }>;
  }>;
  participant_profiles?: unknown[];
  evidence_coverage?: unknown;
  recommended_next_steps?: unknown[];
};
export type SearchContentType =
  | "study_plan"
  | "study_finding"
  | "participant_profile"
  | "participant_response"
  | "recommended_next_step";
export type SearchRequest = {
  query: string;
  filters: {
    study_ids: string[];
    content_types?: SearchContentType[];
    research_date_from?: string;
    research_date_to?: string;
  };
  limit: number;
  cursor?: string | null;
};
export type SearchResult = {
  content_id: string;
  content_type: SearchContentType;
  content: unknown;
  report_id?: string | null;
  report_generated_at?: string | null;
  research_period?: { start?: string | null; end?: string | null } | null;
  interview_id?: string | null;
};
export type SearchResponse = {
  studies: Array<{
    study_id: string;
    index_status: "ready" | "updating" | "not_indexed";
    latest_report_id?: string | null;
    indexed_report_id?: string | null;
    results: SearchResult[];
  }>;
  next_cursor: string | null;
  generated_content_returned: false;
};

export function referencesForAnswer(
  report: Report,
  interviewId: string,
  referenceIds: string[],
) {
  return referenceIds.map((id) => {
    const matches = report.references.filter((ref) => ref.reference_id === id);
    if (matches.length !== 1 || matches[0].interview_id !== interviewId)
      throw new Error(`Unresolved or ambiguous answer reference: ${id}`);
    return matches[0];
  });
}
