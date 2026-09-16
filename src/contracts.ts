/** B2/C1 example contract. Confirm against the released schema before deploying an integration.
 * Existing study and interview routes follow the public OpenAPI checked 2026-09-16.
 * All assumptions for B2/C1 are isolated here and in release-contract.json. */
export const routes = {
  studies: "/api/public/v1/studies/",
  study: (id: string) => `/api/public/v1/studies/${encodeURIComponent(id)}`,
  customize: (id: string) =>
    `/api/public/v1/studies/${encodeURIComponent(id)}/customize-plan`,
  panel: (id: string) =>
    `/api/public/v1/studies/${encodeURIComponent(id)}/launch-panel`,
  report: (id: string) =>
    `/api/public/v1/studies/${encodeURIComponent(id)}/report`,
  interview: (id: string) =>
    `/api/public/v1/interviews/${encodeURIComponent(id)}`,
  interviews: "/api/public/v1/interviews/",
  search: "/api/public/v1/research/search", // C1: proposed path; release check required.
};
export type Reference = {
  reference_id: string;
  interview_id?: string | null;
  message_id?: string;
  quote?: string;
  message_text?: string;
};
export type Report = {
  study_id: string;
  report_id?: string;
  report_version?: string;
  generated_at?: string;
  is_stale?: boolean | null;
  interview_count?: number;
  coverage?: { eligible_interviews: number; analyzed_interviews: number };
  report?: string | null;
  study_findings?: unknown;
  participant_responses?: unknown;
  participant_profiles?: unknown;
  recommended_next_steps?: unknown;
  references: Reference[];
};
export type SearchRequest = {
  query: string;
  filters?: {
    study_ids?: string[];
    content_types?: string[];
    research_date_from?: string;
    research_date_to?: string;
  };
  limit: number;
  cursor?: string | null;
};
export type SearchResult = {
  result_id: string;
  content_type: string;
  text: string;
  text_kind: string;
  study: { id: string; title: string };
  source: {
    report_id?: string;
    report_version?: string;
    interview_id?: string;
    question_id?: string;
    reference_ids?: string[];
  };
  supporting_references?: Reference[];
  is_stale?: boolean | null;
};
export type SearchResponse = {
  results: SearchResult[];
  next_cursor: string | null;
  coverage: {
    searched_content_types: string[];
    transcripts_searched: boolean;
    index_updated_at?: string;
  };
};
export function sourceReferences(report: Report) {
  return report.references.map((ref) => ({
    ...ref,
    quote: ref.quote ?? ref.message_text ?? null,
  }));
}
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
