import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { joinPodWithCode, getPodDetails } from '@/lib/workspace';

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to join this Job Pod.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawCode = body.code || body.inviteCode;

    if (!rawCode || typeof rawCode !== 'string' || !rawCode.trim()) {
      return NextResponse.json(
        { success: false, error: 'A valid invite code is required.' },
        { status: 400 }
      );
    }

    const result = await joinPodWithCode(session.sub, rawCode.trim());
    if (!result.success || !result.workspace) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const details = await getPodDetails(result.workspace.id);

    return NextResponse.json({
      success: true,
      pod: details,
      alreadyMember: result.alreadyMember,
    });
  } catch (err) {
    console.error('[API /api/workspaces/join POST Error]:', err);
    return NextResponse.json({ success: false, error: 'Failed to join pod' }, { status: 500 });
  }
}
