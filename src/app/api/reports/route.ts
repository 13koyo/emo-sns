import { promises as fs } from 'fs';
import path from 'path';

const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');

interface Report {
    id: string;
    postId: string;
    reason: string;
    createdAt: string;
}

async function ensureReportsFile() {
    try {
        await fs.access(REPORTS_FILE);
    } catch {
        await fs.mkdir(path.dirname(REPORTS_FILE), { recursive: true });
        await fs.writeFile(REPORTS_FILE, JSON.stringify([], null, 2));
    }
}

export async function POST(request: Request) {
    try {
        const { postId, reason } = await request.json();

        if (!postId || !reason) {
            return Response.json({ error: 'postId and reason are required' }, { status: 400 });
        }

        await ensureReportsFile();
        const data = await fs.readFile(REPORTS_FILE, 'utf-8');
        const reports: Report[] = JSON.parse(data);

        const newReport: Report = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
            postId,
            reason,
            createdAt: new Date().toISOString(),
        };

        reports.push(newReport);
        await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2));

        return Response.json({ success: true, reportId: newReport.id });
    } catch (error) {
        console.error('Failed to save report:', error);
        return Response.json({ error: 'Failed to save report' }, { status: 500 });
    }
}
