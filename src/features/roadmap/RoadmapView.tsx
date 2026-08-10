"use client";

import { RoadmapCurrentJobView } from "@/features/roadmap/RoadmapCurrentJobView";

/**
 * Single roadmap surface for all growth paths.
 * Always renders the diagnostic/API roadmap — never a stub curriculum.
 */
export function RoadmapView() {
  return <RoadmapCurrentJobView />;
}
