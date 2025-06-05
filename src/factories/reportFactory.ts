import { BadgeTransitsReport, GateTransitsReport } from '../enum/reportTypes';
import { ReportFormats } from '../enum/reportFormats';
import { Parser as Json2CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { ErrorFactory } from './errorFactory';
import { ReasonPhrases } from 'http-status-codes';

export class ReportFactory {
    static async format(format: ReportFormats, data: GateTransitsReport[] | BadgeTransitsReport[]): Promise<Buffer | string | object> {
        switch (format) {
            case ReportFormats.PDF:
                return this.generatePdf(data);
            case ReportFormats.CSV:
                return this.generateCsv(data);
            case ReportFormats.JSON:
            default:
                return data;
        }
    }

    private static generateCsv(data: GateTransitsReport[] | BadgeTransitsReport[]): string {
        const parser = new Json2CsvParser();
        return parser.parse(data);
    }

    private static generatePdf(data: GateTransitsReport[] | BadgeTransitsReport[]): Promise<Buffer> {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: any[] = [];

        doc.on('data', chunk => chunks.push(chunk));

        const now = new Date();

        doc.fontSize(20).font('Helvetica-Bold').text('SafeGate - Transit Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Generated at: ${now.toLocaleString()}`, { align: 'right' });
        doc.moveDown();

        if (!data || data.length === 0) {
            doc.moveDown().fontSize(14).font('Helvetica-Oblique').text('No data available.', {
                align: 'center'
            });
            doc.end();
            return new Promise((resolve) => {
                doc.on('end', () => resolve(Buffer.concat(chunks)));
            });
        }

        const isGateReport: boolean = 'gateId' in data[0];
        const title = isGateReport ? 'Gate Transit Report' : 'Badge Transit Report';
        doc.moveDown().fontSize(16).font('Helvetica-Bold').text(title);
        doc.moveDown();

        const startX = 50;
        let y = doc.y + 5;
        const rowHeight = 20;

        const columns = isGateReport
            ? [
                { label: 'Gate ID', width: 220 },
                { label: 'Authorized', width: 100, align: 'center' },
                { label: 'Unauthorized', width: 100, align: 'center' },
                { label: 'DPI violations', width: 100, align: 'center' },
            ]
            : [
                { label: 'Badge ID', width: 220 },
                { label: 'Authorized', width: 100, align: 'center' },
                { label: 'Unauthorized', width: 120, align: 'center' },
                { label: 'Status', width: 100, align: 'center' },
            ];

        let x = startX;
        doc.font('Helvetica-Bold').fontSize(12);
        for (const col of columns) {
            doc.text(col.label, x, y, { width: col.width });
            x += col.width;
        }

        y += rowHeight;
        doc.font('Helvetica').fontSize(11);

        for (const row of data) {
            x = startX;

            if (isGateReport) {
                const record = row as GateTransitsReport;
                doc.text(record.gateId, x, y, { width: columns[0].width }); x += columns[0].width;
                doc.text(record.authorized.toString(), x, y, { width: columns[1].width }); x += columns[1].width;
                doc.text(record.unauthorized.toString(), x, y, { width: columns[2].width }); x += columns[2].width;
                doc.text(record.dpiViolations.toString(), x, y, { width: columns[3].width });
            } else {
                const record = row as BadgeTransitsReport;
                doc.text(record.badgeId, x, y, { width: columns[0].width }); x += columns[0].width;
                doc.text(record.authorized.toString(), x, y, { width: columns[1].width }); x += columns[1].width;
                doc.text(record.unauthorized.toString(), x, y, { width: columns[2].width }); x += columns[2].width;
                doc.text(record.status.toString(), x, y, { width: columns[3].width });
            }

            y += rowHeight;
            // Vai a nuova pagina se serve
            if (y > doc.page.height - 50) {
                doc.addPage();
                y = 50;
            }
        }

        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }


}
