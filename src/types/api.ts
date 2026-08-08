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
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdate = {
  current_role?: string;
  years_of_experience?: number | null;
  technical_goal?: string;
  target_role_id?: number | null;
  complete_onboarding?: boolean;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  profile: Profile | null;
  date_joined: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type VerifyEmailRequest = {
  token: string;
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
  gaps: string[];
  evidence: unknown;
  skill_findings: unknown;
  recommended_focus: string[];
  created_at: string;
};

export type DiagnosticAttemptStatus =
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type DiagnosticAttempt = {
  id: number;
  diagnostic_id: number;
  diagnostic_title: string;
  status: DiagnosticAttemptStatus | string;
  started_at: string;
  completed_at: string | null;
  answers: DiagnosticAnswer[];
  result: DiagnosticResult | null;
};

export type SaveAnswersRequest = {
  answers: Array<{ question_id: number; answer_text: string }>;
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
  | "COMMUNICATE";

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
};

export type ChallengeSubmitRequest = {
  text_answer?: string;
  code?: string;
  architecture_data?: Record<string, unknown>;
  research_data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
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
};

export type DashboardData = {
  open_gaps_count: number;
  closed_gaps_count: number;
  open_gaps: UserSkillGap[];
  today_challenge: DailyChallenge | null;
  recent_sessions: LearningSession[];
  onboarding_completed: boolean;
};

export type RoadmapStep = {
  gap: UserSkillGap;
  suggested_challenges: Challenge[];
  status: string;
};

export type RoadmapData = {
  steps: RoadmapStep[];
  suggested_challenges: Challenge[];
  focus_skills: string[];
};
