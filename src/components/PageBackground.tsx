import { memo } from "react";

const PageBackground = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" 
        style={{ animationDelay: '2s' }} 
      />
    </div>
  );
});

export default PageBackground;
