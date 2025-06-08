import {ReportFormats} from "../enum/reportFormats";
import {Response} from 'express';

/**
 * Sets the appropriate HTTP headers on the response object to initiate a file download
 *
 * @param {Response} res - Express response object.
 * @param {ReportFormats} format - Format of the report.
 * @param {string} baseFileName - Base name of the file without extension.
 */
export function setDownloadHeaders(res: Response, format: ReportFormats, baseFileName: string) {
    switch (format) {
        case ReportFormats.PDF:
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${baseFileName}.pdf"`);
            break;
        case ReportFormats.CSV:
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${baseFileName}.csv"`);
            break;
        default:
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${baseFileName}.json"`);
    }
    return res;
}
