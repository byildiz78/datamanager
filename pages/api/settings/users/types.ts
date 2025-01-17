export type Efr_Users = {
    UserName?: string;
    UserID?: string;
    UserBranchs?: string;
    Category: number;
    ExpoToken: string;
    ExpoTokenUpdatedDate: Date;
    UserCode?: string;
    UserPWD?: string;
    CategoryText?: string; // CASE ifadesinin sonucu
    DefaultCountry?: string;
    LanguageName?: string;
    DisableNotification?: boolean;
    DisableLangaugeEditor?: boolean;
    DisableMailSettings?: boolean;
    DisableBranchMessage?: boolean;
    DisableBranchControlForm?: boolean;
    DisableDashboardReport?: boolean;
    HiddenReports?: string;
    UserDevices?: string;
    LastLoginDatetime1?: Date;
    LastLoginDatetime2?: Date;
    LastActivityDatetime?: Date;
    PasswordChangeDateTime?: Date;
    IsActive?: boolean;
    Name?: string;      // CONCAT sonucu
    SurName?: string;
    TaxNo?: string;
    PhoneNumber?: string;
    EMail?: string;
    SmsRequired?: boolean;
    SmsRequiredYedek?: boolean;
    Locked?: boolean;
    NewUser?: boolean;
    EncryptedPass?: string;
    PhoneCode?: string;
    CalculatePoint?: boolean;
    ReLogin?: boolean;
    PwdCantChange?: boolean;
    TicketCreate?: boolean;
    TicketUser?: boolean;
    ExpoTokenUpdatedAt?: Date;
    MinDiscountAmount?: number;
    MinCancelAmount?: number;
    MinSaleAmount?: number;
    TagID?: number; // Added for branch tag selection
}

// Category için enum tanımı (opsiyonel kullanım için)
export enum UserCategory {
    Standart = 1,
    CokluSube = 2,
    BolgeSorumlusu = 3,
    Yonetici = 4,
    SuperAdmin = 5,
    OpSorumlusu = 6,
    MusteriHizmetleri = 7,
    InsanKaynaklari = 8,
    IsGelistirme = 9,
    IT = 10,
    Pazarlama = 11,
    Sube = 12
}