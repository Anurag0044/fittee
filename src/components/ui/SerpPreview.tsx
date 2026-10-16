import React from 'react';

interface SerpPreviewProps {
  title: string;
  description: string;
  urlPath?: string;
}

export function SerpPreview({ title, description, urlPath = '/products/example-slug' }: SerpPreviewProps) {
  const displayTitle = title.trim() || 'Product Name — FITTEE Tribal Streetwear';
  const displayDesc =
    description.trim() ||
    'Discover authentic Jharkhand tribal folk art streetwear on 240 GSM organic cotton tees. Wear your roots with pride.';
  const displayUrl = `https://fittee.in${urlPath}`;

  const titleLength = title.length;
  const descLength = description.length;

  return (
    <div className="p-4 rounded-xl bg-[#FAFAF7] dark:bg-[#111310] border border-[#E7E5DF] dark:border-[#2A2C27]">
      <div className="flex items-center justify-between mb-3 text-[11px] font-medium text-[#6B6A63] dark:text-[#9A9A92]">
        <span className="font-semibold uppercase tracking-wider text-[#161714] dark:text-[#F2F1EC]">Google SERP Preview</span>
        <div className="flex items-center gap-3 font-mono">
          <span className={titleLength > 60 ? 'text-[#C0392B]' : 'text-[#6B6A63]'}>
            Title: {titleLength}/60
          </span>
          <span className={descLength > 160 ? 'text-[#C0392B]' : 'text-[#6B6A63]'}>
            Desc: {descLength}/160
          </span>
        </div>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#161815] p-3.5 rounded-lg border border-[#E7E5DF] dark:border-[#2A2C27] font-sans">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-[#B87A22] text-white flex items-center justify-center text-[9px] font-bold">
            F
          </div>
          <div className="text-[12px] text-[#202124] dark:text-[#BDC1C6] truncate leading-tight">
            fittee.in <span className="text-[#5F6368] dark:text-[#9AA0A6]">{urlPath}</span>
          </div>
        </div>

        <h4 className="text-[16px] text-[#1A0DAB] dark:text-[#8AB4F8] hover:underline cursor-pointer font-medium leading-snug truncate">
          {displayTitle}
        </h4>

        <p className="text-[13px] text-[#4D5156] dark:text-[#BDC1C6] mt-1 line-clamp-2 leading-relaxed">
          {displayDesc}
        </p>
      </div>
    </div>
  );
}
