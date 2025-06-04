import { GateTransitsReport } from '../types/reportTypes';
import { Parser as Json2CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';

export class ReportFormatterFactory {
    static async format(format: 'pdf' | 'csv' | 'json', data: GateTransitsReport[]): Promise<Buffer | string | object> {
        switch (format) {
            case 'pdf':
                return this.generatePdf(data);
            case 'csv':
                return this.generateCsv(data);
            case 'json':
            default:
                return data;
        }
    }

    private static generateCsv(data: GateTransitsReport[]): string {
        const parser = new Json2CsvParser();
        return parser.parse(data);
    }

    private static generatePdf(data: GateTransitsReport[]): Promise<Buffer> {
        const doc = new PDFDocument();
        const chunks: any[] = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.fontSize(16).text("Gate Transits Report", { align: 'center' }).moveDown();

        for (const d of data) {
            doc.fontSize(12).text(
                `Gate: ${d.gateId} | Authorized: ${d.authorized} | Unauthorized: ${d.unauthorized} | DPI Violations: ${d.dpiViolations}`
            );
        }

        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }
}
