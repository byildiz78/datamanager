'use client';

import * as React from 'react';
import { Tag, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "@/lib/axios";
import { toast } from "@/components/ui/toast/use-toast";
import { Search } from 'lucide-react';

interface TagDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tags: any[];
  isLoading: boolean;
  onTagsChange: (newTags: any[]) => void;
}

export default function TagDialog({ isOpen, onOpenChange, tags, isLoading, onTagsChange }: TagDialogProps) {
  const [newTag, setNewTag] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  // Filtrelenmiş etiketleri hesapla
  const filteredTags = React.useMemo(() => {
    return tags.filter(tag =>
      tag.TagTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tags, searchQuery]);

  // Yeni etiket oluştur
  const createTag = async () => {
    if (!newTag.trim() || isCreating) return;

    const tempId = Date.now();
    const newTagObj = {
      TagID: tempId,
      TagTitle: newTag.trim(),
      IsActive: true
    };

    setIsCreating(true);

    try {
      // Önce state'e ekle
      const updatedTags = [...tags, newTagObj];
      onTagsChange(updatedTags);
      setNewTag("");

      const response = await axios.post('/api/settings/efr_tag/settings_efr_tag_create', {
        TagTitle: newTag.trim()
      });

      if (!response.data.success) {
        // Hata durumunda eski state'e dön
        onTagsChange(tags);
        throw new Error(response.data.message || 'Etiket oluşturulamadı');
      }

      // Başarılı olursa geçici ID'yi gerçek ID ile güncelle
      const finalTags = updatedTags.map(tag =>
        tag.TagID === tempId ? { ...tag, TagID: response.data.tagId } : tag
      );
      onTagsChange(finalTags);

      toast({
        title: "Başarılı!",
        description: "Etiket başarıyla oluşturuldu.",
      });
    } catch (error) {
      // Hata durumunda eski state'e dön
      onTagsChange(tags);
      console.error('Error creating tag:', error);
      toast({
        title: "Hata!",
        description: error instanceof Error ? error.message : "Etiket oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tag className="w-4 h-4 mr-2" />
          Etiketler
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Etiket Yönetimi</DialogTitle>
          <DialogDescription>
            Şube etiketlerini görüntüleyin ve yönetin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Etiket ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredTags.length === 0 && searchQuery ? (
            <div className="text-center py-4 text-muted-foreground">
              "{searchQuery}" ile eşleşen etiket bulunamadı
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto
                 [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-thumb]:bg-gray-300/50
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/80
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/80">
              {filteredTags.map((tag) => (
                <div key={tag.TagID} className="flex items-center justify-between">
                  <span>{tag.TagTitle}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Yeni etiket adı..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button onClick={createTag} disabled={isCreating}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ekleniyor...
                </>
              ) : (
                'Ekle'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
