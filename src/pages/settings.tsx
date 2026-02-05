import { Timer, Hammer, ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <Construction className="w-24 h-24 text-blue-600 relative z-10 mx-auto" />
      </div>

      
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Settings Coming Soon
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-md mx-auto mb-8">
      
      </p>

     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 w-full max-w-2xl">
        <div className="p-4 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
          <Hammer className="w-6 h-6 text-orange-500" />
          <span className="font-medium">Dark Mode</span>
        </div>
        <div className="p-4 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
          <Timer className="w-6 h-6 text-blue-500" />
          <span className="font-medium">Multi-Language</span>
        </div>
        <div className="p-4 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
          <Construction className="w-6 h-6 text-green-500" />
          <span className="font-medium">Currency</span>
        </div>
      </div>

    
      <Link to="/">
        <Button className="flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}