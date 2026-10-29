export async function patchJob(jobId: string, data: Record<string, unknown>) {
  try {
    const res = await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error(`Failed to patch job ${jobId}:`, err);
    return null;
  }
}

export async function deleteJobApi(jobId: string) {
  try {
    const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    return await res.json();
  } catch (err) {
    console.error(`Failed to delete job ${jobId}:`, err);
    return null;
  }
}
