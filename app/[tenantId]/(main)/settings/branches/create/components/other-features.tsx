'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Efr_Branches } from "@/pages/api/settings/branches/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Clock, Mail, MapPin, Phone, Store, Users } from "lucide-react";

interface OtherFeaturesProps {
  formData: Efr_Branches;
  setFormData: React.Dispatch<React.SetStateAction<Efr_Branches>>;
}

export default function OtherFeatures({ formData, setFormData }: OtherFeaturesProps) {
  return (
    <div className="space-y-6">
      {/* Çalışma Saatleri ve Temel Bilgiler */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Çalışma Saatleri ve Temel Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openingTime">Açılış Saati</Label>
              <Input
                id="openingTime"
                placeholder="Açılış Saati"
                value={formData.OpeningTime}
                onChange={(e) => setFormData(prev => ({ ...prev, OpeningTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closingTime">Kapanış Saati</Label>
              <Input
                id="closingTime"
                placeholder="Kapanış Saati"
                value={formData.ClosingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, ClosingTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchSquareMeter">Şube M2</Label>
              <Input
                id="branchSquareMeter"
                type="number"
                placeholder="Şube M2"
                value={formData.BranchSquareMeter}
                onChange={(e) => setFormData(prev => ({ ...prev, BranchSquareMeter: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfServicePersonnel">Servis Personel Sayısı</Label>
              <Input
                id="numberOfServicePersonnel"
                type="number"
                placeholder="Servis Personel Sayısı"
                value={formData.NumberOfServicePersonnel}
                onChange={(e) => setFormData(prev => ({ ...prev, NumberOfServicePersonnel: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Şube Detayları */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Store className="w-5 h-5 text-muted-foreground" />
            Şube Detayları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenueCenterCode">Gelir Merkezi</Label>
              <Input
                id="revenueCenterCode"
                placeholder="Gelir Merkezi"
                value={formData.RevenueCenterCode}
                onChange={(e) => setFormData(prev => ({ ...prev, RevenueCenterCode: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField6">Servis Tipi</Label>
              <Input
                id="customField6"
                placeholder="Alakart/Self"
                value={formData.CustomField6}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField6: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField7">Şube Tipi</Label>
              <Input
                id="customField7"
                placeholder="Merkezi/Franchise"
                value={formData.CustomField7}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField7: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField9">Şube Lokasyon</Label>
              <Input
                id="customField9"
                placeholder="AVM/Cadde"
                value={formData.CustomField9}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField9: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField10">Şube Açılış Tarihi</Label>
              <Input
                id="customField10"
                placeholder="Şube Açılış Tarihi"
                value={formData.CustomField10}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField10: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Şube Sırası</Label>
              <Input
                id="orderNumber"
                type="number"
                placeholder="Şube Sırası"
                value={formData.OrderNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, OrderNumber: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Konum Bilgileri */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            Konum Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customField2">Bölge Sınıflandırması</Label>
              <Input
                id="customField2"
                placeholder="Bölge Sınıflandırması"
                value={formData.CustomField2}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField2: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField3">Bölge</Label>
              <Input
                id="customField3"
                placeholder="Bölge"
                value={formData.CustomField3}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField3: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField4">İl</Label>
              <Input
                id="customField4"
                placeholder="İl"
                value={formData.CustomField4}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField4: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField13">İlçe</Label>
              <Input
                id="customField13"
                placeholder="İlçe"
                value={formData.CustomField13}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField13: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Coğrafi Bölge</Label>
              <Input
                id="region"
                placeholder="Coğrafi Bölge"
                value={formData.Region}
                onChange={(e) => setFormData(prev => ({ ...prev, Region: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* İletişim Bilgileri */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Phone className="w-5 h-5 text-muted-foreground" />
            İletişim Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customField8">Telefon No</Label>
              <Input
                id="customField8"
                placeholder="Telefon No"
                value={formData.CustomField8}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField8: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField5">Şube Maili</Label>
              <Input
                id="customField5"
                placeholder="Şube Maili"
                value={formData.CustomField5}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField5: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webMails">Web Mails</Label>
              <Input
                id="webMails"
                placeholder="Web Mails"
                value={formData.WebMails}
                onChange={(e) => setFormData(prev => ({ ...prev, WebMails: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yetkili Bilgileri */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            Yetkili Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customField11">Yatırımcı Bilgisi</Label>
              <Input
                id="customField11"
                placeholder="Yatırımcı Bilgisi"
                value={formData.CustomField11}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField11: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investorMail">Yatırımcı Maili</Label>
              <Input
                id="investorMail"
                placeholder="Yatırımcı Maili"
                value={formData.InvestorMail}
                onChange={(e) => setFormData(prev => ({ ...prev, InvestorMail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField12">Bölge Sorumlusu</Label>
              <Input
                id="customField12"
                placeholder="Bölge Sorumlusu"
                value={formData.CustomField12}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField12: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regionalDirectorMail">Bölge Sorumlusu Maili</Label>
              <Input
                id="regionalDirectorMail"
                placeholder="Bölge Sorumlusu Maili"
                value={formData.RegionalDirectorMail}
                onChange={(e) => setFormData(prev => ({ ...prev, RegionalDirectorMail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regionalManagerMail">Bölge Müdürü Maili</Label>
              <Input
                id="regionalManagerMail"
                placeholder="Bölge Müdürü Maili"
                value={formData.RegionalManagerMail}
                onChange={(e) => setFormData(prev => ({ ...prev, RegionalManagerMail: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Özel Alanlar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            Özel Alanlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customField14">Özel Alan 14</Label>
              <Input
                id="customField14"
                placeholder="Özel Alan 14"
                value={formData.CustomField14}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField14: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField15">Özel Alan 15</Label>
              <Input
                id="customField15"
                placeholder="Özel Alan 15"
                value={formData.CustomField15}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField15: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customField16">Özel Alan 16</Label>
              <Input
                id="customField16"
                placeholder="Özel Alan 16"
                value={formData.CustomField16}
                onChange={(e) => setFormData(prev => ({ ...prev, CustomField16: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
