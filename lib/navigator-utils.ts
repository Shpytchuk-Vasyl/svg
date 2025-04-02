"use client";
export function copyToClipboard(text: string, toast: any) {
  navigator.clipboard.writeText(text);
  toast({
    title: "Скопійовано",
    description: `Текст "${text}" був скопійований в буфер обміну`,
  });
}

export function downloadFile({
  href,
  linkText,
  toast,
}: {
  href: string;
  linkText: string;
  toast: any;
}) {
  const link = document.createElement("a");
  link.href = href;
  link.download = linkText;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast({
    title: "Файл завантажено",
    description: `Файл "${linkText}" був завантажений`,
  });
}
