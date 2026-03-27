puts "Starting ReDefiners demo data seed..."

account = Account.default
admin = User.find(2) rescue User.first
admin.update!(name: "Dr. Sarah Mitchell", short_name: "Dr. Mitchell")

puts "=== Creating Teachers ==="
teachers = []
[
  { name: "Prof. Maria Garcia", email: "mgarcia@redefiners.edu", short: "Prof. Garcia" },
  { name: "Dr. James Chen", email: "jchen@redefiners.edu", short: "Dr. Chen" },
  { name: "Ms. Elena Rodriguez", email: "erodriguez@redefiners.edu", short: "Ms. Rodriguez" },
].each do |t|
  u = Pseudonym.find_by(unique_id: t[:email])&.user
  unless u
    u = User.create!(name: t[:name], short_name: t[:short])
    u.pseudonyms.create!(unique_id: t[:email], password: "Teacher2024!", password_confirmation: "Teacher2024!", account: account)
    u.communication_channels.create!(path: t[:email], path_type: "email") { |cc| cc.workflow_state = "active" }
  end
  teachers << u
  puts "  Teacher: #{u.name}"
end

puts "=== Creating Students ==="
students = []
[
  "Aisha Johnson", "Carlos Rivera", "Emily Chen", "David Kim",
  "Sarah Adams", "Brian Chen", "Diana Flores", "James Garcia",
  "Rosa Lopez", "Michael Kim", "Derek Nguyen", "Maria Santos",
].each_with_index do |name, i|
  email = name.downcase.gsub(" ", ".") + "@redefiners.edu"
  u = Pseudonym.find_by(unique_id: email)&.user
  unless u
    u = User.create!(name: name)
    u.pseudonyms.create!(unique_id: email, password: "Student2024!", password_confirmation: "Student2024!", account: account)
    u.communication_channels.create!(path: email, path_type: "email") { |cc| cc.workflow_state = "active" }
  end
  students << u
  puts "  Student: #{u.name}"
end

puts "=== Creating Courses ==="
term = EnrollmentTerm.find_or_create_by!(name: "Spring 2026", root_account: account) do |t|
  t.start_at = Date.new(2026, 1, 15)
  t.end_at = Date.new(2026, 5, 15)
end

courses_data = [
  { name: "Spanish 101: Introduction to Spanish", code: "SPAN101", teacher: 0, desc: "Introductory Spanish course covering foundational skills in listening, speaking, reading, and writing." },
  { name: "Biology 201: Cell Biology & Genetics", code: "BIO201", teacher: 1, desc: "In-depth study of cellular structure, molecular biology, and genetics." },
  { name: "English Composition 101", code: "ENG101", teacher: 2, desc: "Develop strong academic writing skills through essay composition and research methods." },
  { name: "Environmental Science 200", code: "ENVS200", teacher: 1, desc: "Explore interactions between humans and the natural environment." },
  { name: "World History: Modern Era", code: "HIST150", teacher: 2, desc: "Survey of major historical developments from 1500 to present." },
]

courses = courses_data.map do |cd|
  c = Course.find_by(course_code: cd[:code])
  unless c
    c = account.courses.create!(
      name: cd[:name], course_code: cd[:code], enrollment_term: term,
      syllabus_body: "<h2>Course Description</h2><p>#{cd[:desc]}</p><h2>Instructor</h2><p>#{teachers[cd[:teacher]].name}</p>",
      start_at: term.start_at, conclude_at: term.end_at, default_view: "modules",
    )
    c.offer!
  end
  c.enroll_teacher(teachers[cd[:teacher]], enrollment_state: "active") unless c.teacher_enrollments.where(user: teachers[cd[:teacher]]).exists?
  students.each { |s| c.enroll_student(s, enrollment_state: "active") unless c.student_enrollments.where(user: s).exists? }
  puts "  Course: #{c.name} (#{c.enrollments.count} enrolled)"
  c
end

puts "=== Creating Assignment Groups ==="
courses.each do |c|
  { "Essays" => 30, "Quizzes" => 25, "Participation" => 15, "Final Project" => 30 }.each do |name, weight|
    c.assignment_groups.find_or_create_by!(name: name) { |g| g.group_weight = weight }
  end
end

puts "=== Creating Assignments ==="
[
  [0, "Essays", "Mi Familia Presentation", 100, -21, "Create a presentation about your family using Spanish vocabulary."],
  [0, "Quizzes", "Chapter 3 Vocabulary Quiz", 50, -14, "Quiz covering food and dining vocabulary."],
  [0, "Quizzes", "Chapter 4 Preterite vs. Imperfect", 40, -7, "Assessment on preterite vs. imperfect tenses."],
  [0, "Participation", "Discussion: Cultura Hispana", 25, -10, "Discuss an aspect of Hispanic culture."],
  [0, "Essays", "Oral Presentation: Mi Ciudad", 75, 3, "Present about your city in Spanish."],
  [0, "Quizzes", "Chapter 5 Subjunctive Quiz", 50, 5, "Quiz on the Spanish subjunctive mood."],
  [0, "Final Project", "Midterm Exam: Chapters 1-6", 150, 14, "Comprehensive midterm exam."],
  [1, "Essays", "Lab Report: Cell Microscopy", 100, -18, "Formal lab report on cell microscopy observations."],
  [1, "Quizzes", "Quiz 3: Cell Division", 50, -12, "Quiz covering mitosis and meiosis."],
  [1, "Quizzes", "Quiz 4: DNA Replication", 50, -5, "Assessment on DNA structure and replication."],
  [1, "Essays", "Research Paper: Gene Therapy", 150, 7, "Research paper on gene therapy approaches."],
  [1, "Final Project", "Genetics Problem Set", 100, 21, "25 genetics problems on inheritance patterns."],
  [2, "Essays", "Persuasive Essay: Climate Change", 100, -15, "Persuasive essay arguing for climate policies."],
  [2, "Essays", "Research Paper: Renewable Energy", 150, -8, "Research paper on renewable energy technologies."],
  [2, "Essays", "Literary Analysis: Modern Poetry", 100, 4, "Analyze a modern poem using literary criticism."],
  [2, "Participation", "Week 8 Discussion Board", 25, -5, "Weekly discussion on narrative techniques."],
  [2, "Final Project", "Capstone: Sustainability Action Plan", 300, 35, "Develop a sustainability action plan."],
].each do |ci, gn, name, pts, days, desc|
  c = courses[ci]
  g = c.assignment_groups.find_by(name: gn)
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

puts "=== Grading Past-Due Assignments ==="
courses.each do |c|
  c.assignments.where("due_at < ?", Time.now).each do |a|
    students.each do |s|
      next if a.submissions.find_by(user: s)&.score.present?
      score = (a.points_possible * (0.6 + rand * 0.4)).round(1)
      begin
        sub = a.grade_student(s, grader: c.teachers.first, score: score).first
        sub.update(submitted_at: a.due_at - rand(48).hours, workflow_state: "graded") if sub
      rescue => e
        puts "    Skip grade: #{e.message[0..40]}"
      end
    end
  end
  puts "  Graded: #{c.course_code}"
end

puts "=== Creating Modules ==="
span = courses[0]
[
  ["Getting Started", ["Welcome & Course Overview", "Introduce Yourself Discussion", "Syllabus (PDF)", "Pre-Assessment Quiz"]],
  ["Unit 1 - Basic Vocabulary", ["Vocabulary: Greetings", "Pronunciation Audio", "Homework: Introductions", "Quiz 1: Greetings"]],
  ["Unit 2 - Present Tense", ["Video: AR Verb Conjugation", "Video: ER/IR Verbs", "Practice Worksheet", "Quiz 2: Present Tense"]],
  ["Unit 3 - Food & Dining", ["Reading: Restaurant Culture", "Vocabulary: Food Terms", "Role Play: Ordering Food", "Chapter 3 Quiz"]],
].each_with_index do |data, i|
  m = span.context_modules.find_or_create_by!(name: data[0]) { |cm| cm.position = i + 1; cm.workflow_state = "active" }
  data[1].each { |item| m.add_item(type: "external_url", title: item, url: "https://fineract.us/page-view.html", new_tab: false) unless m.content_tags.find_by(title: item) }
  puts "  Module: #{m.name} (#{m.content_tags.count} items)"
end

puts "=== Creating Discussions ==="
[
  [0, "Welcome & Introductions", "Please introduce yourself and share why you are learning Spanish!"],
  [0, "Subjunctive Mood - When to use it?", "Share examples of subjunctive vs. indicative usage."],
  [0, "Favorite Spanish Films", "Share your favorite Spanish-language movies or TV series!"],
  [1, "Ethics of Gene Editing (CRISPR)", "What are the ethical implications of CRISPR technology?"],
  [2, "The Power of Storytelling", "How does storytelling shape our understanding of the world?"],
].each do |ci, title, msg|
  c = courses[ci]
  unless c.discussion_topics.find_by(title: title)
    c.discussion_topics.create!(title: title, message: "<p>#{msg}</p>", user: c.teachers.first, workflow_state: "active", discussion_type: "threaded", posted_at: rand(20).days.ago)
    puts "  Discussion: #{title}"
  end
end

puts "=== Creating Announcements ==="
[
  [0, "Office Hours Changed This Week", "Thursday office hours moved to Friday 2-4 PM."],
  [0, "Midterm Study Guide Available", "Study guide for Chapters 1-6 is now in Files."],
  [1, "Lab Safety Reminder", "Wear protective equipment during all lab sessions."],
  [1, "Guest Lecturer Next Wednesday", "Dr. Amanda Foster from NIH will speak about gene therapy."],
  [2, "Research Paper Deadline Extended", "New due date is March 29. Use the extra time wisely."],
].each do |ci, title, msg|
  c = courses[ci]
  unless c.announcements.find_by(title: title)
    c.announcements.create!(title: title, message: "<p>#{msg}</p>", user: c.teachers.first, workflow_state: "active", posted_at: rand(14).days.ago)
    puts "  Announcement: #{title}"
  end
end

puts "=== Creating Calendar Events ==="
[
  [0, "Midterm Exam", 14, "Comprehensive exam covering Chapters 1-6"],
  [0, "Cultural Day: Dia de los Muertos", 21, "Celebrate the Day of the Dead tradition"],
  [1, "Lab: DNA Extraction", 3, "Hands-on DNA extraction from strawberries"],
  [1, "Guest Lecture: Gene Therapy", 7, "Dr. Foster discusses gene therapy developments"],
  [2, "Peer Review Workshop", 5, "Bring 2 printed copies of your paper draft"],
].each do |ci, title, days, desc|
  c = courses[ci]
  unless c.calendar_events.find_by(title: title)
    c.calendar_events.create!(title: title, start_at: days.days.from_now, end_at: days.days.from_now + 1.hour, description: desc)
    puts "  Event: #{title}"
  end
end

puts ""
puts "=" * 50
puts "Demo data seed complete!"
puts "  Users: #{User.count}"
puts "  Courses: #{Course.count}"
puts "  Assignments: #{Assignment.count}"
puts "  Graded Submissions: #{Submission.where.not(score: nil).count}"
puts "  Discussions: #{DiscussionTopic.count}"
puts "  Announcements: #{Announcement.count}"
puts "  Modules: #{ContextModule.count}"
puts "  Calendar Events: #{CalendarEvent.count}"
puts "=" * 50
