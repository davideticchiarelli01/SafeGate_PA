import {GateTransitsReport} from '../enum/reportTypes';
import {ReportFormats} from '../enum/reportFormats';
import {Parser as Json2CsvParser} from 'json2csv';
import PDFDocument from 'pdfkit';

export class ReportFactory {
    static async format(format: ReportFormats, data: GateTransitsReport[]): Promise<Buffer | string | object> {
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

    private static generateCsv(data: GateTransitsReport[]): string {
        const parser = new Json2CsvParser();
        return parser.parse(data);
    }

    private static generatePdf(data: GateTransitsReport[]): Promise<Buffer> {
        const doc = new PDFDocument();
        const chunks: any[] = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.fontSize(16).text("Gate Transits Report", {align: 'center'}).moveDown();

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
