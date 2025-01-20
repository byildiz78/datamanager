"use client";

import { motion } from "framer-motion";
import { Users, Store, FileText, Bell, List, Shield, Database, Settings, Workflow, Lock, PieChart, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTabStore } from "@/stores/tab-store";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const tabStore = useTabStore();
  const { addTab, setActiveTab } = tabStore;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus password input when component mounts
    passwordInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === currentTime) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Yanlış şifre!");
      setPassword("");
    }
  };

  const settings = [
    {
      title: "Kullanıcı Listesi",
      description: "Kullanıcı ekleme ve güncelleme işlemlerini yapabilirsiniz",
      icon: Users,
      color: "bg-blue-500 dark:bg-blue-600",
      route: "users",
      tabId: "users-list"
    },
    {
      title: "Şube Listesi",
      description: "Şube ekleme ve güncelleme işlemlerini yapabilirsiniz",
      icon: Store,
      color: "bg-green-500 dark:bg-green-600",
      route: "branches",
      tabId: "branches-list"
    },
    {
      title: "Rapor Listesi",
      description: "Rapor ekleme ve düzenleme işlemlerini yapabilirsiniz",
      icon: FileText,
      color: "bg-purple-500 dark:bg-purple-600",
      route: "reports",
      tabId: "reports-list"
    },
    {
      title: "Superset Rapor Listesi",
      description: "Superset Rapor ekleme ve düzenleme işlemlerini yapabilirsiniz",
      icon: PieChart,
      color: "bg-yellow-500 dark:bg-yellow-600",
      route: "superset",
      tabId: "superset-list",
    },
    {
      title: "Widget Listesi",
      description: "Widgetlara yeni ekleyebilir, mevcut olanları güncelleyebilirsiniz",
      icon: List,
      color: "bg-pink-500 dark:bg-pink-600",
      route: "widgets",
      tabId: "widgets-list"
    },
    {
      title: "AI Ayarları",
      description: "Rapor ve diğer kontrolleri tanımlayabilirsiniz",
      icon: HandCoins,
      color: "bg-red-500 dark:bg-red-600",
      route: "ai",
      tabId: "ai-list",
    },
    {
      title: "Rapor Kolon Özellikleri",
      description: "Raporların kolonlarını şekillendirebilirsiniz",
      icon: Database,
      color: "bg-indigo-500 dark:bg-indigo-600",
      route: "report-columns",
      tabId: "report-columns-list",
      comingSoon: true
    },
    {
      title: "Denetim Formu Yetkileri",
      description: "Denetim formunu kimlerin yapabileceğini seçebilirsiniz",
      icon: Settings,
      color: "bg-cyan-500 dark:bg-cyan-600",
      route: "audit-permissions",
      tabId: "audit-permissions-list",
      comingSoon: true
    },
    {
      title: "Proje Ayarları",
      description: "Proje Ayarlarını görebilirsiniz",
      icon: Workflow,
      color: "bg-orange-500 dark:bg-orange-600",
      route: "project",
      tabId: "project-settings",
      comingSoon: true
    }
  ];

  const handleSettingClick = (setting: typeof settings[0]) => {
    if (setting.comingSoon) return;
    
    // Check if tab is already open
    const isTabOpen = tabStore.tabs.some(tab => tab.id === setting.tabId);
    
    if (!isTabOpen) {
      addTab({
        id: setting.tabId,
        title: setting.title,
        lazyComponent: () => import(`./${setting.route}/page`)
      });
    }
    
    setActiveTab(setting.tabId);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md px-4"
        >
          <Card className="relative overflow-hidden border-neutral-200/20 dark:border-neutral-800/20">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background" />
            <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            
            <div className="relative p-8 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-6">
                {/* Icon container with animated gradient border */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className="relative p-5 bg-background rounded-full">
                    <Lock className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Ayarlar Sayfası
                  </h2>
                  <div className="h-1 w-20 mx-auto bg-gradient-to-r from-primary/60 to-purple-600/60 rounded-full" />
                </div>

                <form onSubmit={handlePasswordSubmit} className="w-full space-y-6">
                  <input 
                    type="text" 
                    autoComplete="username" 
                    defaultValue="admin" 
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ display: 'none' }}
                    readOnly
                  />
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-lg blur-sm transition duration-200 group-hover:blur-md group-hover:from-primary/30 group-hover:to-purple-600/30" />
                    <Input
                      ref={passwordInputRef}
                      type="password"
                      placeholder="● ● ● ●"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative text-center text-2xl tracking-[1em] py-6 bg-background/80 border-neutral-200/20 dark:border-neutral-800/20 transition-colors placeholder:text-foreground/20 placeholder:tracking-normal focus-visible:ring-primary"
                      maxLength={4}
                      style={{ height: '60px' }}
                      autoComplete="current-password"
                      spellCheck={false}
                      aria-label="Şifre"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 text-center bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground py-6 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                  >
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Lock className="w-4 h-4" />
                      <span>Giriş Yap</span>
                    </motion.div>
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-background via-purple-50/30 dark:via-purple-950/30 to-background">
      <div className="p-8 w-full space-y-8">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Ayarlar</h1>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.map((setting, index) => {
            const Icon = setting.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleSettingClick(setting)}
                className={`cursor-pointer ${setting.comingSoon ? 'opacity-60' : ''}`}
              >
                <Card className={`p-6 transition-all duration-300 ${setting.comingSoon ? 'bg-muted' : 'hover:shadow-lg hover:bg-accent/50'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${setting.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{setting.title}</h3>
                        {setting.comingSoon && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Yakında</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={setting.comingSoon}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{setting.comingSoon ? 'Yakında' : 'Giriş yap'}</span>
                    </div>
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
