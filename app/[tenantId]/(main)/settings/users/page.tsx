'use client';

import * as React from 'react';
import { UserPlus, Pencil, Trash2, Mail, Phone, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import { useTabStore } from "@/stores/tab-store";
import axios, { isAxiosError } from "@/lib/axios";
import { useUsersStore } from "@/stores/settings/users/users-store";
import { toast } from '@/components/ui/toast/use-toast';

export default function UsersPage() {
    const { users, setUsers } = useUsersStore();
    const { addTab, setActiveTab } = useTabStore();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/settings/users/settings_efr_users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast({
                    title: "Hata!",
                    description: "Kullanıcılar yüklenirken bir hata oluştu.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [setUsers]);

    const handleEditUser = (user: any) => {
        // TODO: Implement edit functionality
        console.log('Edit user:', user);
    };

    const handleDeleteUser = (id: string) => {
        // TODO: Implement delete functionality
        console.log('Delete user:', id);
    };

    const handleAddUserClick = () => {
        const tabId = "new-user-form";
        addTab({
            id: tabId,
            title: "Yeni Kullanıcı",
            lazyComponent: () => import("./create/user-form").then(mod => ({
                default: () => (
                    <div className="p-8">
                        <div className="rounded-lg border bg-card p-6">
                            <mod.UserForm
                                onClose={() => setActiveTab("users-list")}
                            />
                        </div>
                    </div>
                )
            }))
        });
        setActiveTab(tabId);
    };

    const columns = [
        {
            key: 'Name' as keyof any,
            title: 'Ad Soyad',
            width: '250px',
            fixed: 'left' as const,
            sortable: true,
            render: (user: any) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/5 via-primary/5 to-blue-500/5 flex items-center justify-center ring-1 ring-border/50">
                            <svg className="w-4 h-4 text-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-background shadow-sm flex items-center justify-center ring-1 ring-border/50">
                            <div className={`w-2 h-2 rounded-full ${user.IsActive
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse'
                                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                }`} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{user.Name}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'EMail' as keyof any,
            title: 'İletişim',
            width: '300px',
            render: (user: any) => (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3.5 h-3.5 text-violet-500" />
                        <span>{user.EMail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-muted-foreground">{user.PhoneNumber}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'Category' as keyof any,
            title: 'Rol',
            width: '150px',
            sortable: true,
            render: (user: any) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/10 via-primary/10 to-blue-500/10 text-primary ring-1 ring-primary/20">
                    {user.Category}
                </span>
            )
        },
        {
            key: 'UserBranchs' as keyof any,
            title: 'Şube',
            width: '180px',
            sortable: true,
            render: (user: any) => {
                const branchCount = user.UserBranchs?.split(',').length || 0;
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 animate-[pulse_2s_ease-in-out_infinite]" />
                        <span className="text-xs text-gray-500">({branchCount} şube)</span>
                    </div>
                );
            }
        },
        {
            key: 'IsActive' as keyof any,
            title: 'Durum',
            width: '150px',
            sortable: true,
            render: (user: any) => (
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
          ${user.IsActive
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20'
                        : 'bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-600 ring-1 ring-gray-500/20'}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${user.IsActive
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-[pulse_2s_ease-in-out_infinite]'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`} />
                    {user.IsActive ? 'Aktif' : 'Pasif'}
                </span>
            )
        },
        {
            key: 'LastLoginDatetime1' as keyof any,
            title: 'Son Giriş',
            width: '200px',
            sortable: true,
            render: (user: any) => (
                <div className="flex flex-col gap-1">
                    <div className="text-sm flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-violet-500" />
                        <span>
                            {user.LastLoginDatetime1 ? new Date(user.LastLoginDatetime1).toLocaleDateString('tr-TR') : '-'}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>
                            {user.LastLoginDatetime1 ? new Date(user.LastLoginDatetime1).toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : '-'}</span>
                    </div>
                </div>
            )
        }
    ];

    const filters = [
        {
            key: 'Category' as keyof any,
            title: 'Rol',
            options: [
                { label: 'Standart', value: 'Standart' },
                { label: 'Çoklu Şube', value: 'Çoklu Şube' },
                { label: 'Bölge Sorumlusu', value: 'Bölge Sorumlusu' },
                { label: 'Yönetici', value: 'Yönetici' },
                { label: 'Süper Admin', value: 'Süper Admin' },
                { label: 'Op. Sorumlusu', value: 'Op. Sorumlusu' },
                { label: 'Müşteri Hizmetleri', value: 'Müşteri Hizmetleri' },
                { label: 'İnsan Kaynakları', value: 'İnsan Kaynakları' },
                { label: 'İş Geliştirme', value: 'İş Geliştirme' },
                { label: 'IT', value: 'IT' },
                { label: 'Pazarlama', value: 'Pazarlama' },
                { label: 'Şube', value: 'Şube' }
            ]
        },
        {
            key: 'IsActive' as keyof any,
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
                    <h1 className="text-2xl font-semibold">Kullanıcı Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Sistem kullanıcılarını görüntüleyin ve yönetin
                    </p>
                </div>
                <Button
                    onClick={handleAddUserClick}
                    className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Yeni Kullanıcı
                </Button>
            </div>

            <DataTable
                data={users}
                columns={columns}
                filters={filters}
                searchFields={['Name', 'UserName', 'EMail', 'PhoneNumber']}
                idField="UserID"
                isLoading={isLoading}
                renderActions={(user) => (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:scale-105 hover:bg-violet-500/10 hover:text-violet-600 transition-all"
                            onClick={() => handleEditUser(user)}
                        >
                            <Pencil className="w-4 h-4" />
                            <span className="sr-only">Düzenle</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
                            onClick={() => handleDeleteUser(user.UserID!)}
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Sil</span>
                        </Button>
                    </div>
                )}
            />
        </div>
    );
}
