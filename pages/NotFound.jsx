
import React from 'react';
import { Link } from 'react-router-dom';
import  Button  from '@/components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-6xl font-bold text-uniplus-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-center text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
