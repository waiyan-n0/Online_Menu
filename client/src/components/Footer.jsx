import { Send } from "lucide-react";

const Footer = ({isEditMode}) => {
    return (
        <footer className="w-full mt-auto py-6 px-4 bg-neutral-950 border-t border-white/10 text-white/70 text-xs shadow-2xl z-20">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-white/60">
                    &copy; {new Date().getFullYear()} All rights reserved.
                </p>

                <div className="flex items-center gap-4">
                    <span className="text-white/70">
                        Developed by{" "}
                        <span className="font-semibold text-white">
                            Wai Yan Naing
                        </span>
                    </span>

                    {isEditMode && (
                        <a href="https://t.me/waiyandev" target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                        >
                            <Send className="w-3.5 h-3.5 text-sky-400"/>
                            <span>@waiyandev</span>
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;