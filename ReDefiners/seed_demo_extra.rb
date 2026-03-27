puts "Starting ReDefiners EXTRA demo data seed (Rounds 2-5)..."

account = Account.default

# Get existing teachers
teachers = ["mgarcia@redefiners.edu", "jchen@redefiners.edu", "erodriguez@redefiners.edu"].map { |e| Pseudonym.find_by(unique_id: e)&.user }.compact
puts "Found #{teachers.count} teachers"

# Get existing courses
courses = Course.where(course_code: ["SPAN101", "BIO201", "ENG101", "ENVS200", "HIST150"]).to_a
puts "Found #{courses.count} courses"

# ─── ROUND 2: More Students (12 new) ───
puts "\n=== Round 2: Additional Students ==="
round2_students = []
[
  "Alex Thompson", "Priya Patel", "Marcus Williams", "Sofia Morales",
  "Tyler Brooks", "Yuki Tanaka", "Isabella Martinez", "Liam OConnor",
  "Fatima Ali", "Ryan Chang", "Olivia Washington", "Noah Petrov",
].each do |name|
  email = name.downcase.gsub(" ", ".").gsub("'", "") + "@redefiners.edu"
  u = Pseudonym.find_by(unique_id: email)&.user
  unless u
    u = User.create!(name: name)
    u.pseudonyms.create!(unique_id: email, password: "Student2024!", password_confirmation: "Student2024!", account: account)
    u.communication_channels.create!(path: email, path_type: "email") { |cc| cc.workflow_state = "active" }
    courses.each { |c| c.enroll_student(u, enrollment_state: "active") unless c.student_enrollments.where(user: u).exists? }
  end
  round2_students << u
  puts "  Student: #{u.name}"
end

# ─── ROUND 2: More Assignments ───
puts "\n=== Round 2: Additional Assignments ==="
r2_assignments = [
  [0, "Essays", "Cultural Comparison Essay", 100, -25, "Compare two Spanish-speaking countries cultures."],
  [0, "Quizzes", "Chapter 1-2 Review Quiz", 40, -28, "Comprehensive review of Chapters 1 and 2."],
  [0, "Participation", "Conversation Partner Log Week 3", 20, -20, "Document your conversation partner session."],
  [0, "Quizzes", "Listening Comprehension: Podcast", 35, -16, "Listen to a Spanish podcast and answer questions."],
  [1, "Essays", "Enzyme Kinetics Lab Report", 100, -22, "Report on enzyme kinetics experiment results."],
  [1, "Quizzes", "Quiz 1: Cell Organelles", 50, -25, "Quiz on cell organelle structure and function."],
  [1, "Quizzes", "Quiz 2: Membrane Transport", 50, -19, "Assessment on passive and active transport mechanisms."],
  [1, "Participation", "Lab Notebook Check 1", 30, -15, "Submit lab notebook for review."],
  [2, "Essays", "Descriptive Essay: A Place That Matters", 100, -24, "Write a descriptive essay about a meaningful place."],
  [2, "Quizzes", "Grammar Quiz: Semicolons & Colons", 30, -22, "Quiz on proper semicolon and colon usage."],
  [2, "Participation", "Peer Review: Persuasive Essay", 25, -12, "Review and provide feedback on a classmates essay."],
  [2, "Essays", "Argumentative Essay: Technology in Education", 120, -3, "Argue for or against increased technology in classrooms."],
  [3, "Essays", "Ecosystem Analysis Report", 100, -20, "Analyze a local ecosystem and its biodiversity."],
  [3, "Quizzes", "Quiz: Climate Science Basics", 40, -18, "Assessment on greenhouse effect and climate models."],
  [3, "Participation", "Field Trip Reflection", 25, -10, "Reflect on the local wetland field trip experience."],
  [3, "Final Project", "Environmental Impact Assessment", 200, 20, "Complete EIA for a proposed development project."],
  [4, "Essays", "Primary Source Analysis: Industrial Revolution", 100, -23, "Analyze a primary source from the Industrial Revolution."],
  [4, "Quizzes", "Map Quiz: Colonial Empires", 40, -17, "Identify colonial territories on a world map."],
  [4, "Participation", "Discussion: Causes of WWI", 25, -9, "Discuss the interconnected causes of World War I."],
  [4, "Final Project", "Historical Research Paper", 250, 25, "Research paper on a topic of your choice from 1800-1950."],
]

r2_assignments.each do |ci, gn, name, pts, days, desc|
  c = courses[ci]
  next unless c
  g = c.assignment_groups.find_by(name: gn)
  next unless g
  unless c.assignments.find_by(title: name)
    c.assignments.create!(
      title: name, assignment_group: g, points_possible: pts,
      due_at: days.days.from_now, description: "<p>#{desc}</p>",
      submission_types: "online_text_entry,online_upload",
      workflow_state: "published", grading_type: "points",
    )
    puts "  Assignment: #{name}"
  end
end

# ─── ROUND 3: More Teachers & Courses ───
puts "\n=== Round 3: Additional Courses ==="
r3_teachers = []
[
  { name: "Dr. Amanda Foster", email: "afoster@redefiners.edu" },
  { name: "Prof. Robert Williams", email: "rwilliams@redefiners.edu" },
].each do |t|
  u = Pseudonym.find_by(unique_id: t[:email])&.user
  unless u
    u = User.create!(name: t[:name], short_name: t[:name].split(" ").last)
    u.pseudonyms.create!(unique_id: t[:email], password: "Teacher2024!", password_confirmation: "Teacher2024!", account: account)
    u.communication_channels.create!(path: t[:email], path_type: "email") { |cc| cc.workflow_state = "active" }
  end
  r3_teachers << u
  puts "  Teacher: #{u.name}"
end

term = EnrollmentTerm.find_by(name: "Spring 2026")
all_students = User.joins(:student_enrollments).distinct.to_a

r3_courses = [
  { name: "Mathematics 101: College Algebra", code: "MATH101", teacher: r3_teachers[0], desc: "Fundamental algebraic concepts including functions, equations, and graphing." },
  { name: "Computer Science 110: Intro to Programming", code: "CS110", teacher: r3_teachers[1], desc: "Introduction to programming concepts using Python." },
  { name: "Psychology 101: Introduction to Psychology", code: "PSYCH101", teacher: r3_teachers[0], desc: "Survey of major psychological theories, research methods, and applications." },
  { name: "Art History 200: Renaissance to Modern", code: "ARTH200", teacher: r3_teachers[1], desc: "Exploration of Western art from the Renaissance through contemporary movements." },
  { name: "Music Appreciation 100", code: "MUS100", teacher: r3_teachers[0], desc: "Introduction to music theory, history, and diverse musical traditions." },
].map do |cd|
  c = Course.find_by(course_code: cd[:code])
  unless c
    c = account.courses.create!(
      name: cd[:name], course_code: cd[:code], enrollment_term: term,
      syllabus_body: "<h2>#{cd[:name]}</h2><p>#{cd[:desc]}</p><p>Instructor: #{cd[:teacher].name}</p>",
      start_at: term.start_at, conclude_at: term.end_at, default_view: "modules",
    )
    c.offer!
  end
  c.enroll_teacher(cd[:teacher], enrollment_state: "active") unless c.teacher_enrollments.where(user: cd[:teacher]).exists?
  all_students.sample(18).each { |s| c.enroll_student(s, enrollment_state: "active") unless c.student_enrollments.where(user: s).exists? }
  { "Homework" => 25, "Exams" => 35, "Labs/Projects" => 25, "Participation" => 15 }.each { |n, w| c.assignment_groups.find_or_create_by!(name: n) { |g| g.group_weight = w } }
  puts "  Course: #{c.name} (#{c.enrollments.count} enrolled)"
  c
end

# ─── ROUND 3: Assignments for new courses ───
puts "\n=== Round 3: New Course Assignments ==="
[
  [0, "Homework", "Problem Set 1: Linear Equations", 50, -20, "Solve 20 linear equations."],
  [0, "Homework", "Problem Set 2: Quadratic Functions", 50, -13, "Graph and solve quadratic functions."],
  [0, "Exams", "Exam 1: Chapters 1-3", 100, -10, "First exam covering algebraic foundations."],
  [0, "Homework", "Problem Set 3: Polynomials", 50, -6, "Factor and simplify polynomial expressions."],
  [0, "Exams", "Midterm Exam", 150, 10, "Comprehensive midterm examination."],
  [1, "Labs/Projects", "Lab 1: Hello World Programs", 40, -22, "Write your first Python programs."],
  [1, "Homework", "Assignment 1: Variables & Data Types", 50, -18, "Practice with Python variables and data types."],
  [1, "Labs/Projects", "Lab 2: Control Flow", 50, -14, "Implement conditional statements and loops."],
  [1, "Homework", "Assignment 2: Functions", 60, -8, "Write reusable functions in Python."],
  [1, "Exams", "Coding Exam 1", 100, -4, "Timed coding exam on fundamentals."],
  [1, "Labs/Projects", "Project: Calculator App", 120, 12, "Build a calculator application in Python."],
  [2, "Homework", "Reading Response: Freud", 30, -19, "Respond to assigned readings on Freudian psychology."],
  [2, "Homework", "Research Methods Worksheet", 40, -14, "Complete worksheet on experimental design."],
  [2, "Exams", "Exam 1: Foundations of Psychology", 100, -7, "Exam on psychological foundations and history."],
  [2, "Participation", "Case Study Discussion: Memory", 25, -5, "Discuss the HM case study on memory."],
  [2, "Labs/Projects", "Research Proposal", 150, 15, "Write a research proposal on a psychology topic."],
  [3, "Homework", "Visual Analysis: Mona Lisa", 40, -21, "Formal visual analysis of Da Vincis Mona Lisa."],
  [3, "Homework", "Comparison Essay: Baroque vs. Rococo", 60, -12, "Compare and contrast Baroque and Rococo styles."],
  [3, "Exams", "Slide Identification Exam", 100, -6, "Identify and analyze 30 artworks from slides."],
  [3, "Labs/Projects", "Museum Visit Report", 80, 8, "Visit a museum and write a detailed report."],
  [4, "Homework", "Listening Journal Week 1-4", 40, -18, "Document your listening experiences."],
  [4, "Homework", "Instrument Family Report", 50, -11, "Research and present on an instrument family."],
  [4, "Exams", "Listening Exam: Classical Period", 80, -4, "Identify composers and pieces from audio clips."],
  [4, "Labs/Projects", "Concert Review", 60, 6, "Attend a live concert and write a review."],
].each do |ci, gn, name, pts, days, desc|
  c = r3_courses[ci]
  next unless c
  g = c.assignment_groups.find_by(name: gn)
  next unless g
  unless c.assignments.find_by(title: name)
    c.assignments.create!(title: name, assignment_group: g, points_possible: pts, due_at: days.days.from_now, description: "<p>#{desc}</p>", submission_types: "online_text_entry,online_upload", workflow_state: "published", grading_type: "points")
    puts "  Assignment: #{name}"
  end
end

# ─── ROUND 4: More Discussions, Announcements, Events ───
puts "\n=== Round 4: More Discussions ==="
[
  [0, "Best Language Learning Apps", "Share your favorite apps for learning Spanish outside class."],
  [0, "Music in Spanish - Share a Song", "Share a Spanish song you enjoy and explain the lyrics."],
  [1, "GMOs: Safe or Dangerous?", "What does the science say about genetically modified organisms?"],
  [1, "Career Paths in Biology", "What career are you considering with a biology degree?"],
  [2, "AI and Academic Writing", "How should universities handle AI writing tools?"],
  [3, "Local Environmental Issues", "What environmental challenges does your community face?"],
  [3, "Sustainable Living Tips", "Share practical tips for living more sustainably."],
  [4, "History Repeating Itself?", "Can you identify patterns in history that seem to repeat?"],
  [4, "Most Influential Historical Figure", "Who do you think was the most influential person in modern history?"],
].each do |ci, title, msg|
  c = courses[ci] || r3_courses[ci - 5] rescue nil
  next unless c
  unless c.discussion_topics.find_by(title: title)
    c.discussion_topics.create!(title: title, message: "<p>#{msg}</p>", user: c.teachers.first, workflow_state: "active", discussion_type: "threaded", posted_at: rand(25).days.ago)
    puts "  Discussion: #{title}"
  end
end

puts "\n=== Round 4: More Announcements ==="
[
  [0, "Extra Credit Opportunity", "Attend the Spanish Film Festival this Saturday for 10 bonus points."],
  [0, "Class Canceled March 28", "No class on March 28 due to faculty development day."],
  [1, "New Lab Supplies Available", "Updated microscope slides are now available in the lab storage room."],
  [2, "Writing Center Hours Extended", "The Writing Center is now open until 9 PM on weekdays."],
  [2, "Plagiarism Policy Reminder", "Please review the plagiarism policy before submitting your research papers."],
  [3, "Earth Day Event Planning", "Join us in planning our campus Earth Day celebration on April 22."],
  [4, "Museum Passes Available", "Free museum passes for the History Museum are available at my office."],
].each do |ci, title, msg|
  c = courses[ci]
  next unless c
  unless c.announcements.find_by(title: title)
    c.announcements.create!(title: title, message: "<p>#{msg}</p>", user: c.teachers.first, workflow_state: "active", posted_at: rand(14).days.ago)
    puts "  Announcement: #{title}"
  end
end

puts "\n=== Round 4: More Calendar Events ==="
[
  [0, "Spanish Film Night", 10, "Screening of Pan's Labyrinth with English subtitles"],
  [0, "Conversation Partner Meetup", 4, "Meet your conversation partners in the Student Center"],
  [1, "Lab: Gel Electrophoresis", 6, "Hands-on gel electrophoresis experiment"],
  [1, "Review Session: Midterm", 12, "Optional review session before the midterm exam"],
  [2, "Writing Workshop: Citations", 8, "Learn proper MLA and APA citation formats"],
  [3, "Field Trip: Local Wetlands", 9, "Bus departs at 8 AM from the Science Building"],
  [4, "Documentary Screening: WWI", 11, "Screening of They Shall Not Grow Old"],
].each do |ci, title, days, desc|
  c = courses[ci]
  next unless c
  unless c.calendar_events.find_by(title: title)
    c.calendar_events.create!(title: title, start_at: days.days.from_now, end_at: days.days.from_now + 2.hours, description: desc)
    puts "  Event: #{title}"
  end
end

# ─── ROUND 5: More modules for other courses ───
puts "\n=== Round 5: Modules for All Courses ==="
[
  [1, [["Introduction to Biology", ["Course Overview", "Lab Safety Protocol", "Scientific Method Review"]],
       ["Cell Structure", ["Cell Theory", "Prokaryotic vs Eukaryotic", "Organelle Functions", "Lab: Cell Observation"]],
       ["Genetics Fundamentals", ["DNA Structure", "Replication Process", "Gene Expression", "Practice Problems"]]]],
  [2, [["Writing Foundations", ["Grammar Review", "Sentence Structure", "Paragraph Development"]],
       ["Research Skills", ["Finding Sources", "Evaluating Credibility", "MLA Format Guide", "Annotated Bibliography"]],
       ["Essay Types", ["Narrative Essay", "Persuasive Essay", "Analytical Essay", "Research Paper Guide"]]]],
].each do |ci, mods|
  c = courses[ci]
  next unless c
  mods.each_with_index do |mod_data, i|
    m = c.context_modules.find_or_create_by!(name: mod_data[0]) { |cm| cm.position = i + 1; cm.workflow_state = "active" }
    mod_data[1].each { |item| m.add_item(type: "external_url", title: item, url: "https://fineract.us/page-view.html", new_tab: false) unless m.content_tags.find_by(title: item) }
    puts "  Module: #{m.name} (#{m.content_tags.count} items) [#{c.course_code}]"
  end
end

# ─── Grade all past-due assignments ───
puts "\n=== Grading All Past-Due Assignments ==="
(courses + r3_courses).compact.each do |c|
  c.assignments.where("due_at < ?", Time.now).each do |a|
    c.student_enrollments.active.each do |enrollment|
      s = enrollment.user
      next if a.submissions.find_by(user: s)&.score.present?
      score = (a.points_possible * (0.55 + rand * 0.45)).round(1)
      begin
        sub = a.grade_student(s, grader: c.teachers.first, score: score).first
        sub.update(submitted_at: a.due_at - rand(72).hours, workflow_state: "graded") if sub
      rescue => e
      end
    end
  end
  puts "  Graded: #{c.course_code}"
end

puts "\n" + "=" * 50
puts "EXTRA seed complete!"
puts "  Total Users: #{User.count}"
puts "  Total Courses: #{Course.count}"
puts "  Total Assignments: #{Assignment.count}"
puts "  Total Graded Submissions: #{Submission.where.not(score: nil).count}"
puts "  Total Discussions: #{DiscussionTopic.count}"
puts "  Total Announcements: #{Announcement.count}"
puts "  Total Modules: #{ContextModule.count}"
puts "  Total Calendar Events: #{CalendarEvent.count}"
puts "=" * 50
