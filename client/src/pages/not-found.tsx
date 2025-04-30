import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center">
      <Card className="card-gradient w-full max-w-md mx-4">
        <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-4">Page Not Found</h2>

          <p className="text-muted-foreground mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="w-full max-w-[120px] h-[1px] bg-muted-foreground/20 my-4"></div>
          
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/30"
            >
              <path d="M19 14a5 5 0 0 0-7.8 3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a3 3 0 0 0-2 0z" />
              <path d="M18 18h-5a3 3 0 0 0-3 3 1 1 0 0 1-2 0v-7.8a5 5 0 0 1 8 4.8" />
            </svg>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pb-8">
          <Link href="/">
            <Button className="btn-gradient">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
