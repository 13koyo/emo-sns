"use client";

import { useEffect, useState } from "react";
import { useAmulet, AmuletPost } from "@/hooks/useAmulet";

type Props = {
    post: AmuletPost;
};

export default function AmuletButton({ post }: Props) {
    const { addAmulet, removeAmulet, isAmulet, amulets } = useAmulet();
    const [isSaved, setIsSaved] = useState(false);

    // amuletsステートが変わったら再判定
    useEffect(() => {
        setIsSaved(isAmulet(post.id));
    }, [amulets, post.id, isAmulet]);

    const toggleAmulet = () => {
        if (isSaved) {
            removeAmulet(post.id);
        } else {
            addAmulet(post);
        }
    };

    return (
        <button
            onClick={toggleAmulet}
            className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ${isSaved ? "text-amber-500 font-medium" : "text-gray-400 hover:text-amber-500"
                }`}
            aria-label={isSaved ? "お守りから外す" : "お守りにする"}
        >
            <span className="text-lg">{isSaved ? "🔖" : "🏷️"}</span>
            <span>{isSaved ? "お守り" : "保存"}</span>
        </button>
    );
}
