import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';
import { getSessionFromCookies, isAdminEmail } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    const isUserAdmin = !session || session.role === 'admin' || isAdminEmail(session?.email || '');

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.followUpDate !== undefined) updateData.followUpDate = body.followUpDate || null;
    if (body.appliedAt !== undefined)
      updateData.appliedAt = body.appliedAt ? new Date(body.appliedAt) : null;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.isImportant !== undefined) updateData.isImportant = Boolean(body.isImportant);
    if (body.referralStatus !== undefined) updateData.referralStatus = body.referralStatus;
    if (body.referrerName !== undefined) updateData.referrerName = body.referrerName;
    if (body.referrerContact !== undefined) updateData.referrerContact = body.referrerContact;
    if (body.referralNotes !== undefined) updateData.referralNotes = body.referralNotes;

    const userScope = isUserAdmin
      ? or(eq(jobs.userId, session?.sub || ''), isNull(jobs.userId))
      : eq(jobs.userId, session.sub);

    const userCondition = and(eq(jobs.id, id), userScope);

    let updated;
    try {
      updated = await db.update(jobs).set(updateData).where(userCondition).returning();
    } catch (dbErr) {
      if (updateData.isImportant !== undefined) {
        delete updateData.isImportant;
        updated = await db.update(jobs).set(updateData).where(userCondition).returning();
      } else {
        throw dbErr;
      }
    }

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Job not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('[API /api/jobs/[id] PATCH Error]:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update job' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    const isUserAdmin = !session || session.role === 'admin' || isAdminEmail(session?.email || '');

    const { id } = await params;
    const userScope = isUserAdmin
      ? or(eq(jobs.userId, session?.sub || ''), isNull(jobs.userId))
      : eq(jobs.userId, session.sub);

    const deleted = await db
      .delete(jobs)
      .where(and(eq(jobs.id, id), userScope))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Job not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('[API /api/jobs/[id] DELETE Error]:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to delete job' } },
      { status: 500 }
    );
  }
}
