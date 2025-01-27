'use client';

import * as React from 'react';
import { UserPlus, Pencil, Plus, BarChart3, Folder, FileText, Laptop, Smartphone, Shield, Building2, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import { useTabStore } from "@/stores/tab-store";
import axios from "@/lib/axios";
import { toast } from '@/components/ui/toast/use-toast';
import { Efr_Branches } from '@/pages/api/settings/branches/types';
import { useBranchesStore } from '@/stores/settings/branch/branch-store';
import TagDialog from './components/tag-dialog';

export default function BranchPage() {
  const { branches, setBranches } = useBranchesStore();
  const { addTab, setActiveTab, removeTab } = useTabStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false);
  const [tags, setTags] = React.useState([]);
  const [isTagsLoading, setIsTagsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/settings/branches/settings_efr_branches');
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast({
          title: "Hata!",
          description: "Şubeler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [setBranches]);

  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsTagsLoading(true);
        const response = await axios.get('/api/settings/efr_tag/settings_efr_tag');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast({
          title: "Hata!",
          description: "Etiketler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsTagsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleEditBranch = (branch: Efr_Branches) => {
    const tabId = `edit-branches-${branch.BranchID}`;
    const tab = {
      id: tabId,
      title: `Şube Düzenle - ${branch.BranchName}`,
      props: { data: branch, tags, isTagsLoading },
      lazyComponent: () => import('./create/branch-form').then(module => ({
        default: (props: any) => {
          const Component = module.default;
          const tabProps = useTabStore.getState().getTabProps(tabId);
          return <Component {...tabProps} />;
        }
      }))
    };
    addTab(tab);
    setActiveTab(tabId);
  };

  const handleAddBranchClick = () => {
    const tabId = "new-branches-form";
    addTab({
      id: tabId,
      title: "Yeni Şube",
      props: { tags, isTagsLoading },
      lazyComponent: () => import('./create/branch-form').then(module => ({
        default: (props: any) => {
          const Component = module.default;
          const tabProps = useTabStore.getState().getTabProps(tabId);
          return <Component {...tabProps} />;
        }
      }))
    });
    setActiveTab(tabId);
  };

  const columns = [
    {
      key: 'BranchName' as keyof Efr_Branches,
      title: 'Şube Adı',
      width: '250px',
      fixed: 'left' as const,
      sortable: true,
      render: (branch: Efr_Branches) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/5 via-primary/5 to-blue-500/5 flex items-center justify-center ring-1 ring-border/50">
              <Building2 className="w-4 h-4 text-primary/40" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-background shadow-sm flex items-center justify-center ring-1 ring-border/50">
              <div className={`w-2 h-2 rounded-full ${branch.IsActive
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{branch.BranchName}</span>
            <span className="text-xs text-muted-foreground">{branch.ExternalCode}</span>
          </div>
        </div>
      )
    },
    {
      key: 'Addresss' as keyof Efr_Branches,
      title: 'Adres',
      width: '300px',
      render: (branch: Efr_Branches) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-3.5 h-3.5 text-violet-500" />
            <span>{branch.CustomField4}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-muted-foreground">{branch.CountryName}</span>
          </div>
        </div>
      )
    },
    {
      key: 'Region' as keyof Efr_Branches,
      title: 'Bölge',
      width: '150px',
      sortable: true,
      render: (branch: Efr_Branches) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/10 via-primary/10 to-blue-500/10 text-primary ring-1 ring-primary/20">
          {branch.Region}
        </span>
      )
    },
    {
      key: 'OpeningTime' as keyof Efr_Branches,
      title: 'Çalışma Saatleri',
      width: '180px',
      render: (branch: Efr_Branches) => (
        <div className="flex items-center gap-2">
          <div className="text-sm">
            {branch.OpeningTime} - {branch.ClosingTime}
          </div>
        </div>
      )
    },
    {
      key: 'IsActive' as keyof Efr_Branches,
      title: 'Durum',
      width: '150px',
      sortable: true,
      render: (branch: Efr_Branches) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
          ${branch.IsActive
            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20'
            : 'bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-600 ring-1 ring-gray-500/20'}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${branch.IsActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-[pulse_2s_ease-in-out_infinite]'
              : 'bg-gradient-to-r from-gray-400 to-gray-500'
            }`} />
          {branch.IsActive ? 'Aktif' : 'Pasif'}
        </span>
      )
    },
    {
      key: 'BranchSquareMeter' as keyof Efr_Branches,
      title: 'Detaylar',
      width: '200px',
      render: (branch: Efr_Branches) => (
        <div className="flex flex-col gap-1">
          <div className="text-sm flex items-center gap-1.5">
            <span className="text-violet-500">Alan:</span>
            <span>{branch.BranchSquareMeter} m²</span>
          </div>
          <div className="text-sm flex items-center gap-1.5">
            <span className="text-blue-500">Personel:</span>
            <span>{branch.NumberOfServicePersonnel}</span>
          </div>
        </div>
      )
    }
  ];

  const filters = [
    {
      key: 'CountryName' as keyof Efr_Branches,
      title: 'Ülke',
      options: [
        { label: 'Türkiye', value: 'TÜRKİYE' },
        { label: 'Diğer', value: 'OTHER' }
      ]
    },
    {
      key: 'IsActive' as keyof Efr_Branches,
      title: 'Durum',
      options: [
        { label: 'Aktif', value: 'true' },
        { label: 'Pasif', value: 'false' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-4 p-4 md:p-2 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Şube Yönetimi</h1>
          <p className="text-muted-foreground">
            Şubeleri görüntüleyin ve yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <TagDialog 
            isOpen={isTagDialogOpen}
            onOpenChange={setIsTagDialogOpen}
            tags={tags}
            isLoading={isTagsLoading}
            onTagsChange={setTags}
          />
          <Button
            onClick={handleAddBranchClick}
            className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Şube
          </Button>
        </div>
      </div>

      <DataTable
        data={branches}
        columns={columns}
        filters={filters}
        searchFields={['BranchName', 'ExternalCode', 'Addresss', 'Region']}
        idField="BranchID"
        isLoading={isLoading}
        renderActions={(branches) => (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:scale-105 hover:bg-violet-500/10 hover:text-violet-600 transition-all"
              onClick={() => handleEditBranch(branches)}
            >
              <Pencil className="w-4 h-4" />
              <span className="sr-only">Düzenle</span>
            </Button>
          </div>
        )}
      />
    </div>
  );
}
