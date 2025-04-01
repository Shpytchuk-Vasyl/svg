import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SvgViewer } from "@/components/svg-viewer";
import { STYLES } from "../chat/chat-input";
import { GalleryImageMenu } from "../gallery/gallery-image-menu";
import { GalleryImageType } from "@/hooks/use-gallery-images";

export type SVGViewerModalProps = {
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
  image: GalleryImageType;
  setReloadTriger: React.Dispatch<React.SetStateAction<number>>;
  reloadTriger: number;
  isUserGallery: boolean;
};

export function SVGViewerModal({
  isSelected,
  setIsSelected,
  image,
  setReloadTriger,
  reloadTriger,
  isUserGallery,
}: SVGViewerModalProps) {
  return (
    <Dialog open={isSelected} onOpenChange={setIsSelected}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row gap-4 items-center space-y-0">
          <GalleryImageMenu
            image={image}
            onReload={() => setReloadTriger((prev) => prev + 1)}
            isUserGallery={isUserGallery}
          />
          <DialogTitle>Деталі</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <div className="aspect-square w-full bg-background/50 rounded overflow-hidden mb-4 relative">
            <SvgViewer
              reload={reloadTriger}
              url={image.svg_url}
              className="w-full h-full"
            />
          </div>

          <div className="space-y-2">
            <p className="font-medium">{image.prompts.prompt_text}</p>
            <p className="text-sm text-muted-foreground">
              Стиль:{" "}
              {STYLES.find((s) => s.value === image.prompts.style)?.label}
            </p>
            <p className="text-sm text-muted-foreground">
              Створено: {new Date(image.created_at).toLocaleString("uk-UA")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
