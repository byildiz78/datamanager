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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "@/lib/axios";
import { toast } from "@/components/ui/toast/use-toast";

interface TagDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TagDialog({ isOpen, onOpenChange }: TagDialogProps) {
  const [tags, setTags] = React.useState<any[]>([]);
  const [newTag, setNewTag] = React.useState("");

  // Etiketleri yükle
  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/settings/efr_tag/settings_efr_tag');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: "Hata!",
        description: "Etiketler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Yeni etiket oluştur
  const createTag = async () => {
    if (!newTag.trim()) {
      toast({
        title: "Hata!",
        description: "Etiket adı boş olamaz.",
        variant: "destructive",
      });
      return;
    }

    // Optimistik güncelleme için geçici ID
    const tempId = Date.now();
    const newTagObj = {
      TagID: tempId,
      TagTitle: newTag,
      IsDefault: false
    };

    // Önce state'e ekle
    setTags(prevTags => [...prevTags, newTagObj]);
    setNewTag("");

    try {
      const response = await axios.post('/api/settings/efr_tag/settings_efr_tag_create', {
        TagTitle: newTag,
        IsDefault: false
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      setTags(prevTags => prevTags.map(tag => 
        tag.TagID === tempId ? { ...tag, TagID: response.data.tagId } : tag
      ));

      toast({
        title: "Başarılı!",
        description: "Etiket başarıyla oluşturuldu.",
      });
    } catch (error) {
      setTags(prevTags => prevTags.filter(tag => tag.TagID !== tempId));
      console.error('Error creating tag:', error);
      toast({
        title: "Hata!",
        description: error instanceof Error ? error.message : "Etiket oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // const deleteTag = async (tagId: number) => {
  //   // Önce state'den kaldır
  //   const removedTag = tags.find(tag => tag.TagID === tagId);
  //   setTags(prevTags => prevTags.filter(tag => tag.TagID !== tagId));

  //   try {
  //     await axios.delete(`/api/settings/efr_tag/settings_efr_tag_delete/${tagId}`);
      
  //     toast({
  //       title: "Başarılı!",
  //       description: "Etiket başarıyla silindi.",
  //     });
  //   } catch (error) {
  //     // Hata durumunda state'e geri ekle
  //     if (removedTag) {
  //       setTags(prevTags => [...prevTags, removedTag]);
  //     }

  //     console.error('Error deleting tag:', error);
  //     toast({
  //       title: "Hata!",
  //       description: "Etiket silinirken bir hata oluştu.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  React.useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Tag className="w-4 h-4" />
          Etiketler
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Etiketler</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Yeni etiket adı..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button onClick={createTag}>
            Ekle
          </Button>
        </div>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-2">
            {tags.map((tag) => (
              <div key={tag.TagID} className="flex items-center justify-between">
                <span>{tag.TagTitle}</span>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600"
                  onClick={() => deleteTag(tag.TagID)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button> */}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
