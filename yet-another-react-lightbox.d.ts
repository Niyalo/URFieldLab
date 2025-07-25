import { Slide } from "yet-another-react-lightbox";

declare module "yet-another-react-lightbox" {
    interface SlideTypes {
        youtube: {
            type: "youtube";
            videoId: string;
            width?: number;
            height?: number;
            start?: number;
            end?: number;
            autoplay?: boolean;
            cc_load_policy?: 1;
            cc_lang_pref?: string;
        };
    }
}