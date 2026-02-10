interface Report {
    id: string;
    postId: string;
    reason: string;
    createdAt: string;
}

// インメモリストレージ（Vercel対応）
let reports: Report[] = [];

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

        reports.push(newReport);

        return Response.json({ success: true, reportId: newReport.id });
    } catch (error) {
        console.error('Failed to save report:', error);
        return Response.json({ error: 'Failed to save report' }, { status: 500 });
    }
}
