import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.followUpDate !== undefined) updateData.followUpDate = body.followUpDate || null;
    if (body.appliedAt !== undefined) updateData.appliedAt = body.appliedAt ? new Date(body.appliedAt) : null;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.isImportant !== undefined) updateData.isImportant = Boolean(body.isImportant);

    let updated;
    try {
      updated = await db
        .update(jobs)
        .set(updateData)
        .where(eq(jobs.id, id))
        .returning();
    } catch (dbErr) {
      // If isImportant column has not been added to remote DB yet, retry without it
      if (updateData.isImportant !== undefined) {
        delete updateData.isImportant;
        updated = await db
          .update(jobs)
          .set(updateData)
          .where(eq(jobs.id, id))
          .returning();
      } else {
        throw dbErr;
      }
    }

    if (!updated || updated.length === 0) {
      return NextResponse.json({ success: false, error: { message: 'Job not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('[API /api/jobs/[id] PATCH Error]:', error);
    return NextResponse.json({ success: false, error: { message: 'Failed to update job' } }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db.delete(jobs).where(eq(jobs.id, id)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ success: false, error: { message: 'Job not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('[API /api/jobs/[id] DELETE Error]:', error);
    return NextResponse.json({ success: false, error: { message: 'Failed to delete job' } }, { status: 500 });
  }
}
