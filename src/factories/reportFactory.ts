import { BadgeTransitsReport, GateTransitsReport } from '../enum/reportTypes';
import { ReportFormats } from '../enum/reportFormats';
import { Parser as Json2CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';

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
        const doc = new PDFDocument();
        const chunks: any[] = [];

        doc.on('data', chunk => chunks.push(chunk));

        console.log('Generating PDF report with data:', data);

        const isGateReport: boolean = 'gateId' in data[0];
        const title = isGateReport ? 'Gate Transits Report' : 'Badge Transits Report'; // se è gate allora è un gay report senno è un beeggg report

        doc.fontSize(16).text(title, { align: 'center' }).moveDown();

        for (const d of data) {
            if (isGateReport) {
                const record = d as GateTransitsReport;
                doc.fontSize(12).text(
                    `Gate: ${record.gateId} | Authorized: ${record.authorized} | Unauthorized: ${record.unauthorized} | DPI Violations: ${record.dpiViolations}`
                );
            } else {
                const record = d as BadgeTransitsReport;
                doc.fontSize(12).text(
                    `Badge: ${record.badgeId} | Authorized: ${record.authorized} | Unauthorized: ${record.unauthorized} | Status: ${record.status}`
                );
            }
        }

        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }
}
