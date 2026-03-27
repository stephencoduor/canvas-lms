#!/usr/bin/env python3
"""Generate remaining ReDefiners pages to reach 237+ total."""
import os

TEMPLATE = """<!DOCTYPE html>
<html>
<head>
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
\t<title>ReDefiners - {title}</title>
\t<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
\t<script src="https://cdn.tailwindcss.com"></script>
\t<script src="css/tailwind-config.js?v=3"></script>
\t<script src="https://kit.fontawesome.com/7a13c96681.js" crossorigin="anonymous"></script>
\t<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
\t<link rel="preconnect" href="https://fonts.gstatic.com">
\t<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
\t<link rel="stylesheet" type="text/css" href="css/tokens.css?v=3">
\t<link rel="stylesheet" type="text/css" href="css/shadcn.css?v=3">
\t<link rel="stylesheet" type="text/css" href="styles.css?v=3">
</head>
<body>
<div class="main-container">
\t<div id="sidebar-root"></div>
\t<div class="main-right" id="main-right">
\t\t<div class="top-bar">
\t\t\t<div class="tw-flex tw-items-center tw-gap-3">
\t\t\t\t<button class="menu-toggle tw-text-gray-500" onclick="document.querySelector('.left-side')?.classList.toggle('mobile-open')"><i class="fa fa-bars"></i></button>
\t\t\t\t<div class="shadcn-search tw-max-w-md"><i class="fa fa-search"></i><input type="text" placeholder="Search..." class="shadcn-input" /></div>
\t\t\t</div>
\t\t\t<div class="tw-flex tw-items-center tw-gap-4">
\t\t\t\t<a href="notifications.html" class="tw-text-gray-500 hover:tw-text-primary-400"><i class="fa fa-bell"></i></a>
\t\t\t\t<a href="inbox.html" class="tw-text-gray-500 hover:tw-text-primary-400"><i class="fa fa-envelope"></i></a>
\t\t\t\t<a href="profile.html"><img src="Images/profile.PNG" class="tw-w-8 tw-h-8 tw-rounded-full tw-object-cover" /></a>
\t\t\t</div>
\t\t</div>
\t\t<div class="tw-p-6 tw-pb-0">
\t\t\t<h3 class="second-color tw-text-xl tw-font-semibold"><i class="fa {icon} tw-mr-2"></i>{heading}</h3>
\t\t\t<p class="tw-text-sm tw-text-gray-500 tw-mt-1">{subtitle}</p>
\t\t</div>
\t\t<div class="tw-p-6 tw-pt-4">{content}</div>
\t</div>
</div>
<script src="js/router.js"></script>
<script src="js/auth.js"></script>
<script src="js/api.js"></script>
<script src="js/render.js"></script>
<script src="js/sidebar.js"></script>
<script src="js/app.js"></script>
</body>
</html>"""

def card(l, v, c='second-color'):
    return f'<div class="shadcn-card tw-p-4"><p class="tw-text-xs tw-text-gray-500">{l}</p><p class="tw-text-2xl tw-font-bold {c}">{v}</p></div>'

def grid(n, cards):
    return f'<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-{n} tw-gap-4 tw-mb-6">{cards}</div>'

def sec(t, b='<div id="assign"></div>'):
    return f'<div class="shadcn-card tw-p-5 tw-mb-4"><h4 class="tw-text-sm tw-font-semibold second-color tw-mb-4">{t}</h4>{b}</div>'

# (filename, title, icon, heading, subtitle, content)
pages = [
    # Batch 3: Assessment & Grading (10)
    ('quiz-builder.html', 'Quiz Builder', 'fa-hammer', 'Build a Quiz', 'Create and configure quiz questions', sec('Quiz Configuration')),
    ('grade-export.html', 'Grade Export', 'fa-file-export', 'Export Grades', 'Download gradebook data', grid(3, card('Students','156')+card('Graded','2,340')+card('Ready','Yes','tw-text-accent-green'))+sec('Export Options')),
    ('rubric-builder.html', 'Rubric Builder', 'fa-th', 'Create Rubric', 'Design scoring criteria', sec('Rubric Criteria')),
    ('grade-passback-status.html', 'Grade Passback', 'fa-exchange-alt', 'LTI Grade Sync', 'Monitor grade sync', grid(3, card('Synced','1,247')+card('Pending','23','tw-text-accent-orange')+card('Failed','5','tw-text-red-500'))+sec('Sync Activity')),
    ('assessment-bank.html', 'Assessment Bank', 'fa-database', 'Question Bank', 'Manage reusable questions', grid(3, card('Questions','1,842')+card('Banks','47')+card('Shared','12'))+sec('Question Banks')),
    ('grading-schemes.html', 'Grading Schemes', 'fa-percentage', 'Grading Schemes', 'Configure grading scales', sec('Default Scheme')),
    ('standards-mastery.html', 'Standards Mastery', 'fa-bullseye', 'Standards Mastery', 'Track mastery of standards', grid(4, card('Standards','48')+card('Mastered','32','tw-text-accent-green')+card('Approaching','12','tw-text-accent-orange')+card('Not Met','4','tw-text-red-500'))+sec('Mastery Map')),
    ('score-analytics.html', 'Score Analytics', 'fa-chart-bar', 'Score Distribution', 'Analyze grade distributions', grid(4, card('Mean','78.4%')+card('Median','81%')+card('Std Dev','12.3')+card('Submissions','156'))+sec('Distribution')),
    ('late-policy.html', 'Late Policy', 'fa-clock', 'Late Submission Policy', 'Configure late work penalties', sec('Policy Settings')),
    ('moderated-grading.html', 'Moderated Grading', 'fa-users-cog', 'Moderated Grading', 'Multi-grader review', grid(3, card('Assignments','8')+card('Graders','3')+card('Pending','12','tw-text-accent-orange'))+sec('Moderated Assignments')),

    # Batch 4: Communication & Collaboration (10)
    ('discussion-analytics.html', 'Discussion Analytics', 'fa-comments', 'Discussion Insights', 'Analyze discussion participation', grid(4, card('Posts','1,247')+card('Posters','89')+card('Avg Length','142 words')+card('Response Rate','73%'))+sec('Top Contributors')),
    ('conference-recording.html', 'Conference Recordings', 'fa-video', 'Recorded Sessions', 'Access conference recordings', sec('Recent Recordings')),
    ('group-assignment.html', 'Group Assignments', 'fa-users', 'Group Assignments', 'Manage group-based work', grid(3, card('Groups','12')+card('Assignments','5')+card('Submitted','10/12'))+sec('Group Submissions')),
    ('message-templates.html', 'Message Templates', 'fa-file-alt', 'Message Templates', 'Create reusable templates', sec('Saved Templates')),
    ('collaboration-spaces.html', 'Collaboration Spaces', 'fa-object-group', 'Shared Workspaces', 'Real-time collaborative spaces', grid(3, card('Spaces','8')+card('Contributors','34')+card('Documents','47'))+sec('Workspace Activity')),
    ('mentoring.html', 'Mentoring', 'fa-hands-helping', 'Mentoring Program', 'Connect students with mentors', grid(3, card('Pairings','24')+card('Sessions','48')+card('Satisfaction','4.7/5'))+sec('Mentoring Pairs')),
    ('study-groups.html', 'Study Groups', 'fa-user-friends', 'Study Groups', 'Form peer study groups', grid(3, card('Groups','15')+card('Members','67')+card('Sessions','12'))+sec('Your Groups')),
    ('feedback-center.html', 'Feedback Center', 'fa-comment-dots', 'Feedback Hub', 'Centralized feedback', grid(3, card('Unread','5','tw-text-accent-orange')+card('Total','47')+card('Avg Response','2.3 days'))+sec('Recent Feedback')),
    ('announcement-editor.html', 'Announcement Editor', 'fa-bullhorn', 'Create Announcement', 'Compose announcements', sec('Announcement Details')),
    ('chat-room.html', 'Chat Room', 'fa-comments', 'Live Chat', 'Real-time course chat', sec('Chat Room')),

    # Batch 5: Admin & Institutional (10)
    ('enrollment-management.html', 'Enrollment Management', 'fa-user-plus', 'Enrollment Manager', 'Manage enrollments', grid(4, card('Enrolled','2,456')+card('Pending','34','tw-text-accent-orange')+card('Waitlisted','12')+card('Dropped','8','tw-text-red-500'))+sec('Recent Enrollments')),
    ('course-templates.html', 'Course Templates', 'fa-clone', 'Course Templates', 'Reusable course templates', grid(3, card('Templates','15')+card('Created','47')+card('Popular','STEM 101'))+sec('Templates')),
    ('institution-settings.html', 'Institution Settings', 'fa-university', 'Institution Config', 'Institution-wide settings', sec('General Settings')),
    ('term-management.html', 'Term Management', 'fa-calendar-alt', 'Academic Terms', 'Manage terms and semesters', sec('Academic Terms')),
    ('audit-log.html', 'Audit Log', 'fa-clipboard-list', 'System Audit Log', 'Track admin actions', sec('Recent Activity')),
    ('data-privacy.html', 'Data Privacy', 'fa-shield-alt', 'Data Privacy Center', 'GDPR compliance', grid(3, card('Requests','3','tw-text-accent-orange')+card('Consents','2,456')+card('Compliance','98%','tw-text-accent-green'))+sec('Privacy Settings')),
    ('backup-restore.html', 'Backup & Restore', 'fa-database', 'Backup Management', 'System backups', grid(3, card('Last Backup','2h ago','tw-text-accent-green')+card('Size','4.2 GB')+card('Stored','14'))+sec('Backup History')),
    ('api-tokens.html', 'API Tokens', 'fa-key', 'API Access Tokens', 'Manage API keys', sec('Active Tokens')),
    ('notification-preferences.html', 'Notification Preferences', 'fa-bell-slash', 'Notification Settings', 'Configure notifications', sec('Notification Channels')),
    ('system-health.html', 'System Health', 'fa-heartbeat', 'System Health Monitor', 'Platform performance', grid(4, card('Uptime','99.97%','tw-text-accent-green')+card('Response','124ms')+card('Users','1,247')+card('Errors','0.02%','tw-text-accent-green'))+sec('Service Status')),

    # Batch 6: Student Success & Wellness (10)
    ('learning-objectives.html', 'Learning Objectives', 'fa-crosshairs', 'Learning Objectives', 'Define course objectives', sec('Course Objectives')),
    ('competency-tracking.html', 'Competency Tracking', 'fa-medal', 'Competency Framework', 'Track competencies', grid(3, card('Competencies','24')+card('Avg Mastery','76%')+card('Certificates','45'))+sec('Competency Map')),
    ('wellness-check.html', 'Wellness Check', 'fa-heart', 'Student Wellness', 'Support student wellbeing', grid(3, card('Check-ins','47')+card('Flagged','5','tw-text-accent-orange')+card('Satisfaction','4.2/5'))+sec('Wellness Indicators')),
    ('goal-setting.html', 'Goal Setting', 'fa-flag', 'Personal Goals', 'Track academic goals', sec('My Goals')),
    ('certificates.html', 'Certificates', 'fa-certificate', 'Certificates & Badges', 'Earned certificates', grid(3, card('Certificates','7')+card('Badges','15')+card('Credits','24'))+sec('My Certificates')),
    ('tutoring.html', 'Tutoring', 'fa-chalkboard-teacher', 'Tutoring Services', 'Book tutoring sessions', grid(3, card('Tutors','12')+card('Sessions','8')+card('Your Sessions','2'))+sec('Available Sessions')),
    ('attendance.html', 'Attendance', 'fa-calendar-check', 'Attendance Records', 'Track attendance', grid(4, card('Present','142','tw-text-accent-green')+card('Absent','8','tw-text-red-500')+card('Late','6','tw-text-accent-orange')+card('Rate','91%'))+sec('Attendance by Date')),
    ('student-support.html', 'Student Support', 'fa-life-ring', 'Support Resources', 'Academic support', sec('Support Services')),
    ('resource-library.html', 'Resource Library', 'fa-book-open', 'Resource Library', 'Educational resources', grid(3, card('Resources','342')+card('Categories','18')+card('Downloads','1,205'))+sec('Featured Resources')),
    ('career-services.html', 'Career Services', 'fa-briefcase', 'Career Development', 'Career resources', grid(3, card('Jobs','47')+card('Internships','23')+card('Events','5'))+sec('Career Resources')),

    # Batch 7: Content & Media (10)
    ('content-library.html', 'Content Library', 'fa-photo-video', 'Content Library', 'Media assets', grid(4, card('Images','234')+card('Videos','45')+card('Documents','189')+card('Audio','23'))+sec('Recent Uploads')),
    ('video-studio.html', 'Video Studio', 'fa-film', 'Video Studio', 'Record course videos', sec('Your Videos')),
    ('audio-recorder.html', 'Audio Recorder', 'fa-microphone', 'Audio Recorder', 'Record audio content', sec('Audio Files')),
    ('image-editor.html', 'Image Editor', 'fa-image', 'Image Editor', 'Edit images', sec('Editor')),
    ('document-viewer.html', 'Document Viewer', 'fa-file-pdf', 'Document Preview', 'View documents', sec('Preview')),
    ('scorm-player.html', 'SCORM Player', 'fa-cubes', 'SCORM Content', 'Learning packages', sec('SCORM Module')),
    ('commons-content.html', 'Learning Commons', 'fa-share-alt', 'Learning Commons', 'Community content', grid(3, card('Shared','1,247')+card('My Shares','12')+card('Downloads','89'))+sec('Featured Content')),
    ('content-migration-status.html', 'Migration Status', 'fa-exchange-alt', 'Content Migration', 'Track migrations', sec('Active Migrations')),
    ('interactive-tools.html', 'Interactive Tools', 'fa-puzzle-piece', 'Interactive Tools', 'Active learning tools', sec('Available Tools')),
    ('accessibility-checker.html', 'Accessibility Checker', 'fa-universal-access', 'Accessibility Audit', 'Accessibility compliance', grid(3, card('Issues','12','tw-text-accent-orange')+card('Scanned','48')+card('Score','87%'))+sec('Issues')),

    # Batch 8: Scheduling, Events & Portals (8)
    ('event-registration.html', 'Event Registration', 'fa-ticket-alt', 'Event Registration', 'Register for events', sec('Upcoming Events')),
    ('room-booking.html', 'Room Booking', 'fa-door-open', 'Room Reservation', 'Book rooms', grid(3, card('Available','8')+card('My Bookings','2')+card('Capacity','5-50'))+sec('Available Rooms')),
    ('office-hours.html', 'Office Hours', 'fa-clock', 'Office Hours', 'Schedule office hours', sec('This Week')),
    ('academic-calendar.html', 'Academic Calendar', 'fa-calendar-alt', 'Academic Calendar', 'Important dates', sec('Upcoming Dates')),
    ('student-dashboard.html', 'Student Dashboard', 'fa-tachometer-alt', 'My Dashboard', 'Personalized student view', grid(4, card('Courses','5')+card('Due Soon','3','tw-text-accent-orange')+card('Unread','7')+card('GPA','3.72'))+sec('My Activity')),
    ('instructor-dashboard.html', 'Instructor Dashboard', 'fa-chalkboard', 'Instructor Hub', 'Teaching overview', grid(4, card('Courses','4')+card('Students','156')+card('Ungraded','23','tw-text-accent-orange')+card('Messages','5'))+sec('Course Activity')),
    ('parent-portal.html', 'Parent Portal', 'fa-users', 'Parent Access', 'Parent/guardian view', grid(3, card('Student GPA','3.72')+card('Attendance','96%','tw-text-accent-green')+card('Missing Work','1','tw-text-accent-orange'))+sec('Student Overview')),
    ('help-center.html', 'Help Center', 'fa-question-circle', 'Help & Support', 'Get help and support', sec('Frequently Asked Questions')+sec('Contact Support')),
]

created = 0
for item in pages:
    fn, title, icon, heading, subtitle, content = item
    if not os.path.exists(fn):
        with open(fn, 'w') as f:
            f.write(TEMPLATE.format(title=title, icon=icon, heading=heading, subtitle=subtitle, content=content))
        created += 1

total = len([f for f in os.listdir('.') if f.endswith('.html')])
print(f'Created {created} new pages')
print(f'Total HTML files: {total}')
