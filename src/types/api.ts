export type ApiSuccess<T> = {
  data: T;
  message: string;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type RoleBrief = {
  id: number;
  slug: string;
  name: string;
};

export type Skill = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export type RoleSkill = {
  id: number;
  skill: Skill;
  importance: number;
};

export type Role = {
  id: number;
  name: string;
  slug: string;
  description: string;
  skills: RoleSkill[];
};

export type Profile = {
  current_role: string;
  years_of_experience: number | null;
  technical_goal: string;
  target_role: RoleBrief | null;
  target_role_label: string;
  known_skills: string[];
  target_learn_skills: string[];
  onboarding_completed: boolean;
  diagnostic_cycle?: number;
  diagnostic_difficulty_bump?: number;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdate = {
  current_role?: string;
  years_of_experience?: number | null;
  technical_goal?: string;
  target_role_id?: number | null;
  target_role_label?: string;
  known_skills?: string[];
  target_learn_skills?: string[];
  complete_onboarding?: boolean;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  is_staff?: boolean;
  profile: Profile | null;
  date_joined: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  invite_token: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type InvitePreview = {
  email: string;
  expires_at: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type GoogleAuthRequest = {
  credential: string;
  invite_token?: string;
};

export type Paginated<T> = {
  page: number;
  page_size: number;
  total: number;
  results: T[];
};

export type StaffWaitlistRow = {
  id: number;
  email: string;
  role_or_stack: string;
  interest_note: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  invited: boolean;
  invited_at: string | null;
  created_at: string;
  has_account: boolean;
  invite_status: "none" | "pending" | "expired" | "used";
  invite_expires_at: string | null;
  invite_used_at: string | null;
};

export type StaffUserRow = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  email_verified: boolean;
  date_joined: string;
  last_login: string | null;
  onboarding_completed: boolean;
  current_role: string;
  diagnostics_completed: number;
  challenges_completed: number;
  open_gaps: number;
  last_session_at: string | null;
};

export type StaffUserDetail = {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    email_verified: boolean;
    date_joined: string;
    last_login: string | null;
  };
  profile: {
    current_role: string;
    years_of_experience: number | null;
    technical_goal: string;
    target_role: RoleBrief | null;
    target_role_label: string;
    known_skills: string[];
    target_learn_skills: string[];
    onboarding_completed: boolean;
    diagnostic_cycle: number;
  } | null;
  diagnostics: Array<{
    id: number;
    status: string;
    goal: string;
    current_role: string;
    target_role: string;
    created_at: string;
    completed_at: string | null;
  }>;
  challenge_attempts: Array<{
    id: number;
    status: string;
    challenge_title: string;
    modality: string;
    started_at: string;
    completed_at: string | null;
  }>;
  sessions: Array<{
    id: number;
    session_type: string;
    title: string;
    summary: string;
    created_at: string;
  }>;
  gaps: Array<{
    id: number;
    skill_name: string;
    skill_slug: string;
    status: string;
    updated_at: string;
  }>;
};

export type DiagnosticQuestion = {
  id: number;
  text: string;
  question_type: string;
  skill: Skill;
  difficulty: number;
  ordering: number;
};

export type Diagnostic = {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  questions: DiagnosticQuestion[];
};

export type DiagnosticAnswer = {
  id: number;
  question_id: number;
  answer_text: string;
  updated_at: string;
};

export type DiagnosticResult = {
  strengths: string[];
  gaps: Array<string | { skill_slug?: string; severity?: string; notes?: string }>;
  evidence: unknown;
  skill_findings: unknown;
  recommended_focus: string | string[];
  created_at: string;
};

export type DiagnosticAttemptStatus =
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type DiagnosticTurn = {
  id: number;
  ordering: number;
  stage: string;
  skill: Skill | null;
  difficulty: string;
  question_type: string;
  prompt_text: string;
  question_payload: Record<string, unknown>;
  answer_text: string;
  evaluation: Record<string, unknown> | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type DiagnosticAttempt = {
  id: number;
  diagnostic_id: number;
  diagnostic_title: string;
  status: DiagnosticAttemptStatus | string;
  goal?: string;
  current_stage?: string;
  stage_history?: string[];
  active_turn_id?: number | null;
  active_turn?: DiagnosticTurn | null;
  skill_scores?: Record<string, { score: number; breakdown?: Record<string, number> }>;
  transfer_report?: Array<Record<string, unknown>>;
  gap_report?: Array<Record<string, unknown>>;
  started_at: string;
  completed_at: string | null;
  answers: DiagnosticAnswer[];
  turns?: DiagnosticTurn[];
  result: DiagnosticResult | null;
};

export type SaveAnswersRequest = {
  answers: Array<{ question_id: number; answer_text: string }>;
};

export type SubmitTurnRequest = {
  turn_id: number;
  answer_text: string;
};

export type GapEvidence = {
  id: number;
  source_type: string;
  source_id: string;
  summary: string;
  created_at: string;
};

export type GapStatus = "NOT_STARTED" | "IN_PROGRESS" | "CLOSED" | "OPEN" | string;

export type UserSkillGap = {
  id: number;
  skill: Skill;
  status: GapStatus;
  evidence: GapEvidence[];
  created_at: string;
  updated_at: string;
  severity?: string | null;
  fragment?: string | null;
  skill_area?: string | null;
  challenge_id?: number | null;
  latest_evidence_summary?: string | null;
  progress_percent?: number;
  market_insight?: string | null;
};

export type SkillGapAnalysisSummary = {
  open_count: number;
  in_progress_count: number;
  closed_count: number;
  by_severity: {
    high: number;
    medium: number;
    low: number;
    unknown: number;
  };
  avg_proficiency?: number;
  active_focus?: number;
};

export type SkillGapRadarAxis = {
  key: string;
  label: string;
  current: number;
  target: number;
};

export type SkillGapMarketTrend = {
  label: string;
  stat_text: string;
  source_name?: string;
  source_date?: string;
};

export type SkillGapAnalysisData = {
  summary: SkillGapAnalysisSummary;
  radar?: { axes: SkillGapRadarAxis[] };
  market_trends?: SkillGapMarketTrend[];
  open_gaps: UserSkillGap[];
  recently_closed_gaps: UserSkillGap[];
};

export type ChallengeModality =
  | "THEORY"
  | "CODING"
  | "RESEARCH"
  | "DEFEND"
  | "DIAGNOSE"
  | "ARCHITECT"
  | "EXPLAIN_CODE"
  | "USE_AI"
  | "COMMUNICATE"
  | "AUDIT_AI_PR"
  | "EXPLAIN_AI_DIFF"
  | "INHERITED_CODEBASE"
  | "WAR_ROOM";

export type ChallengeSkill = {
  id: number;
  skill: Skill;
};

export type Challenge = {
  id: number;
  title: string;
  slug: string;
  description: string;
  modality: ChallengeModality | string;
  difficulty: number;
  estimated_duration_minutes: number;
  scenario: string;
  requirements: string[] | unknown;
  constraints: string[] | unknown;
  workspace_config: Record<string, unknown>;
  is_active: boolean;
  skills: ChallengeSkill[];
  directions?: string[];
  is_locked?: boolean;
  today_challenge_id?: number;
  current_challenge_id?: number;
};

export type DailyChallengeStatus =
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED"
  | string;

export type DailyChallenge = {
  id: number;
  date: string;
  status: DailyChallengeStatus;
  challenge: Challenge;
  created_at: string;
  updated_at: string;
};

export type Submission = {
  text_answer: string;
  code: string;
  architecture_data: Record<string, unknown>;
  research_data: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ConfidenceRating = {
  score: number;
  note: string;
  created_at: string;
};

export type ChallengeAttempt = {
  id: number;
  challenge: Challenge;
  daily_challenge_id: number | null;
  status: string;
  started_at: string;
  completed_at: string | null;
  submission: Submission | null;
  confidence: ConfidenceRating | null;
  debrief_id?: number | null;
};

export type ChallengeSubmitRequest = {
  text_answer?: string;
  code?: string;
  architecture_data?: Record<string, unknown>;
  research_data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

export type ChallengeVisibleTestCase = {
  id: number | string;
  order: number;
  is_hidden?: boolean;
  input: string;
  expected_output: string;
};

export type ChallengeTestResult = {
  case_id?: number | string;
  passed: boolean;
  hidden?: boolean;
  skipped?: boolean;
  input?: string;
  stdout?: string;
  stderr?: string;
  actual_output?: string;
  expected_output?: string;
  runtime_ms?: number;
};

export type ChallengeRunTestsResponse = {
  passed_visible: boolean;
  test_results: ChallengeTestResult[];
};

export type ConfidenceCreateRequest = {
  score: number;
  note?: string;
};

export type DebriefAnswer = {
  answer_text: string;
  created_at: string;
};

export type DebriefQuestion = {
  id: number;
  order: number;
  prompt_text: string;
  status: string;
  answer: DebriefAnswer | null;
  created_at: string;
};

export type DebriefEvaluation = {
  strengths: string[];
  gaps: string[];
  next_focus: string[];
  score: number | null;
  summary: string;
  created_at: string;
};

export type DebriefSession = {
  id: number;
  attempt_id: number;
  challenge_title: string;
  status: string;
  max_questions: number;
  questions: DebriefQuestion[];
  evaluation: DebriefEvaluation | null;
  created_at: string;
  updated_at: string;
};

export type DebriefAnswerRequest = {
  answer_text: string;
};

export type LearningSession = {
  id: number;
  session_type: "DIAGNOSTIC" | "CHALLENGE" | "DEBRIEF" | string;
  reference_id: number;
  title: string;
  summary: string;
  created_at: string;
  score: number | null;
};

export type DashboardData = {
  open_gaps_count: number;
  closed_gaps_count: number;
  open_gaps: UserSkillGap[];
  recently_closed_gaps?: UserSkillGap[];
  today_challenge: DailyChallenge | null;
  recent_sessions: LearningSession[];
  onboarding_completed: boolean;
  active_diagnostic_session_id: number | null;
  diagnostic_completed?: boolean;
  has_roadmap?: boolean;
  roadmap_steps_count?: number;
  roadmap_steps_total?: number;
  roadmap_steps_closed?: number;
  roadmap_complete?: boolean;
  rediagnostic_unlocked?: boolean;
  diagnostic_difficulty_bump?: number;
  diagnostic_cycle?: number;
  roadmap_focus_topics?: string[];
};

export type RoadmapStepStatus = "not_started" | "in_progress" | "closed";

export type RoadmapStep = {
  gap?: UserSkillGap;
  suggested_challenges?: Challenge[];
  status?: RoadmapStepStatus | string;
  notes?: string[];
  modality?: string;
  topic?: string;
  priority?: number;
  challenge?: Challenge | null;
  source?: string;
  session_id?: number;
};

export type DiagnosticSessionGoal = "sharpen_current" | "switch_role";

export type DiagnosticSessionStatus =
  | "AWAITING_ANSWERS"
  | "COMPLETED"
  | "FAILED";

export type FrameworkTopic = {
  id: number;
  framework_name: string;
  fundamentals_language: string;
  competency_areas: string[];
};

export type QuestionChoice = {
  id: number;
  choice_text: string;
};

export type SessionAnswer = {
  id: number;
  answer_text: string;
  choice_id?: number | null;
  is_correct?: boolean | null;
  confidence_rating?: number | null;
  self_rated_alignment?: Record<string, string> | null;
  grading_detail?: Record<string, unknown>;
  submitted_at: string;
  revealed_at?: string | null;
  self_rated_at?: string | null;
};

export type SessionQuestion = {
  id: number;
  stage: string;
  order: number;
  competency_area?: string;
  question_text: string;
  modality: string;
  difficulty_tier?: number;
  language?: string;
  choices?: QuestionChoice[];
  test_cases?: Array<{ id: number; input: string; order: number }>;
  status: string;
  answer?: SessionAnswer | null;
  created_at: string;
};

export type SessionAnswerReveal = {
  answer_id: number;
  reference_text: string;
  rubric_points: string[];
};

export type MarketEvidence = {
  stat_text: string;
  source_name: string;
  source_date: string;
  as_of?: string | null;
};

export type DiagnosticSynthesis = {
  strengths?: Array<{
    skill_area: string;
    evidence: string;
    fragment?: string;
    market_evidence?: MarketEvidence[];
  }>;
  gaps?: Array<{
    skill_area: string;
    block: string;
    severity: string;
    fragment?: string;
    market_evidence?: MarketEvidence[];
  }>;
  transferable_skills?: Array<{
    from_current_role: string;
    applies_to_target: string;
  }>;
  roadmap?: Array<{
    challenge_modality: string;
    topic: string;
    priority: number;
  }>;
};

export type QuickScoreChoice = {
  id: number;
  choice_text: string;
};

export type QuickScoreQuestion = {
  id: number;
  track: string;
  competency_area: string;
  prompt_text: string;
  weight: number;
  order: number;
  choices: QuickScoreChoice[];
};

export type QuickScoreAttempt = {
  id: number;
  track: string;
  total_score: number;
  band: string;
  band_label: string;
  paragraph: string;
  paragraph_key: string;
  created_at: string;
};

export type QuickScoreQuestionsPayload = {
  track: string;
  questions: QuickScoreQuestion[];
};

export type ChallengeDebriefPayload = {
  attempt_id: number;
  status: string;
  reference_text: string;
  rubric_items: Array<{
    id: number;
    text: string;
    order: number;
    follow_ups: Array<{ id: number; question_text: string }>;
  }>;
  checklist: Record<string, boolean | string | number>;
  follow_up_answers: Record<string, string>;
  selected_follow_ups: Array<{
    id: number;
    rubric_item_id: number;
    question_text: string;
  }>;
  strengths: string[];
  gaps: string[];
  next_focus: string;
  checklist_score: number | null;
};

export type DiagnosticSession = {
  id: number;
  goal: DiagnosticSessionGoal | string;
  target_role: string;
  selected_frameworks?: Array<{ slug: string; name: string }>;
  assessment_competencies?: Array<{
    framework_slug: string;
    competency_area: string;
    source?: string;
  }>;
  current_role: string;
  status: DiagnosticSessionStatus | string;
  current_stage: string | null;
  selection_log?: Array<Record<string, unknown>>;
  synthesis: DiagnosticSynthesis;
  error: string;
  difficulty_bump?: number;
  questions: SessionQuestion[];
  current_questions: SessionQuestion[];
  skipped_easy_areas?: string[];
  question_budget?: number;
  roadmap_items: Array<{
    id: number;
    challenge_modality: string;
    topic: string;
    priority: number;
    challenge: number | null;
  }>;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type RoadmapData = {
  source?: string;
  steps: RoadmapStep[];
  suggested_challenges: Challenge[];
  focus_skills: string[];
  annotations?: Record<string, string> | Record<number, string>;
  synthesis?: DiagnosticSynthesis;
};
