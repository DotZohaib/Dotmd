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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary h-6 w-6 mr-2"
                >
                  <path d="M19 14a5 5 0 0 0-7.8 3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a3 3 0 0 0-2 0z" />
                  <path d="M18 18h-5a3 3 0 0 0-3 3 1 1 0 0 1-2 0v-7.8a5 5 0 0 1 8 4.8" />
                </svg>
                <span className="font-bold text-xl text-gray-800">MediSearch</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/">
                  <div className={`${location === "/" ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                    Home
                  </div>
                </Link>
                <Link href="/history">
                  <div className={`${location === "/history" ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                    History
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => setUploadModalOpen(true)}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Upload Data
                </Button>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <Button 
                variant="ghost" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </Button>
            </div>
          </div>
        </div>
        <div className={`sm:hidden ${mobileMenuOpen ? '' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <div className={`${location === "/" ? "bg-primary-50 border-primary text-primary-700" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}>
                Home
              </div>
            </Link>
            <Link href="/history">
              <div className={`${location === "/history" ? "bg-primary-50 border-primary text-primary-700" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}>
                History
              </div>
            </Link>
            <Button
              variant="ghost"
              onClick={() => setUploadModalOpen(true)}
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              Upload Data
            </Button>
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
