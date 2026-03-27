// Canvas LMS API TypeScript Interfaces
// Ported from ReDefiners/js/api.js

// ───────────────────────────────────────
// Enum-like Union Types
// ───────────────────────────────────────

export type EnrollmentType =
  | 'StudentEnrollment'
  | 'TeacherEnrollment'
  | 'TaEnrollment'
  | 'DesignerEnrollment'
  | 'ObserverEnrollment';

export type EnrollmentState =
  | 'active'
  | 'invited'
  | 'inactive'
  | 'completed'
  | 'rejected'
  | 'deleted';

export type WorkflowState =
  | 'unpublished'
  | 'available'
  | 'completed'
  | 'deleted';

export type SubmissionType =
  | 'online_text_entry'
  | 'online_url'
  | 'online_upload'
  | 'media_recording'
  | 'student_annotation'
  | 'discussion_topic'
  | 'online_quiz'
  | 'on_paper'
  | 'external_tool'
  | 'none';

// ───────────────────────────────────────
// Core Interfaces
// ───────────────────────────────────────

export interface CanvasGrades {
  html_url: string;
  current_grade: string | null;
  current_score: number | null;
  final_grade: string | null;
  final_score: number | null;
}

export interface CanvasEnrollment {
  id: number;
  course_id: number;
  type: EnrollmentType;
  role: string;
  enrollment_state: EnrollmentState;
  grades?: CanvasGrades;
  user_id?: number;
  course_section_id?: number;
  computed_current_score?: number | null;
  computed_final_score?: number | null;
  computed_current_grade?: string | null;
  computed_final_grade?: string | null;
}

export interface CanvasPermissions {
  can_create_announcement?: boolean;
  can_create_discussion_topic?: boolean;
  can_manage_account?: boolean;
  become_user?: boolean;
  can_update_name?: boolean;
  can_update_avatar?: boolean;
  manage_grades?: boolean;
  send_messages?: boolean;
  limit_parent_app_web_access?: boolean;
  [key: string]: boolean | undefined;
}

export interface CanvasUser {
  id: number;
  name: string;
  short_name: string;
  login_id: string;
  avatar_url: string;
  email?: string;
  locale?: string | null;
  permissions?: CanvasPermissions;
  enrollments?: CanvasEnrollment[];
  sortable_name?: string;
  bio?: string | null;
  title?: string | null;
  primary_email?: string;
  created_at?: string;
  time_zone?: string;
  effective_locale?: string;
}

export interface CanvasTerm {
  id: number;
  name: string;
  start_at: string | null;
  end_at: string | null;
}

export interface CanvasTeacher {
  id: number;
  display_name: string;
  avatar_image_url: string;
  html_url: string;
}

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  workflow_state: WorkflowState;
  image_download_url?: string | null;
  term?: CanvasTerm;
  teachers?: CanvasTeacher[];
  enrollments?: CanvasEnrollment[];
  total_students?: number;
  uuid?: string;
  account_id?: number;
  start_at?: string | null;
  end_at?: string | null;
  default_view?: string;
  syllabus_body?: string | null;
  is_public?: boolean;
  time_zone?: string;
}

export interface CanvasTab {
  id: string;
  html_url: string;
  full_url: string;
  label: string;
  type: string;
  position: number;
  visibility: 'public' | 'members' | 'admins' | 'none';
  hidden?: boolean;
}

export interface CanvasCourseSettings {
  allow_student_discussion_topics: boolean;
  allow_student_forum_attachments: boolean;
  allow_student_discussion_editing: boolean;
  hide_final_grades: boolean;
  hide_distribution_graphs: boolean;
  lock_all_announcements: boolean;
  [key: string]: boolean | string | number;
}

export interface CanvasSection {
  id: number;
  name: string;
  course_id: number;
  start_at: string | null;
  end_at: string | null;
  total_students?: number;
}

export interface CanvasRubricRating {
  id: string;
  description: string;
  long_description?: string;
  points: number;
}

export interface CanvasRubricCriterion {
  id: string;
  description: string;
  long_description?: string;
  points: number;
  ratings: CanvasRubricRating[];
}

export interface CanvasSubmission {
  id: number;
  user_id?: number;
  assignment_id: number;
  grade: string | null;
  score: number | null;
  submitted_at: string | null;
  workflow_state: string;
  late: boolean;
  missing: boolean;
  excused: boolean;
  submission_type: SubmissionType | null;
  attempt: number | null;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  description: string | null;
  due_at: string | null;
  points_possible: number;
  submission_types: SubmissionType[];
  submission?: CanvasSubmission;
  rubric?: CanvasRubricCriterion[];
  course_id?: number;
  position?: number;
  html_url?: string;
  lock_at?: string | null;
  unlock_at?: string | null;
  has_submitted_submissions?: boolean;
  grading_type?: string;
  assignment_group_id?: number;
  published?: boolean;
  rubric_settings?: { points_possible: number };
}

export interface CanvasTodoItem {
  type: 'grading' | 'submitting';
  assignment: CanvasAssignment;
  context_type: 'Course' | 'Group';
  context_name: string;
  html_url: string;
  ignore?: string;
  ignore_permanently?: string;
  needs_grading_count?: number;
}

export interface CanvasCalendarEvent {
  id: number;
  title: string;
  start_at: string | null;
  end_at: string | null;
  description: string | null;
  context_code: string;
  workflow_state?: string;
  all_day?: boolean;
  all_day_date?: string | null;
  location_name?: string | null;
  location_address?: string | null;
  html_url?: string;
  url?: string;
}

export interface CanvasConversationParticipant {
  id: number;
  name: string;
  avatar_url: string;
}

export interface CanvasConversation {
  id: number;
  subject: string;
  last_message: string;
  last_message_at: string;
  message_count: number;
  participants: CanvasConversationParticipant[];
  avatar_url: string;
  workflow_state?: 'read' | 'unread' | 'archived';
  subscribed?: boolean;
  starred?: boolean;
  properties?: string[];
  audience?: number[];
}

export interface CanvasActivityStreamItem {
  id: number;
  title: string;
  message: string | null;
  type: string;
  context_type: string;
  course_id?: number;
  group_id?: number;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface CanvasColors {
  custom_colors: Record<string, string>;
}

export interface CanvasUserSettings {
  manual_mark_as_read: boolean;
  collapse_global_nav: boolean;
  hide_dashcard_color_overlays: boolean;
  [key: string]: boolean | string | number;
}

export interface CanvasTodoCount {
  assignments_needing_submitting: number;
  assignments_needing_grading: number;
}

// ───────────────────────────────────────
// Modules
// ───────────────────────────────────────

export interface CanvasCompletionRequirement {
  type: 'must_view' | 'must_contribute' | 'must_submit' | 'must_mark_done' | 'min_score';
  min_score?: number;
  completed?: boolean;
}

export interface CanvasModuleItem {
  id: number;
  title: string;
  type: 'File' | 'Page' | 'Discussion' | 'Assignment' | 'Quiz' | 'SubHeader' | 'ExternalUrl' | 'ExternalTool';
  content_id?: number;
  html_url: string;
  url?: string;
  position: number;
  indent: number;
  module_id: number;
  completion_requirement?: CanvasCompletionRequirement;
  content_details?: {
    points_possible?: number;
    due_at?: string | null;
    unlock_at?: string | null;
    lock_at?: string | null;
  };
}

export interface CanvasModule {
  id: number;
  name: string;
  position: number;
  unlock_at: string | null;
  require_sequential_progress: boolean;
  state?: 'locked' | 'unlocked' | 'started' | 'completed';
  completed_at?: string | null;
  items_count: number;
  items_url: string;
  items?: CanvasModuleItem[];
  prerequisite_module_ids?: number[];
  published?: boolean;
}

// ───────────────────────────────────────
// Discussions
// ───────────────────────────────────────

export interface CanvasDiscussionAuthor {
  id: number;
  display_name: string;
  avatar_image_url: string;
  html_url: string;
}

export interface CanvasDiscussionTopic {
  id: number;
  title: string;
  message: string | null;
  posted_at: string | null;
  last_reply_at: string | null;
  author: CanvasDiscussionAuthor;
  discussion_subentry_count: number;
  read_state: 'read' | 'unread';
  unread_count: number;
  assignment_id: number | null;
  published: boolean;
  html_url: string;
  pinned: boolean;
  locked: boolean;
  user_can_see_posts: boolean;
  require_initial_post: boolean;
}

// ───────────────────────────────────────
// Pages
// ───────────────────────────────────────

export interface CanvasPage {
  url: string;
  title: string;
  body: string | null;
  published: boolean;
  front_page: boolean;
  updated_at: string;
  created_at: string;
  editing_roles: string;
  html_url: string;
  lock_info?: Record<string, unknown>;
  locked_for_user?: boolean;
}

// ───────────────────────────────────────
// Files & Folders
// ───────────────────────────────────────

export interface CanvasFile {
  id: number;
  display_name: string;
  filename: string;
  size: number;
  content_type: string;
  url: string;
  updated_at: string;
  created_at: string;
  thumbnail_url?: string | null;
  locked: boolean;
  hidden: boolean;
  folder_id: number;
}

export interface CanvasFolder {
  id: number;
  name: string;
  full_name: string;
  files_count: number;
  folders_count: number;
  context_type: string;
  context_id: number;
  parent_folder_id: number | null;
  position: number | null;
  locked: boolean;
  hidden: boolean;
  created_at: string;
  updated_at: string;
  files_url: string;
  folders_url: string;
}

export interface CanvasQuota {
  quota: number;
  quota_used: number;
}

// ───────────────────────────────────────
// Announcements
// ───────────────────────────────────────

export interface CanvasAnnouncement {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  delayed_post_at: string | null;
  author: CanvasDiscussionAuthor;
  read_state: 'read' | 'unread';
  unread_count: number;
  discussion_subentry_count: number;
  context_code: string;
  html_url: string;
}

// ───────────────────────────────────────
// Assignment Groups
// ───────────────────────────────────────

export interface CanvasAssignmentGroup {
  id: number;
  name: string;
  position: number;
  group_weight: number;
  assignments?: CanvasAssignment[];
  rules?: {
    drop_lowest?: number;
    drop_highest?: number;
    never_drop?: number[];
  };
}

// ───────────────────────────────────────
// Rubric (standalone)
// ───────────────────────────────────────

export interface CanvasRubric {
  id: number;
  title: string;
  points_possible: number;
  data: CanvasRubricCriterion[];
  context_id: number;
  context_type: string;
  free_form_criterion_comments: boolean;
}

// ───────────────────────────────────────
// Peer Reviews
// ───────────────────────────────────────

export interface CanvasPeerReview {
  id: number;
  user_id: number;
  assessor_id: number;
  asset_id: number;
  asset_type: string;
  workflow_state: string;
}

// ───────────────────────────────────────
// Discussion Thread View
// ───────────────────────────────────────

export interface CanvasDiscussionEntry {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  replies?: CanvasDiscussionEntry[];
}

export interface CanvasDiscussionView {
  unread_entries: number[];
  forced_entries: number[];
  participants: Array<{ id: number; display_name: string; avatar_image_url: string }>;
  view: CanvasDiscussionEntry[];
  new_entries: CanvasDiscussionEntry[];
}

// ───────────────────────────────────────
// Module Item Sequence
// ───────────────────────────────────────

export interface CanvasModuleItemSequence {
  items: Array<{
    prev: CanvasModuleItem | null;
    current: CanvasModuleItem;
    next: CanvasModuleItem | null;
  }>;
  modules: Array<{ id: number; name: string }>;
}

// ───────────────────────────────────────
// Pagination
// ───────────────────────────────────────

export interface PaginationLinks {
  current?: string;
  next?: string;
  prev?: string;
  first?: string;
  last?: string;
}

export interface ApiResponse<T> {
  data: T;
  pagination: PaginationLinks | null;
}

// ───────────────────────────────────────
// API Error
// ───────────────────────────────────────

export class ApiError extends Error {
  public readonly status: number;
  public readonly path: string;

  constructor(status: number, message: string, path: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.path = path;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isRateLimited(): boolean {
    return this.status === 403 && this.message.includes('rate');
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }
}
