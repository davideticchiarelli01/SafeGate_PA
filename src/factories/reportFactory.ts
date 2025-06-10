import {ReportFormats} from '../enum/reportFormats';
import {BadgeStatus} from "../enum/badgeStatus";
import {Parser as Json2CsvParser} from 'json2csv';
import PDFDocument from 'pdfkit';

/**
 * Interface representing a report of transits for a specific gate.
 */
export interface GateTransitsReport {
    gateId: string;
    authorized: number;
    unauthorized: number;
    dpiViolations: number;
}

/**
 * Interface representing a report of transits for a specific badge.
 */
export interface BadgeTransitsReport {
    badgeId: string;
    authorized: number;
    unauthorized: number;
    status: BadgeStatus;
}

/**
 * Factory class responsible for generating formatted reports
 * in various formats (JSON, CSV, PDF) for badge or gate transit statistics.
 */
export class ReportFactory {

    /**
     * Formats a report in the specified format.
     * @param {ReportFormats} format - The desired report format (`pdf`, `csv`, or `json`).
     * @param {GateTransitsReport[] | BadgeTransitsReport[]} data - The data to format.
     * @returns {Promise<Buffer | string | object>} - The formatted report as a buffer (PDF), string (CSV), or object (JSON).
     */
    static async format(
        format: ReportFormats,
        data: GateTransitsReport[] | BadgeTransitsReport[]
    ): Promise<Buffer | string | object> {

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

    /**
     * Generates a CSV from the report data.
     * @private
     * @param {GateTransitsReport[] | BadgeTransitsReport[]} data - The data to format as CSV.
     * @returns {string} - CSV representation of the data.
     */
    private static generateCsv(data: GateTransitsReport[] | BadgeTransitsReport[]): string {
        const parser = new Json2CsvParser();
        if (!data || data.length === 0) {
            return parser.parse([{message: 'No data available'}]);
        }
        return parser.parse(data);
    }

    /**
     * Generates a PDF-formatted report from the report data.
     * Includes metadata, dynamic title, and formatted columns.
     * @private
     * @param {GateTransitsReport[] | BadgeTransitsReport[]} data - The data to format as PDF.
     * @returns {Promise<Buffer>} - A PDF buffer containing the report.
     */
    private static generatePdf(data: GateTransitsReport[] | BadgeTransitsReport[]): Promise<Buffer> {
        const doc = new PDFDocument({margin: 50});
        const chunks: any[] = [];

        doc.on('data', chunk => chunks.push(chunk));

        const now = new Date();

        // Define the header
        doc.fontSize(20).font('Helvetica-Bold').text('SafeGate - Transit Report', {align: 'center'});
        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Generated at: ${now.toLocaleString()}`, {align: 'right'});
        doc.moveDown();

        // Handle empty data case
        if (!data || data.length === 0) {
            doc.moveDown().fontSize(14).font('Helvetica-Oblique').text('No data available.', {
                align: 'center'
            });
            doc.end();
            return new Promise((resolve) => {
                doc.on('end', () => resolve(Buffer.concat(chunks)));
            });
        }

        // Defining report type (if gate type or badge type)
        const isGateReport: boolean = 'gateId' in data[0];
        const title: string = isGateReport ? 'Gate Transit Report' : 'Badge Transit Report';
        doc.moveDown().fontSize(16).font('Helvetica-Bold').text(title);
        doc.moveDown();

        const startX = 50;
        let y: number = doc.y + 5;
        const rowHeight = 20;

        // Define columns based on a report type
        const columns = isGateReport
            ? [
                {label: 'Gate ID', width: 220},
                {label: 'Authorized', width: 100, align: 'center'},
                {label: 'Unauthorized', width: 100, align: 'center'},
                {label: 'DPI violations', width: 100, align: 'center'},
            ]
            : [
                {label: 'Badge ID', width: 220},
                {label: 'Authorized', width: 100, align: 'center'},
                {label: 'Unauthorized', width: 120, align: 'center'},
                {label: 'Status', width: 100, align: 'center'},
            ];

        // Define form of column headers
        let x: number = startX;
        doc.font('Helvetica-Bold').fontSize(12);
        for (const col of columns) {
            doc.text(col.label, x, y, {width: col.width});
            x += col.width;
        }

        // Define form of rows
        y += rowHeight;
        doc.font('Helvetica').fontSize(11);

        for (const row of data) {
            x = startX;

            if (isGateReport) {
                const record = row as GateTransitsReport;
                doc.text(record.gateId, x, y, {width: columns[0].width});
                x += columns[0].width;
                doc.text(record.authorized.toString(), x, y, {width: columns[1].width});
                x += columns[1].width;
                doc.text(record.unauthorized.toString(), x, y, {width: columns[2].width});
                x += columns[2].width;
                doc.text(record.dpiViolations.toString(), x, y, {width: columns[3].width});
            } else {
                const record = row as BadgeTransitsReport;
                doc.text(record.badgeId, x, y, {width: columns[0].width});
                x += columns[0].width;
                doc.text(record.authorized.toString(), x, y, {width: columns[1].width});
                x += columns[1].width;
                doc.text(record.unauthorized.toString(), x, y, {width: columns[2].width});
                x += columns[2].width;
                doc.text(record.status.toString(), x, y, {width: columns[3].width});
            }

            y += rowHeight;

            // Add a new page if the current is full
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
