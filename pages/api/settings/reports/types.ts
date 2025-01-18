export type WebReport = {
    AutoID: number;
    ReportID: number;
    GroupID: number;
    ReportName?: string;
    ReportType?: number;
    ShowDesktop?: number;
    ShowMobile?: number;
    DisplayOrderID?: number;
    SecurityLevel?: number;
    ReportQuery?: string;
    ReportIcon?: string;
    QueryDayLimit?: number
}

export type WebReportGroup = {
    GroupAutoID: number;
    GroupName?: string;
    GroupDisplayOrderID?: number;
    GroupSecurityLevel?: number;
    GroupIcon?: string;
}
