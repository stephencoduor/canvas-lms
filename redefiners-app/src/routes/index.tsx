import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'
import AdminRoute from '@/routes/AdminRoute'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        lazy: async () => {
          const { LoginPage } = await import('@/pages/LoginPage')
          return { Component: LoginPage }
        },
      },
    ],
  },
  // Public pages accessible without authentication
  {
    element: <Outlet />,
    children: [
      {
        path: '/accessibility',
        lazy: async () => {
          const { AccessibilityPage } = await import('@/pages/utility/AccessibilityPage')
          return { Component: AccessibilityPage }
        },
      },
      {
        path: '/terms',
        lazy: async () => {
          const { TermsOfServicePage } = await import('@/pages/utility/TermsOfServicePage')
          return { Component: TermsOfServicePage }
        },
      },
      {
        path: '/acceptable-use',
        lazy: async () => {
          const { AcceptableUsePolicyPage } = await import('@/pages/admin/AcceptableUsePolicyPage')
          return { Component: AcceptableUsePolicyPage }
        },
      },
      {
        path: '/register',
        lazy: async () => {
          const { RegistrationPage } = await import('@/pages/settings/RegistrationPage')
          return { Component: RegistrationPage }
        },
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        lazy: async () => {
          const { AppLayout } = await import('@/components/layout/AppLayout')
          return { Component: AppLayout }
        },
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: '/dashboard',
            lazy: async () => {
              const { DashboardPage } = await import('@/pages/DashboardPage')
              return { Component: DashboardPage }
            },
          },
          {
            path: '/courses',
            lazy: async () => {
              const { CoursesPage } = await import('@/pages/courses/CoursesPage')
              return { Component: CoursesPage }
            },
          },
          {
            path: '/courses/:courseId',
            lazy: async () => {
              const { CourseHomePage } = await import('@/pages/courses/CourseHomePage')
              return { Component: CourseHomePage }
            },
          },
          {
            path: '/courses/:courseId/assignments',
            lazy: async () => {
              const { AssignmentsPage } = await import('@/pages/assignments/AssignmentsPage')
              return { Component: AssignmentsPage }
            },
          },
          {
            path: '/courses/:courseId/assignments/:assignmentId',
            lazy: async () => {
              const { AssignmentDetailPage } = await import('@/pages/assignments/AssignmentDetailPage')
              return { Component: AssignmentDetailPage }
            },
          },
          {
            path: '/courses/:courseId/assignments/new',
            lazy: async () => {
              const { AssignmentEditPage } = await import('@/pages/assignments/AssignmentEditPage')
              return { Component: AssignmentEditPage }
            },
          },
          {
            path: '/courses/:courseId/assignments/:assignmentId/edit',
            lazy: async () => {
              const { AssignmentEditPage } = await import('@/pages/assignments/AssignmentEditPage')
              return { Component: AssignmentEditPage }
            },
          },
          {
            path: '/courses/:courseId/assignments/:assignmentId/submit',
            lazy: async () => {
              const { SubmitAssignmentPage } = await import('@/pages/assignments/SubmitAssignmentPage')
              return { Component: SubmitAssignmentPage }
            },
          },
          {
            path: '/courses/:courseId/modules',
            lazy: async () => {
              const { ModulesPage } = await import('@/pages/modules/ModulesPage')
              return { Component: ModulesPage }
            },
          },
          {
            path: '/courses/:courseId/grades',
            lazy: async () => {
              const { GradesPage } = await import('@/pages/grades/GradesPage')
              return { Component: GradesPage }
            },
          },
          {
            path: '/courses/:courseId/pages',
            lazy: async () => {
              const { PagesListPage } = await import('@/pages/pages/PagesListPage')
              return { Component: PagesListPage }
            },
          },
          {
            path: '/courses/:courseId/pages/:pageUrl',
            lazy: async () => {
              const { PageViewPage } = await import('@/pages/pages/PageViewPage')
              return { Component: PageViewPage }
            },
          },
          {
            path: '/courses/:courseId/pages/new',
            lazy: async () => {
              const { WikiPageEditPage } = await import('@/pages/pages/WikiPageEditPage')
              return { Component: WikiPageEditPage }
            },
          },
          {
            path: '/courses/:courseId/pages/:pageUrl/edit',
            lazy: async () => {
              const { WikiPageEditPage } = await import('@/pages/pages/WikiPageEditPage')
              return { Component: WikiPageEditPage }
            },
          },
          {
            path: '/courses/:courseId/files',
            lazy: async () => {
              const { FilesPage } = await import('@/pages/files/FilesPage')
              return { Component: FilesPage }
            },
          },
          {
            path: '/courses/:courseId/syllabus',
            lazy: async () => {
              const { SyllabusPage } = await import('@/pages/courses/SyllabusPage')
              return { Component: SyllabusPage }
            },
          },
          {
            path: '/courses/:courseId/discussions',
            lazy: async () => {
              const { DiscussionsPage } = await import('@/pages/discussions/DiscussionsPage')
              return { Component: DiscussionsPage }
            },
          },
          {
            path: '/courses/:courseId/discussions/:topicId',
            lazy: async () => {
              const { DiscussionThreadPage } = await import('@/pages/discussions/DiscussionThreadPage')
              return { Component: DiscussionThreadPage }
            },
          },
          {
            path: '/courses/:courseId/discussions/new',
            lazy: async () => {
              const { DiscussionEditPage } = await import('@/pages/discussions/DiscussionEditPage')
              return { Component: DiscussionEditPage }
            },
          },
          {
            path: '/courses/:courseId/quizzes',
            lazy: async () => {
              const { QuizzesPage } = await import('@/pages/quizzes/QuizzesPage')
              return { Component: QuizzesPage }
            },
          },
          {
            path: '/courses/:courseId/quizzes/:quizId',
            lazy: async () => {
              const { QuizShowPage } = await import('@/pages/quizzes/QuizShowPage')
              return { Component: QuizShowPage }
            },
          },
          {
            path: '/courses/:courseId/quizzes/:quizId/take',
            lazy: async () => {
              const { QuizTakePage } = await import('@/pages/quizzes/QuizTakePage')
              return { Component: QuizTakePage }
            },
          },
          {
            path: '/courses/:courseId/quizzes/:quizId/results',
            lazy: async () => {
              const { QuizResultsPage } = await import('@/pages/quizzes/QuizResultsPage')
              return { Component: QuizResultsPage }
            },
          },
          {
            path: '/courses/:courseId/quizzes/:quizId/statistics',
            lazy: async () => {
              const { QuizStatisticsPage } = await import('@/pages/quizzes/QuizStatisticsPage')
              return { Component: QuizStatisticsPage }
            },
          },
          {
            path: '/courses/:courseId/people',
            lazy: async () => {
              const { PeoplePage } = await import('@/pages/people/PeoplePage')
              return { Component: PeoplePage }
            },
          },
          {
            path: '/courses/:courseId/groups',
            lazy: async () => {
              const { GroupsPage } = await import('@/pages/groups/GroupsPage')
              return { Component: GroupsPage }
            },
          },
          {
            path: '/courses/:courseId/conferences',
            lazy: async () => {
              const { ConferencesPage } = await import('@/pages/conferences/ConferencesPage')
              return { Component: ConferencesPage }
            },
          },
          {
            path: '/courses/:courseId/collaborations',
            lazy: async () => {
              const { CollaborationsPage } = await import('@/pages/services/CollaborationsPage')
              return { Component: CollaborationsPage }
            },
          },
          {
            path: '/courses/:courseId/content-migrations',
            lazy: async () => {
              const { ContentMigrationsPage } = await import('@/pages/services/ContentMigrationsPage')
              return { Component: ContentMigrationsPage }
            },
          },
          {
            path: '/courses/:courseId/paces',
            lazy: async () => {
              const { CoursePacesPage } = await import('@/pages/courses/CoursePacesPage')
              return { Component: CoursePacesPage }
            },
          },
          {
            path: '/courses/:courseId/copy',
            lazy: async () => {
              const { CourseCopyPage } = await import('@/pages/courses/CourseCopyPage')
              return { Component: CourseCopyPage }
            },
          },
          {
            path: '/courses/:courseId/announcements',
            lazy: async () => {
              const { CourseAnnouncementsPage } = await import('@/pages/courses/CourseAnnouncementsPage')
              return { Component: CourseAnnouncementsPage }
            },
          },
          {
            path: '/courses/:courseId/analytics',
            lazy: async () => {
              const { AnalyticsPage } = await import('@/pages/analytics/AnalyticsPage')
              return { Component: AnalyticsPage }
            },
          },
          {
            path: '/inbox',
            lazy: async () => {
              const { InboxPage } = await import('@/pages/inbox/InboxPage')
              return { Component: InboxPage }
            },
          },
          {
            path: '/profile',
            lazy: async () => {
              const { ProfilePage } = await import('@/pages/profile/ProfilePage')
              return { Component: ProfilePage }
            },
          },
          {
            path: '/notifications',
            lazy: async () => {
              const { NotificationsPage } = await import('@/pages/services/NotificationsPage')
              return { Component: NotificationsPage }
            },
          },
          {
            path: '/search',
            lazy: async () => {
              const { SearchPage } = await import('@/pages/services/SearchPage')
              return { Component: SearchPage }
            },
          },
          {
            path: '/all-courses',
            lazy: async () => {
              const { AllCoursesPage } = await import('@/pages/courses/AllCoursesPage')
              return { Component: AllCoursesPage }
            },
          },
          {
            path: '/change-password',
            lazy: async () => {
              const { ChangePasswordPage } = await import('@/pages/services/ChangePasswordPage')
              return { Component: ChangePasswordPage }
            },
          },
          {
            path: '/help',
            lazy: async () => {
              const { HelpCenterPage } = await import('@/pages/utility/HelpCenterPage')
              return { Component: HelpCenterPage }
            },
          },
          {
            path: '/student-analytics',
            lazy: async () => {
              const { StudentAnalyticsPage } = await import('@/pages/analytics/StudentAnalyticsPage')
              return { Component: StudentAnalyticsPage }
            },
          },
          // Admin routes — protected by AdminRoute (role check)
          {
            element: <AdminRoute />,
            children: [
          {
            path: '/admin',
            lazy: async () => {
              const { AdminDashboardPage } = await import('@/pages/admin/AdminDashboardPage')
              return { Component: AdminDashboardPage }
            },
          },
          {
            path: '/admin/users',
            lazy: async () => {
              const { UserManagementPage } = await import('@/pages/admin/UserManagementPage')
              return { Component: UserManagementPage }
            },
          },
          {
            path: '/admin/reports',
            lazy: async () => {
              const { ReportsPage } = await import('@/pages/admin/ReportsPage')
              return { Component: ReportsPage }
            },
          },
          {
            path: '/admin/permissions',
            lazy: async () => {
              const { PermissionsPage } = await import('@/pages/admin/PermissionsPage')
              return { Component: PermissionsPage }
            },
          },
          {
            path: '/admin/terms',
            lazy: async () => {
              const { TermsPage } = await import('@/pages/admin/TermsPage')
              return { Component: TermsPage }
            },
          },
          {
            path: '/admin/developer-keys',
            lazy: async () => {
              const { DeveloperKeysPage } = await import('@/pages/admin/DeveloperKeysPage')
              return { Component: DeveloperKeysPage }
            },
          },
          {
            path: '/settings',
            lazy: async () => {
              const { AccountSettingsPage } = await import('@/pages/settings/AccountSettingsPage')
              return { Component: AccountSettingsPage }
            },
          },
          {
            path: '/courses/:courseId/settings',
            lazy: async () => {
              const { CourseSettingsPage } = await import('@/pages/settings/CourseSettingsPage')
              return { Component: CourseSettingsPage }
            },
          },
          {
            path: '/calendar',
            lazy: async () => {
              const { CalendarPage } = await import('@/pages/calendar/CalendarPage')
              return { Component: CalendarPage }
            },
          },
          {
            path: '/planner',
            lazy: async () => {
              const { PlannerPage } = await import('@/pages/planner/PlannerPage')
              return { Component: PlannerPage }
            },
          },
          {
            path: '/eportfolio',
            lazy: async () => {
              const { EPortfolioPage } = await import('@/pages/eportfolio/EPortfolioPage')
              return { Component: EPortfolioPage }
            },
          },
          {
            path: '/courses/:courseId/outcomes',
            lazy: async () => {
              const { OutcomesPage } = await import('@/pages/outcomes/OutcomesPage')
              return { Component: OutcomesPage }
            },
          },
          {
            path: '/courses/:courseId/rubrics',
            lazy: async () => {
              const { RubricsPage } = await import('@/pages/rubrics/RubricsPage')
              return { Component: RubricsPage }
            },
          },
          {
            path: '/courses/:courseId/gradebook',
            lazy: async () => {
              const { GradebookPage } = await import('@/pages/gradebook/GradebookPage')
              return { Component: GradebookPage }
            },
          },
          {
            path: '/courses/:courseId/speed-grader',
            lazy: async () => {
              const { SpeedGraderPage } = await import('@/pages/gradebook/SpeedGraderPage')
              return { Component: SpeedGraderPage }
            },
          },
          {
            path: '/courses/:courseId/assignments/:assignmentId/peer-reviews',
            lazy: async () => {
              const { PeerReviewsPage } = await import('@/pages/assignments/PeerReviewsPage')
              return { Component: PeerReviewsPage }
            },
          },
          {
            path: '/calendar/appointments/new',
            lazy: async () => {
              const { AppointmentGroupPage } = await import('@/pages/calendar/AppointmentGroupPage')
              return { Component: AppointmentGroupPage }
            },
          },
          {
            path: '/admin/blueprint-courses',
            lazy: async () => {
              const { BlueprintCoursesPage } = await import('@/pages/courses/BlueprintCoursesPage')
              return { Component: BlueprintCoursesPage }
            },
          },
          {
            path: '/courses/:courseId/content-sharing',
            lazy: async () => {
              const { ContentSharingPage } = await import('@/pages/courses/ContentSharingPage')
              return { Component: ContentSharingPage }
            },
          },
          {
            path: '/courses/:courseId/exports',
            lazy: async () => {
              const { ContentExportsPage } = await import('@/pages/courses/ContentExportsPage')
              return { Component: ContentExportsPage }
            },
          },
          {
            path: '/courses/:courseId/link-validator',
            lazy: async () => {
              const { LinkValidatorPage } = await import('@/pages/courses/LinkValidatorPage')
              return { Component: LinkValidatorPage }
            },
          },
          {
            path: '/courses/:courseId/statistics',
            lazy: async () => {
              const { CourseStatisticsPage } = await import('@/pages/courses/CourseStatisticsPage')
              return { Component: CourseStatisticsPage }
            },
          },
          {
            path: '/courses/new',
            lazy: async () => {
              const { CourseWizardPage } = await import('@/pages/courses/CourseWizardPage')
              return { Component: CourseWizardPage }
            },
          },
          {
            path: '/courses/:courseId/grades/summary',
            lazy: async () => {
              const { GradeSummaryPage } = await import('@/pages/grades/GradeSummaryPage')
              return { Component: GradeSummaryPage }
            },
          },
          {
            path: '/courses/:courseId/gradebook/history',
            lazy: async () => {
              const { GradebookHistoryPage } = await import('@/pages/gradebook/GradebookHistoryPage')
              return { Component: GradebookHistoryPage }
            },
          },
          {
            path: '/courses/:courseId/gradebook/upload',
            lazy: async () => {
              const { GradebookUploadsPage } = await import('@/pages/gradebook/GradebookUploadsPage')
              return { Component: GradebookUploadsPage }
            },
          },
          {
            path: '/courses/:courseId/question-banks',
            lazy: async () => {
              const { QuestionBanksPage } = await import('@/pages/quizzes/QuestionBanksPage')
              return { Component: QuestionBanksPage }
            },
          },
          {
            path: '/courses/:courseId/rubrics/:rubricId/assess',
            lazy: async () => {
              const { RubricAssessmentPage } = await import('@/pages/rubrics/RubricAssessmentPage')
              return { Component: RubricAssessmentPage }
            },
          },
          {
            path: '/admin/sis-import',
            lazy: async () => {
              const { SisImportPage } = await import('@/pages/admin/SisImportPage')
              return { Component: SisImportPage }
            },
          },
          {
            path: '/admin/sub-accounts',
            lazy: async () => {
              const { SubAccountsPage } = await import('@/pages/admin/SubAccountsPage')
              return { Component: SubAccountsPage }
            },
          },
          {
            path: '/users/grades',
            lazy: async () => {
              const { UserGradesPage } = await import('@/pages/grades/UserGradesPage')
              return { Component: UserGradesPage }
            },
          },
          {
            path: '/admin/users/:userId/logins',
            lazy: async () => {
              const { UserLoginsPage } = await import('@/pages/admin/UserLoginsPage')
              return { Component: UserLoginsPage }
            },
          },
          {
            path: '/settings/observees',
            lazy: async () => {
              const { ObserveesPage } = await import('@/pages/settings/ObserveesPage')
              return { Component: ObserveesPage }
            },
          },
          {
            path: '/users/outcomes',
            lazy: async () => {
              const { UserOutcomeResultsPage } = await import('@/pages/outcomes/UserOutcomeResultsPage')
              return { Component: UserOutcomeResultsPage }
            },
          },
          {
            path: '/courses/:courseId/notification-settings',
            lazy: async () => {
              const { CourseNotificationSettingsPage } = await import('@/pages/courses/CourseNotificationSettingsPage')
              return { Component: CourseNotificationSettingsPage }
            },
          },
          {
            path: '/admin/tools',
            lazy: async () => {
              const { AdminToolsPage } = await import('@/pages/admin/AdminToolsPage')
              return { Component: AdminToolsPage }
            },
          },
          {
            path: '/admin/calendar-settings',
            lazy: async () => {
              const { CalendarSettingsPage } = await import('@/pages/admin/CalendarSettingsPage')
              return { Component: CalendarSettingsPage }
            },
          },
          {
            path: '/admin/search',
            lazy: async () => {
              const { AccountSearchPage } = await import('@/pages/admin/AccountSearchPage')
              return { Component: AccountSearchPage }
            },
          },
          {
            path: '/admin/grading-settings',
            lazy: async () => {
              const { GradingSettingsPage } = await import('@/pages/admin/GradingSettingsPage')
              return { Component: GradingSettingsPage }
            },
          },
          {
            path: '/admin/grading-standards',
            lazy: async () => {
              const { GradingStandardsPage } = await import('@/pages/admin/GradingStandardsPage')
              return { Component: GradingStandardsPage }
            },
          },
          {
            path: '/admin/account',
            lazy: async () => {
              const { AccountManagePage } = await import('@/pages/admin/AccountManagePage')
              return { Component: AccountManagePage }
            },
          },
          {
            path: '/admin/notifications',
            lazy: async () => {
              const { AccountNotificationsPage } = await import('@/pages/admin/AccountNotificationsPage')
              return { Component: AccountNotificationsPage }
            },
          },
          {
            path: '/admin/statistics',
            lazy: async () => {
              const { AccountStatisticsPage } = await import('@/pages/admin/AccountStatisticsPage')
              return { Component: AccountStatisticsPage }
            },
          },
          {
            path: '/admin/act-as',
            lazy: async () => {
              const { ActAsUserPage } = await import('@/pages/admin/ActAsUserPage')
              return { Component: ActAsUserPage }
            },
          },
          {
            path: '/admin/split',
            lazy: async () => {
              const { AdminSplitPage } = await import('@/pages/admin/AdminSplitPage')
              return { Component: AdminSplitPage }
            },
          },
          {
            path: '/admin/auth-providers',
            lazy: async () => {
              const { AuthProvidersPage } = await import('@/pages/admin/AuthProvidersPage')
              return { Component: AuthProvidersPage }
            },
          },
          {
            path: '/admin/themes',
            lazy: async () => {
              const { BrandConfigsPage } = await import('@/pages/admin/BrandConfigsPage')
              return { Component: BrandConfigsPage }
            },
          },
          {
            path: '/admin/plugins',
            lazy: async () => {
              const { PluginsPage } = await import('@/pages/admin/PluginsPage')
              return { Component: PluginsPage }
            },
          },
          {
            path: '/admin/rate-limiting',
            lazy: async () => {
              const { RateLimitingPage } = await import('@/pages/admin/RateLimitingPage')
              return { Component: RateLimitingPage }
            },
          },
          {
            path: '/admin/release-notes',
            lazy: async () => {
              const { ReleaseNotesPage } = await import('@/pages/admin/ReleaseNotesPage')
              return { Component: ReleaseNotesPage }
            },
          },
          {
            path: '/admin/page-views',
            lazy: async () => {
              const { PageViewsPage } = await import('@/pages/admin/PageViewsPage')
              return { Component: PageViewsPage }
            },
          },
          {
            path: '/admin/theme-editor',
            lazy: async () => {
              const { ThemeEditorPage } = await import('@/pages/admin/ThemeEditorPage')
              return { Component: ThemeEditorPage }
            },
          },
          {
            path: '/admin/theme-preview',
            lazy: async () => {
              const { ThemePreviewPage } = await import('@/pages/admin/ThemePreviewPage')
              return { Component: ThemePreviewPage }
            },
          },
          {
            path: '/admin/terms/manage',
            lazy: async () => {
              const { TermsManagePage } = await import('@/pages/admin/TermsManagePage')
              return { Component: TermsManagePage }
            },
          },
          {
            path: '/admin/feature-flags',
            lazy: async () => {
              const { FeatureFlagsPage } = await import('@/pages/admin/FeatureFlagsPage')
              return { Component: FeatureFlagsPage }
            },
          },
          {
            path: '/courses/:courseId/prior-users',
            lazy: async () => {
              const { PriorUsersPage } = await import('@/pages/courses/PriorUsersPage')
              return { Component: PriorUsersPage }
            },
          },
          {
            path: '/courses/:courseId/grading-standards',
            lazy: async () => {
              const { CourseGradingStandardsPage } = await import('@/pages/courses/CourseGradingStandardsPage')
              return { Component: CourseGradingStandardsPage }
            },
          },
          {
            path: '/courses/:courseId/groups/manage',
            lazy: async () => {
              const { ManageGroupsPage } = await import('@/pages/courses/ManageGroupsPage')
              return { Component: ManageGroupsPage }
            },
          },
          {
            path: '/courses/:courseId/people/add',
            lazy: async () => {
              const { AddPeoplePage } = await import('@/pages/courses/AddPeoplePage')
              return { Component: AddPeoplePage }
            },
          },
          {
            path: '/courses/:courseId/sections',
            lazy: async () => {
              const { SectionManagementPage } = await import('@/pages/courses/SectionManagementPage')
              return { Component: SectionManagementPage }
            },
          },
          {
            path: '/courses/:courseId/teacher-report',
            lazy: async () => {
              const { TeacherActivityReportPage } = await import('@/pages/courses/TeacherActivityReportPage')
              return { Component: TeacherActivityReportPage }
            },
          },
          {
            path: '/courses/:courseId/navigation',
            lazy: async () => {
              const { CourseNavigationSettingsPage } = await import('@/pages/courses/CourseNavigationSettingsPage')
              return { Component: CourseNavigationSettingsPage }
            },
          },
          {
            path: '/users/:userId',
            lazy: async () => {
              const { PublicProfilePage } = await import('@/pages/profile/PublicProfilePage')
              return { Component: PublicProfilePage }
            },
          },
          // Student Services
          {
            path: '/chat',
            lazy: async () => {
              const { ChatPage } = await import('@/pages/services/ChatPage')
              return { Component: ChatPage }
            },
          },
          {
            path: '/feedback',
            lazy: async () => {
              const { FeedbackPage } = await import('@/pages/services/FeedbackPage')
              return { Component: FeedbackPage }
            },
          },
          {
            path: '/mentoring',
            lazy: async () => {
              const { MentoringPage } = await import('@/pages/services/MentoringPage')
              return { Component: MentoringPage }
            },
          },
          {
            path: '/tutoring',
            lazy: async () => {
              const { TutoringPage } = await import('@/pages/services/TutoringPage')
              return { Component: TutoringPage }
            },
          },
          {
            path: '/career-services',
            lazy: async () => {
              const { CareerServicesPage } = await import('@/pages/services/CareerServicesPage')
              return { Component: CareerServicesPage }
            },
          },
          {
            path: '/support',
            lazy: async () => {
              const { SupportPage } = await import('@/pages/services/SupportPage')
              return { Component: SupportPage }
            },
          },
          {
            path: '/wellness',
            lazy: async () => {
              const { WellnessPage } = await import('@/pages/services/WellnessPage')
              return { Component: WellnessPage }
            },
          },
          {
            path: '/office-hours',
            lazy: async () => {
              const { OfficeHoursPage } = await import('@/pages/services/OfficeHoursPage')
              return { Component: OfficeHoursPage }
            },
          },
          {
            path: '/message-templates',
            lazy: async () => {
              const { MessageTemplatesPage } = await import('@/pages/services/MessageTemplatesPage')
              return { Component: MessageTemplatesPage }
            },
          },
          // Learning
          {
            path: '/learning-objectives',
            lazy: async () => {
              const { LearningObjectivesPage } = await import('@/pages/learning/LearningObjectivesPage')
              return { Component: LearningObjectivesPage }
            },
          },
          {
            path: '/competencies',
            lazy: async () => {
              const { CompetenciesPage } = await import('@/pages/learning/CompetenciesPage')
              return { Component: CompetenciesPage }
            },
          },
          {
            path: '/learning-paths',
            lazy: async () => {
              const { LearningPathsPage } = await import('@/pages/learning/LearningPathsPage')
              return { Component: LearningPathsPage }
            },
          },
          {
            path: '/certificates',
            lazy: async () => {
              const { CertificatesPage } = await import('@/pages/learning/CertificatesPage')
              return { Component: CertificatesPage }
            },
          },
          {
            path: '/goal-setting',
            lazy: async () => {
              const { GoalSettingPage } = await import('@/pages/learning/GoalSettingPage')
              return { Component: GoalSettingPage }
            },
          },
          {
            path: '/progress-tracker',
            lazy: async () => {
              const { ProgressTrackerPage } = await import('@/pages/learning/ProgressTrackerPage')
              return { Component: ProgressTrackerPage }
            },
          },
          // Content
          {
            path: '/content-library',
            lazy: async () => {
              const { ContentLibraryPage } = await import('@/pages/content/ContentLibraryPage')
              return { Component: ContentLibraryPage }
            },
          },
          {
            path: '/resource-library',
            lazy: async () => {
              const { ResourceLibraryPage } = await import('@/pages/content/ResourceLibraryPage')
              return { Component: ResourceLibraryPage }
            },
          },
          {
            path: '/video-studio',
            lazy: async () => {
              const { VideoStudioPage } = await import('@/pages/content/VideoStudioPage')
              return { Component: VideoStudioPage }
            },
          },
          {
            path: '/interactive-tools',
            lazy: async () => {
              const { InteractiveToolsPage } = await import('@/pages/content/InteractiveToolsPage')
              return { Component: InteractiveToolsPage }
            },
          },
          {
            path: '/commons',
            lazy: async () => {
              const { CommonsPage } = await import('@/pages/content/CommonsPage')
              return { Component: CommonsPage }
            },
          },
          // Community
          {
            path: '/study-groups',
            lazy: async () => {
              const { StudyGroupsPage } = await import('@/pages/community/StudyGroupsPage')
              return { Component: StudyGroupsPage }
            },
          },
          {
            path: '/workspaces',
            lazy: async () => {
              const { WorkspacesPage } = await import('@/pages/community/WorkspacesPage')
              return { Component: WorkspacesPage }
            },
          },
          {
            path: '/conferences',
            lazy: async () => {
              const { GlobalConferencesPage } = await import('@/pages/community/GlobalConferencesPage')
              return { Component: GlobalConferencesPage }
            },
          },
          {
            path: '/recordings',
            lazy: async () => {
              const { RecordingsPage } = await import('@/pages/community/RecordingsPage')
              return { Component: RecordingsPage }
            },
          },
          {
            path: '/group-assignments',
            lazy: async () => {
              const { GroupAssignmentsPage } = await import('@/pages/community/GroupAssignmentsPage')
              return { Component: GroupAssignmentsPage }
            },
          },
          // Schedule
          {
            path: '/academic-calendar',
            lazy: async () => {
              const { AcademicCalendarPage } = await import('@/pages/schedule/AcademicCalendarPage')
              return { Component: AcademicCalendarPage }
            },
          },
          {
            path: '/events',
            lazy: async () => {
              const { EventsPage } = await import('@/pages/schedule/EventsPage')
              return { Component: EventsPage }
            },
          },
          {
            path: '/room-booking',
            lazy: async () => {
              const { RoomBookingPage } = await import('@/pages/schedule/RoomBookingPage')
              return { Component: RoomBookingPage }
            },
          },
          {
            path: '/attendance',
            lazy: async () => {
              const { AttendancePage } = await import('@/pages/schedule/AttendancePage')
              return { Component: AttendancePage }
            },
          },
          // Analytics
          {
            path: '/analytics',
            lazy: async () => {
              const { GlobalAnalyticsPage } = await import('@/pages/analytics/GlobalAnalyticsPage')
              return { Component: GlobalAnalyticsPage }
            },
          },
          {
            path: '/learning-analytics',
            lazy: async () => {
              const { LearningAnalyticsPage } = await import('@/pages/analytics/LearningAnalyticsPage')
              return { Component: LearningAnalyticsPage }
            },
          },
          {
            path: '/engagement',
            lazy: async () => {
              const { EngagementPage } = await import('@/pages/analytics/EngagementPage')
              return { Component: EngagementPage }
            },
          },
          {
            path: '/completion-reports',
            lazy: async () => {
              const { CompletionReportsPage } = await import('@/pages/analytics/CompletionReportsPage')
              return { Component: CompletionReportsPage }
            },
          },
          {
            path: '/analytics-hub',
            lazy: async () => {
              const { AnalyticsHubPage } = await import('@/pages/analytics/AnalyticsHubPage')
              return { Component: AnalyticsHubPage }
            },
          },
          // Admin
          {
            path: '/admin/accessibility',
            lazy: async () => {
              const { AdminAccessibilityPage } = await import('@/pages/admin/AdminAccessibilityPage')
              return { Component: AdminAccessibilityPage }
            },
          },
          {
            path: '/admin/api-tokens',
            lazy: async () => {
              const { ApiTokensPage } = await import('@/pages/admin/ApiTokensPage')
              return { Component: ApiTokensPage }
            },
          },
          {
            path: '/admin/audit-log',
            lazy: async () => {
              const { AuditLogPage } = await import('@/pages/admin/AuditLogPage')
              return { Component: AuditLogPage }
            },
          },
          {
            path: '/admin/authentication',
            lazy: async () => {
              const { AuthenticationPage } = await import('@/pages/admin/AuthenticationPage')
              return { Component: AuthenticationPage }
            },
          },
          {
            path: '/admin/backup',
            lazy: async () => {
              const { BackupPage } = await import('@/pages/admin/BackupPage')
              return { Component: BackupPage }
            },
          },
          {
            path: '/admin/course-templates',
            lazy: async () => {
              const { CourseTemplatesPage } = await import('@/pages/admin/CourseTemplatesPage')
              return { Component: CourseTemplatesPage }
            },
          },
          {
            path: '/admin/data-privacy',
            lazy: async () => {
              const { DataPrivacyPage } = await import('@/pages/admin/DataPrivacyPage')
              return { Component: DataPrivacyPage }
            },
          },
          {
            path: '/admin/enrollments',
            lazy: async () => {
              const { EnrollmentsPage } = await import('@/pages/admin/EnrollmentsPage')
              return { Component: EnrollmentsPage }
            },
          },
          {
            path: '/admin/institution',
            lazy: async () => {
              const { InstitutionPage } = await import('@/pages/admin/InstitutionPage')
              return { Component: InstitutionPage }
            },
          },
          {
            path: '/admin/system',
            lazy: async () => {
              const { SystemPage } = await import('@/pages/admin/SystemPage')
              return { Component: SystemPage }
            },
          },
          {
            path: '/admin/system-health',
            lazy: async () => {
              const { SystemHealthPage } = await import('@/pages/admin/SystemHealthPage')
              return { Component: SystemHealthPage }
            },
          },
            ], // End AdminRoute children
          },
          // Announcements
          {
            path: '/announcements/editor',
            lazy: async () => {
              const { AnnouncementEditorPage } = await import('@/pages/announcements/AnnouncementEditorPage')
              return { Component: AnnouncementEditorPage }
            },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundPage } = await import('@/pages/NotFound')
      return { Component: NotFoundPage }
    },
  },
])
