export const NAV = [['home','Home'],['about','About'],['certification','Certification'],['projects','Projects'],['journey','Journey'],['contact','Contact']] as const
 
export type Category = 'Software' | 'Network & Tools'
export interface Project { id: string; title: string; cat: Category; summary: string; tags: string[]; purpose: string; features: string[]; contribution: string; url?: string }
 
// Deskripsi bersifat generik. Ganti dengan detail asli; isi `url` hanya jika tautan valid tersedia.
export const PROJECTS: Project[] = [
  { id: 'portfolio', title: 'Personal Portfolio', cat: 'Software', summary: 'This website: responsive, themeable, built with React and Framer Motion.', tags: ['React', 'TypeScript', 'Framer Motion'], purpose: 'Present profile, projects and contact in one place.', features: ['Light and dark themes', 'Project filter and detail panel', 'Responsive layout'], contribution: 'Design and development.' },
  { id: 'topology', title: 'Network Lab Topology', cat: 'Network & Tools', summary: 'Lab exercise on segmenting and routing a small network (lab, not production).', tags: ['Cisco', 'VLAN', 'Routing'], purpose: 'Practice network design in a simulated environment.', features: ['VLAN segmentation', 'Inter-VLAN routing'], contribution: 'Placeholder: describe your role.' },
  { id: 'python', title: 'Python Utility Scripts', cat: 'Software', summary: 'Small command-line scripts that automate repetitive tasks.', tags: ['Python', 'Automation', 'CLI'], purpose: 'Save time on routine work.', features: ['Command-line usage', 'Task automation'], contribution: 'Placeholder: describe your role.' },
  { id: 'noc', title: 'NOC Monitoring Concepts', cat: 'Network & Tools', summary: 'Study notes on monitoring and troubleshooting network operations.', tags: ['NOC', 'Monitoring', 'TCP/IP'], purpose: 'Learn how network operations centers detect and handle incidents.', features: ['Monitoring fundamentals', 'TCP/IP troubleshooting'], contribution: 'Placeholder: describe your role.' },
]
 
export const SKILLS = [
  ['System Administration', 'Managing and maintaining systems and services.'],
  ['Cyber Security Analysis', 'Understanding threats and basic defensive practice.'],
  ['Artificial Intelligence', 'Exploring AI concepts and practical tools.'],
  ['Network Operations', 'Monitoring, routing and troubleshooting networks.'],
]
 
// 9 kartu placeholder. Ganti `title`, `issuer`, dan isi `url` (tautan verifikasi asli) untuk tiap sertifikat.
export const CERTS: { title: string; issuer: string; url?: string }[] = Array.from({ length: 9 }, () => ({ title: 'Certification title', issuer: 'Issuer name' }))
 
// Isi `url` dengan tautan profil asli Anda. Jika kosong, ikon tampil nonaktif.
export const SOCIALS: { name: 'LinkedIn' | 'GitHub'; url?: string }[] = [
  { name: 'LinkedIn', url: '' },
  { name: 'GitHub', url: '' },
]
 
// Tanggal sengaja dikosongkan. Isi `when` jika sudah pasti.
export const JOURNEY: { title: string; place: string; text: string; when?: string }[] = [
  { title: 'Computer and Network Engineering (TKJ)', place: 'SMKN 1 Jakarta', text: 'Vocational foundation in networking and computer systems.' },
  { title: 'Information Technology', place: 'Universitas BSI', text: 'Current studies in Information Technology.' },
  { title: 'Next: add your milestone', place: 'Placeholder', text: 'Replace with a real course, internship or project.' },
]
