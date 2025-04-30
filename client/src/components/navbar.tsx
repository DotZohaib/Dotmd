import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadModal } from "./file-upload-modal";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-background to-card shadow-md border-b relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-primary rounded-full p-1.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground h-6 w-6"
                  >
                    <path d="M19 14a5 5 0 0 0-7.8 3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a3 3 0 0 0-2 0z" />
                    <path d="M18 18h-5a3 3 0 0 0-3 3 1 1 0 0 1-2 0v-7.8a5 5 0 0 1 8 4.8" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-primary">MediSearch</span>
                  <span className="text-xs text-muted-foreground -mt-1">Pharmacy Management</span>
                </div>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link href="/">
                  <div className={`${location === "/" 
                    ? "border-primary text-primary font-semibold" 
                    : "border-transparent text-foreground/70 hover:border-foreground/30 hover:text-foreground"} 
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Home
                  </div>
                </Link>
                <Link href="/history">
                  <div className={`${location === "/history" 
                    ? "border-primary text-primary font-semibold" 
                    : "border-transparent text-foreground/70 hover:border-foreground/30 hover:text-foreground"} 
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2"
                    >
                      <polyline points="12 8 12 12 14 14" />
                      <path d="M3.05 11a9 9 0 1 1 .5 4" />
                      <path d="M3 16V8" />
                    </svg>
                    History
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setUploadModalOpen(true)}
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Data
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden ml-2 p-2 rounded-md border-primary/20 hover:bg-primary/10"
              >
                <span className="sr-only">Toggle menu</span>
                {mobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`sm:hidden absolute w-full bg-card/95 backdrop-blur-sm shadow-lg transform transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="pt-2 pb-3 space-y-1 p-4">
            <Link href="/">
              <div className={`${location === "/" 
                ? "bg-primary/10 text-primary border-primary" 
                : "border-transparent hover:bg-muted/50 hover:border-foreground/30 hover:text-foreground"} 
                flex items-center px-4 py-3 rounded-lg border-l-4 text-base font-medium cursor-pointer transition-colors`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 mr-3"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </div>
            </Link>
            <Link href="/history">
              <div className={`${location === "/history" 
                ? "bg-primary/10 text-primary border-primary" 
                : "border-transparent hover:bg-muted/50 hover:border-foreground/30 hover:text-foreground"} 
                flex items-center px-4 py-3 rounded-lg border-l-4 text-base font-medium cursor-pointer transition-colors`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 mr-3"
                >
                  <polyline points="12 8 12 12 14 14" />
                  <path d="M3.05 11a9 9 0 1 1 .5 4" />
                  <path d="M3 16V8" />
                </svg>
                History
              </div>
            </Link>
            <div
              className="border-transparent hover:bg-muted/50 hover:border-foreground/30 hover:text-foreground 
                flex items-center px-4 py-3 rounded-lg border-l-4 text-base font-medium cursor-pointer transition-colors"
              onClick={() => {
                setUploadModalOpen(true); 
                setMobileMenuOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-3"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload Data
            </div>
          </div>
        </div>
      </nav>
      <FileUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setUploadModalOpen(false)}
      />
    </>
  );
}
