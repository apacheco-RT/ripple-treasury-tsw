import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [activeSection, setActiveSection] = useState("overview");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Simple scroll spy
      const sections = ["overview", "research", "roadmap", "feedback"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <header className={cn(
      "sticky top-11 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent",
      scrolled ? "glass-header py-3 shadow-lg" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--ds-color-text-secondary)]">Design Strategy v2.0</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["Overview", "Research", "Roadmap"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className={cn(
                "nav-link text-sm font-medium tracking-wide",
                activeSection === item.toLowerCase() ? "text-blue-400" : "text-[var(--ds-color-text-secondary)]"
              )}
            >
              {item}
            </button>
          ))}
        </nav>

        <Button 
          variant="outline" 
          className="hidden md:flex border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
          onClick={() => scrollTo("feedback")}
        >
          Provide Feedback
        </Button>
      </div>
    </header>
  );
}
