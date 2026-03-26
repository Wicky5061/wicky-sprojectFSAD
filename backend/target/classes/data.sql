-- Seed Webinars (Users are seeded via DataSeeder with BCrypt-hashed passwords)
INSERT INTO webinars (id, title, description, instructor, date_time, duration_minutes, stream_url, cover_image_url, max_participants, category, status) VALUES
(1, 'AI & Machine Learning Fundamentals', 'Deep dive into neural networks, deep learning logic, and NLP.', 'Dr. Rajesh Kumar', '2026-03-25T15:00:00', 90, 'https://meet.jit.si/webinarhub-ai', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800',  1000, 'Artificial Intelligence', 'LIVE'),
(2, 'Full Stack Web Development with React', 'Master the MERN stack with modern practices and tools.', 'Sarah Johnson', '2026-04-10T14:00:00', 120, 'https://meet.jit.si/webinarhub-react', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800', 1500, 'Frontend', 'UPCOMING'),
(3, 'Cloud Computing with AWS', 'Learn how to deploy scalable apps on AWS.', 'Michael Chen', '2026-04-12T10:00:00', 90, 'https://meet.jit.si/webinarhub-aws', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800', 1000, 'Cloud computing', 'UPCOMING'),
(4, 'Python for Data Science', 'Data analysis and visualization in Python using Pandas and Matplotlib.', 'Priya Sharma', '2025-10-15T09:00:00', 120, 'https://meet.jit.si/webinarhub-python', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800',  2500, 'Data Science', 'COMPLETED'),
(5, 'Cybersecurity Essentials', 'Protect apps from modern web vulnerabilities and hacks.', 'Alex Williams', '2025-12-05T11:00:00', 60, 'https://meet.jit.si/webinarhub-cyber', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800', 2000, 'Security', 'COMPLETED'),
(6, 'Blockchain Basics', 'Understand decentralization, smart contracts and tokens.', 'James Lee', '2025-11-20T10:00:00', 90, '', 'https://images.unsplash.com/photo-1611080645604-cb8e24c6ddfc?q=80&w=800', 500, 'Crypto', 'CANCELLED');

-- Fix sequences to avoid primary key violations on new inserts
ALTER TABLE webinars ALTER COLUMN id RESTART WITH 100;
ALTER TABLE registrations ALTER COLUMN id RESTART WITH 100;
ALTER TABLE resources ALTER COLUMN id RESTART WITH 100;
