/**
 * SECTION_REGISTRY — defines every possible resume section
 *
 * id        → unique key, matches resumeData key
 * label     → display name
 * icon      → emoji icon for the modal
 * locked    → if true, cannot be removed or reordered
 * defaultData → what gets added to resumeData when section is activated
 */

import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
} from 'lucide-react';

export const SECTION_REGISTRY = [
  {
    id: 'contact',
    label: 'Personal Info',
    icon: User,
    locked: true,
    defaultData: null,
  },
  {
    id: 'experience',
    label: 'Work Experience',
    icon: Briefcase,
    locked: false,
    defaultData: [],
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    locked: false,
    defaultData: [],
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Wrench,
    locked: false,
    defaultData: [],
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderGit2,
    locked: false,
    defaultData: [],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: Award,
    locked: false,
    defaultData: [],
  },
];

// Quick lookup by id
export const SECTION_MAP = Object.fromEntries(
  SECTION_REGISTRY.map((s) => [s.id, s]),
);
