import { supabase } from '@/lib/supabase';

interface Report {
    id: string;
    postId: string;
    reason: string;
    createdAt: string;
}

export async function POST(request: Request) {
    try {
        const { postId, reason } = await request.json();

        if (!postId || !reason) {
            return Response.json({ error: 'postId and reason are required' }, { status: 400 });
        }

        const newReport: Report = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
            postId,
            reason,
            createdAt: new Date().toISOString(),
        };

        const { error } = await supabase
            .from('reports')
            .insert({
                id: newReport.id,
                post_id: newReport.postId,
                reason: newReport.reason,
            });

        if (error) {
            console.error('Failed to save report to DB:', error);
            return Response.json({ error: 'Failed to save report' }, { status: 500 });
        }

        return Response.json({ success: true, reportId: newReport.id });
    } catch (error) {
        console.error('Failed to save report:', error);
        return Response.json({ error: 'Failed to save report' }, { status: 500 });
    }
}
