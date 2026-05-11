// lib/jobs.ts

// This is the shape every job from any API will conform to.
// TypeScript will enforce this — if a field is missing or wrong type, it errors at compile time.
export type Job = {
  id: string;           // unique ID from the source API
  title: string;
  company: string;
  job_url: string;
  source: "remotive" | "himalayas"; // union type — only these two strings are valid
};

// Shape of a single job object returned by the Remotive API
type RemotiveJob = {
  id: number;
  title: string;
  company_name: string;
  url: string;
};

// Shape of a single job object returned by the Himalayas API
type HimalayasJob = {
  guid?: string;
  title: string;
  companyName: string;
  applicationLink: string;
};

function getHimalayasJobId(job: HimalayasJob, index: number) {
  const uniqueValue =
    job.guid || job.applicationLink || `${job.companyName}-${job.title}-${index}`;

  return `himalayas-${uniqueValue}`;
}

// Remotive API — returns remote jobs, free, no auth needed
export async function fetchRemotive(keyword: string): Promise<Job[]> {
  const res = await fetch(
    `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword)}&limit=20`,
    { next: { revalidate: 3600 } } // Next.js caches this for 1 hour — no hammering the API on every visit
  );

  if (!res.ok) return []; // if the API is down, return empty instead of crashing

  const data = await res.json();

  // data.jobs is the array Remotive returns — we map it to our unified Job type
  return data.jobs.map((job: RemotiveJob) => ({
    id: `remotive-${job.id}`,        // prefix prevents ID collisions with Himalayas
    title: job.title,
    company: job.company_name,
    job_url: job.url,
    source: "remotive" as const,     // "as const" tells TS this is the literal "remotive", not just any string
  }));
}

// Himalayas API — also free, no auth needed
export async function fetchHimalayas(keyword: string): Promise<Job[]> {
  const res = await fetch(
    `https://himalayas.app/jobs/api?q=${encodeURIComponent(keyword)}&limit=20`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return data.jobs.map((job: HimalayasJob, index: number) => ({
    id: getHimalayasJobId(job, index), // Himalayas uses guid as the unique job ID
    title: job.title,
    company: job.companyName,
    job_url: job.applicationLink,
    source: "himalayas" as const,
  }));
}
